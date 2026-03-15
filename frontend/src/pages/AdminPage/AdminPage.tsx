import { useEffect, useState } from "react";
import CreateProductPage from "../../components/createProduct/CreateProductPage";
import UpdateProductPage from "../../components/updateProduct/UpdateProductPage";
import "./AdminPage.css";

import type { Product } from "../../types/Product";
import { getAllProducts } from "../../services/api";
import AdminProductCard from "../../components/AdminProductCard/AdminProductCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Bounce, toast } from "react-toastify";

type ModalType = "create" | "update" | null;

const AdminPage = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data.data.products);
    } catch (err) {
      toast.error("Failed to fetch products", {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal("update");
  };

  const handleUpdateSuccess = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setOpenModal(null);
    setSelectedProduct(null);
  };

  const handleModalClose = () => {
    setOpenModal(null);
    setSelectedProduct(null);
  };

  return (
    <div className="admin-page-container">
      <div className="main-container">
        <div className="admin-page-header">
          <div className="admin-greetings">
            <h1>Greetings Admin, what's on your main ?</h1>
          </div>
          <div
            className="create-product-btn-div"
            style={{ textAlign: "end" }}
          >
            <button
              onClick={() => setOpenModal("create")}
              className="create-product-btn"
            >
              <FontAwesomeIcon icon={faAdd} />
              <span className="create-product-btn-txt">Create New Products</span>
            </button>
          </div>
        </div>

        <div className="products-grid-admin">
          {products.length > 0 ? (
            products.map((product, index) => (
              <AdminProductCard
                key={index}
                product={product}
                onDeleteSuccess={(deletedId) =>
                  setProducts((prev) => prev.filter((p) => p._id !== deletedId))
                }
                onUpdateClick={handleUpdateClick}
              />
            ))
          ) : (
            <p className="no-products-admin">
              {loading ? "Loading products..." : "No products found"}
            </p>
          )}
        </div>

        {openModal && (
          <div className="modal-container">
            {openModal === "create" && (
              <CreateProductPage onClose={handleModalClose} />
            )}
            {openModal === "update" && selectedProduct && (
              <UpdateProductPage
                product={selectedProduct}
                onClose={handleModalClose}
                onUpdateSuccess={handleUpdateSuccess}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
