import React, { useState } from "react";
import { type Product } from "../../types/Product";
import "../products/ProductCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faPen,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { deleteProduct } from "../../services/api";
import { Bounce, toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
  onDeleteSuccess: (deletedId: string) => void;
  onUpdateClick: (product: Product) => void;
}

const AdminProductCard: React.FC<ProductCardProps> = ({ product, onDeleteSuccess, onUpdateClick }) => {
  const image =`http://localhost:5000/${product.image}`;
  const [showOptions, setShowOptions] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProduct(product._id);
      onDeleteSuccess(product._id);
      setShowOptions(false);

      toast.success(`Product "${product.title}" deleted successfully`, {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce,
      });
    } catch (err: any) {
      console.error("Failed to delete product: ", err);

      toast.error("Failed to delete the product, please try again.", {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce,
      });
    }
  };

  const handleUpdate = () => {
    onUpdateClick(product);
    setShowOptions(false);
  };

  return (
    <>
      {showOptions === false ? (
        <div className="product-card">
          <div className="product-card-image">
            <img src={image} alt={product.title} />
          </div>

          <div className="product-card-body">
            <h3>{product.title}</h3>

            <p className="product-description">
              {product.description.length > 80
                ? product.description.slice(0, 80) + "..."
                : product.description}
            </p>

            <div className="product-card-footer">
              <strong>
                <strong>${product.price.toFixed(2)}</strong>
              </strong>

              <span
                className="product-stock"
                style={{ fontSize: "12px", fontWeight: "600" }}
              >
                Stock : {product.stock}
              </span>

              <button
                className="edit-options-btn"
                onClick={() => setShowOptions(true)}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="product-card">
          <div className="options-header">
            <button
              className="options-close-btn"
              onClick={() => setShowOptions(false)}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <div className="admin-options">
            <div className="admin-update-product">
              <button onClick={handleUpdate}>
                <FontAwesomeIcon icon={faPenToSquare} />
                Update Product
              </button>
            </div>

            <div className="admin-delete-product">
              <button onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrashCan} />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductCard;
