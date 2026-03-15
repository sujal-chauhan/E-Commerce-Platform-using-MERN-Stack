import React, { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories } from "../../services/api";
import "./CreateProductPage.css";
import {Bounce, toast} from 'react-toastify'

interface CreateProductInput {
  title: string;
  description: string;
  price: string;
  category: string;
  image: File | null;
  stock: string;
}

interface CreateProductProps {
  onClose: () => void;
}

const CreateProductPage: FC<CreateProductProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateProductInput>({
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
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories brother!", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "category" && e.target instanceof HTMLSelectElement) {
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

  const handlePhoto = (e:React.ChangeEvent<HTMLInputElement>) =>{
    if(e.target.files && e.target.files[0]){
      setFormData((prev)=>({
        ...prev,
        image: e.target.files![0],
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.image
    ) {
      setError("Please fill in all required fields.");

      toast.error("Please fill in all required fields.",{
        position:"top-center",
        autoClose: 2000, 
        transition: Bounce
      })

      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);

      if(formData.image){
        formDataToSend.append("image", formData.image)
      }

      // const productData = {
      //   ...formData,
      //   price: parseFloat(formData.price),
      //   stock: parseInt(formData.stock) || 0,
      //   image: formData.image.split(",").map((url) => url.trim()),
      // };

      const response = await createProduct(formDataToSend);

      if (response.data.success) {
        setSuccess("Product created successfully!");
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "",
          image: null,
          stock: "",
        });

        toast.success("Product created successfully.",{
        position:"top-center",
        autoClose: 2000,
        transition: Bounce
      })

        setTimeout(() => navigate("/home"), 2000);
      } else {
        setError(response.data.message || "Failed to create product.");

        toast.error("Failed to create product!",{
        position:"top-center",
        autoClose: 2000,
        transition: Bounce
      })
      }
    } catch (err: any) {
      console.error("Error creating product:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the product.",
      );

      toast.error("An error occured while creating the product.",{
        position:"top-center",
        autoClose: 2000,
        transition: Bounce
      })
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <div className="form-header">
        <h2>List a New Product</h2>
      </div>

      <div className="form-content">
        <form 
          onSubmit={handleSubmit} 
          className="product-form"
          encType='multipart/form-data'  
        >
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
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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
                className="mt-2"
                required
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="images">Image URLs* (Comma separated)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handlePhoto}
              // placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          {/* button */}
          <div className="form-footer">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
