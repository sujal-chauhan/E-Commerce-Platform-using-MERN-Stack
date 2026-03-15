import type { Request, Response } from 'express';
import productRepository from './product.repository.ts';

class ProductController {
  
  async createProduct(req: Request, res: Response): Promise<void>{
    try{
      const {title, description, price, category, image, stock, rating} = req.body;

      if (!title || !description || !price || !category) {
        res.status(400).json({
          success: false,
          message: 'please provide all requied fields',
        });
        return;
      }

      if (!req.user || !req.user._id) {
        res.status(401).json({
          success: false,
          message: 'User authentication required',
        });
        return;
      }

      if(!req.file){
        res.status(400).json({
          success: false,
          message: "Product image is required",
        })
        return;
      }
 
      const imagePath = req.file.path;

      const productData = {
        title,
        description,
        price: parseFloat(price),
        category,
        image: imagePath,
        rating: typeof rating === 'string' ? { rate: parseFloat(rating), count: 0 } : (rating || { rate: 0, count: 0 }),
        stock: stock !== undefined ? parseInt(stock) : 0,
        createdBy: req.user!._id, 
      };

      const product = await productRepository.create(productData);

      res.status(201).json({
        success: true,
        message: 'product created successfully',
        data: product,
      });
    }catch(error: any){
      console.error('error while creating your product:', error);
      res.status(500).json({
        success: false,
        message: 'failed to create your product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }



  async getAllProducts(req: Request, res: Response): Promise<void>{
    try{
      const {
        category,
        minPrice,
        maxPrice,
        search,
        sort = '-createdAt',
      } = req.query;

      const filters: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
      } = {};

      if (category) filters.category = category as string;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (search) filters.search = search as string;

      const result = await productRepository.findAll(filters);


      res.status(200).json({
        success: true,
        message: 'products fetched successfully',
        data: result,
      });
    }catch(error: any){
      console.error('error while fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'failed to fetch products',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }



  async getProductById(req: Request, res: Response): Promise<void> {
    try{
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID parameter',
        });
        return;
      }
      const product = await productRepository.findById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.json({
        success: true,
        data: product,
      });
    }catch(error: any){
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }



  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; 
      const updateData = req.body;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID parameter',
        });
        return;
      }

      //remocind fields that should not be updated
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

     
      if (req.file) {
        updateData.image = req.file.path;
      }

      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.stock) updateData.stock = parseInt(updateData.stock);

      const product = await productRepository.update(id, updateData);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'product not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'product updated successfully',
        data: product,
      });
    } catch (error: unknown) {
      console.error('error while updating oyur product:', error);
      res.status(500).json({
        success: false,
        message: 'failed to update product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }


  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID parameter',
        });
        return;
      }

      const product = await productRepository.delete(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'no such product exists broooo...',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: product,
      });
    } catch (error: unknown) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }


  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await productRepository.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: unknown) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }


  async getProductsByCategory(req: Request, res: Response):Promise<void>{
    try{
      const { category } = req.params;
      
      if (!category || typeof category !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid category parameter',
        });
        return;
      }
      
      const result = await productRepository.findByCategory(category);
      res.json({
        success: true,
        data: result.products,
      });

    } catch (error: unknown) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

}


export default new ProductController();
