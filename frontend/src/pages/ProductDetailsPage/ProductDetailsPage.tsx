import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/api";
import { type Product } from "../../types/Product";
import "./ProductDetailsPage.css";
import { Bounce, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart } from "../../redux/cartSlice";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate(); 
  const dispatch = useAppDispatch();

  const {loading: cartLoading, productAdding} = useAppSelector((state)=> state.cart)

  useEffect(() => {
    // console.log("inside the product details page") ;
    const fetchProduct = async () => {
      try {
        if (id) {
          const response = await getProductById(id);
          setProduct(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error while fetching product",{
          position: "top-center",
          autoClose: 2000,
          transition: Bounce
        })
      } finally {
        setLocalLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try{
      if (product) {
        await dispatch(addToCart({productId: product._id})).unwrap();
      }
      toast.success("Successfully added to cart",{
        position: "top-center",
        autoClose: 2000,
        transition: Bounce
      });
    }catch(err: any){
      console.error("Failed to add to cart", err);
      toast.error(err?.message || "Failure while adding to cart",{
        position: "top-center",
        autoClose: 2000,
        transition: Bounce
      })
    }
  };

  if (localLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  const isAdding = cartLoading && productAdding === product._id;

  return (
    <div className="product-details-page">
      <div className="product-details-modal">
        <div className="product-details-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <div className="product-main">
            <div className="product-image">
              <img src={`http://localhost:5000/${product.image}`} alt={product.title} />
            </div>
            <div className="product-info">
              <h1>{product.title}</h1>
              <p className="category">{product.category}</p>
              <p className="price">${product.price.toFixed(2)}</p>
              <p className="description">{product.description}</p>
              <div className="actions">
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAdding}
                >
                  {product.stock <= 0 ? "Out of Stock" : isAdding ? "Adding.......": "Add to Cart"}
                </button>
              </div>
              <p className="stock-info">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Currently unavailable"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
