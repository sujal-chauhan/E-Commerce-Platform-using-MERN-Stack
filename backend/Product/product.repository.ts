import Product from './product.model.ts';


interface ProductFilter{
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  search?: string,
  createdBy?: string;
}

interface ProductData{
  title: string;
  description: string,
  price: number;
  category: string;
  image: string;
  stock: number;
  createdBy: string;
}

class ProductRepository {
  // get all the peoducts
  async findAll(filters: ProductFilter = {}) {
    try{
      const {category, minPrice, maxPrice, search, createdBy} = filters;
      const query : Record<string, any> = {};

      if(category){
        query.category = category;
      }

      if(minPrice !== undefined || maxPrice !== undefined){
        query.price = {};

        if(minPrice !== undefined) query.price.$gte = minPrice;  //{$gte: 100}
        if(maxPrice !== undefined) query.price.$lte = maxPrice;
      }

      //filter by creator
      if(createdBy){
        query.createdBy = createdBy;
      }

      if(search){
        query.$text = {$search: search};
      }

      const [products] = await Promise.all([
        Product.find(query)
          .populate('createdBy', 'name email')
          .lean(),

        Product.countDocuments(query)
      ]);
      return{
        products
      };
      
    }catch(error){
      console.error("error in findAll", error);
      throw new Error('Failed to fetch products')
    }
  }


  // find product by the id
  async findById(id: string) {
    try{
      return await Product.findById(id)
        .populate('createdBy', 'name email')
        .lean()   
    }catch(error){  
      console.error("error in findById: ", error);
      throw new Error("Failed to fetch product by id")
    }
  }

  async create(productData:ProductData){
    try{
      const product = await Product.create(productData);
      return await Product.findById(product._id)
        .populate('createdBy', 'name email')
        .lean()
    }catch(error){
      console.error("error in create: ", error);
      throw new Error("Failed to create product")
    }
  }


  async update(id: string, updateData: Partial<ProductData>){
    try{
      return await Product.findByIdAndUpdate(
        id,
        { 
          $set: updateData,
          $unset: { images: 1 }
        },
        { new: true }
      )
      .populate('createdBy', 'name email')
      .lean()
    }catch(error){
      console.error("error in update: ", error)
      throw new Error("Failed to update product")
    }
  }

  async delete(id: string){
    try{
      return await Product.findByIdAndDelete(id).lean()
    }catch(error){
      console.error("error in delete: ", error)
      throw new Error("Failed to delete product")
    }
  }

  async getCategories(){
    try{
      return await Product.distinct('category');
    }catch(error){
      console.error("error in getCategories: ", error);
      throw new Error("Failed to get categories")
    }
  }


  //get products by categories
  async findByCategory(category: string){
    try{
      const [products] = await Promise.all([
        Product.find({category})
          .populate('createdBy', 'name email')
          .lean(),

        Product.countDocuments({category}),
      ]);
      return{
        products,
      };
    }catch(error){
      console.error("Error in findByCategory: ",error)
      throw new Error("Failed to fetch products by category")
    }
  }


  async deleteAll() {
    try{
      return await Product.deleteMany({});
    }catch(error){
      console.error("error in deleteAll", error)
      throw new Error("Failed to delete all products")
    }
  }

  //check if products existss
  //count total products

  async count(){
    try{
      return Product.countDocuments();
    }catch(error){
      console.error("error in count: ", error);
      throw new Error("Failed to count products");
    }
  }

  async createMany(productsData: any[]) {
    return await Product.insertMany(productsData, { ordered: false });
  }

  
  async updateStock(productId: string, quantity: number) {
    try {
      const result = await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!result) {
        throw new Error('Product not found for stock update');
      }
      return result;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock');
    }
  }

  //order cancel krne ke baad stock ko restore krne ke liye
  async restoreStock(productId: string, quantity: number) {
    try {
      const result = await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: quantity } },
        { new: true }
      );
      if (!result) {
        throw new Error('Product not found for stock restoration');
      }
      return result;
    } catch (error) {
      console.error('Error restoring stock:', error);
      throw new Error('Failed to restore stock');
    }
  }


  //to check product exists or not
  async exists(id: string){
    try{
      const count = await Product.countDocuments({_id: id});
      return count > 0;
    }catch(error){
      console.error("error in exists: ", error)
      return false;
    }
  }

}

export default new ProductRepository();
