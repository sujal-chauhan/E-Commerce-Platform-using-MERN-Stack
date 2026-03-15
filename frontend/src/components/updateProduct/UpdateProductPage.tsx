import React, { useEffect, useState, type FC } from "react";
import { getCategories, updateProduct } from "../../services/api";
import { type Product } from "../../types/Product";
import './UpdateProductPage.css'
import { Bounce, toast } from "react-toastify";

interface UpdateProductInput {
  title: string;
  description: string;
  price: string;
  category: string;
  image: File | null;
  stock: string;
}

interface UpdateProductProps {
  product: Product;
  onClose: () => void;
  onUpdateSuccess?: (updated: Product) => void;
}

const UpdateProductPage: FC<UpdateProductProps> = ({ product, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<UpdateProductInput>({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null,
    stock: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [isOtherCategory, setIsOtherCategory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: null,
      stock: product.stock.toString(),
    });
    setError(null);
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data);

        if (!res.data.data.includes(product.category)) {
          setIsOtherCategory(true);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [product.category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      if (value === "other") {
        setIsOtherCategory(true);
        setFormData((prev) => ({ ...prev, category: "" }));
      } else {
        setIsOtherCategory(false);
        setFormData((prev) => ({ ...prev, category: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files && e.target.files[0]){
      setFormData((prev)=>({
        ...prev, 
        image: e.target.files![0],
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);

      if(formData.image){
        formDataToSend.append("image", formData.image);
      }


      await updateProduct(product._id, formDataToSend);

      toast.success("Product updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce,
      });


      if (onUpdateSuccess) {
        const updatedProduct: Product = { ...product, ...formDataToSend };
        onUpdateSuccess(updatedProduct);
      }

      onClose();
    } catch (err: any) {
      console.error("Failed to update product:", err);
      setError(err.response?.data?.message || "Failed to update product. Please try again.");

      toast.error("Failed to update product, please try again.", {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-product-container">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>

      <div className="update-form-container">
        <h2>Update Product</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="update-product-form">
          <div className="form-group">
            <label htmlFor="title">Product Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Premium Wireless Headphones"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="price">Price ($)*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group half">
              <label htmlFor="stock">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <div className="select-wrapper">
              <select
                id="category"
                name="category"
                value={isOtherCategory ? "other" : formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
            {isOtherCategory && (
              <input
                type="text"
                name="category"
                value={formData.category}
                placeholder="Enter custom category"
                onChange={handleChange}
                required
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload new image</label>
            <input 
              type="file" 
              id="image"
              name="image"
              accept="image/*"
              onChange={handlePhoto}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductPage;
