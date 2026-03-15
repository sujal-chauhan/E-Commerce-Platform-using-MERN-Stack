import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../../redux/cartSlice";
import {Bounce, toast} from "react-toastify";


const CartPage: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {cart, loading} = useAppSelector((state)=> state.cart)

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (
    productId: string,
    currentQuantity: number,
    delta: number,
  ) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      try{
        await dispatch(updateCartItem({productId,quantity:newQuantity})).unwrap();
      }catch(err:any){
        toast.error(err?.message || "Failed to update quantity",{
          position: "top-center",
          autoClose: 2000,
          transition: Bounce
        });
      }
    }
  };

  const handleRemoveItem = async(productId: string)=>{
    try{
      await dispatch(removeCartItem({productId})).unwrap();
      toast.info("Item removed from cart",{
        position: "top-center",
        autoClose: 2000,
        transition: Bounce
      })
    }catch(err: any){
      toast.error(err?.message || "Failed to remove item");
    }
  }

  const handleClearCart = async() =>{
    if(window.confirm("Are you sure that you want to clear your entire cart ???")){
      try{
        await dispatch(clearCart()).unwrap();
        toast.success("Cart cleared successfully");
      }catch(err:any){
        toast.error(err?.message || "Failed to clear cart");
      }
    }
  }

 

  if (loading && !cart) {
    return (
      <div className="cart-page-loading">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return ( 
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Shopping Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="empty-cart-message">
            <p>Your cart is empty.</p>
            <Link to="/home" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {(cart.items).map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={`http://localhost:5000/${item.image}`}
                      alt={item.title}
                      onClick={() => navigate(`/products/${item.productId}`)}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3 onClick={() => navigate(`/products/${item.productId}`)}>
                      {item.title}
                    </h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity,
                            -1,
                            )
                        }
                        disabled={item.quantity <= 1 || loading}
                        
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity, 1)
                        }
                        disabled={item.quantity >= item.stock || loading}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <p className="item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>$19</span>
              </div>
              <div className="summary-row">
                <span>Handeling Charge</span>
                <span>$5</span>
              </div>
              <div className="summary-row" style={{ color: "green" }}>
                <span>Free Delivery</span>
                <span>-$19</span>
              </div>
              <div className="summary-row" style={{ color: "green" }}>
                <span>No Handeling Charge</span>
                <span>-$5</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
              <button 
                className="clear-cart-btn" 
                onClick={handleClearCart}
                disabled={loading}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
