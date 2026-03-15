import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OrdersPage.css';
import { Bounce, toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchOrders, cancelOrder, clearOrderError } from '../../redux/orderSlice';

import type{ Order } from '../../types/Order';

const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {orders, loading, error} = useAppSelector((state)=> state.orders);

 
  useEffect(() => {
    dispatch(fetchOrders());

    return()=>{
      dispatch(clearOrderError());
    }
  }, [dispatch]);



  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        // Refresh orders list

        toast.success("Order cancelled successfully",{
          position: "top-center",
          autoClose: 2000,
          transition: Bounce
        })
      } catch (err: any) {
        // alert(err.response?.data?.message || 'Failed to cancel order');
        console.error("Failed to cancel order",err)

        toast.error("Failed to cancel order",{
          position: "top-center",
          autoClose: 2000,
          transition: Bounce
        })
      }
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loader"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={()=>dispatch(fetchOrders())} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="orders-page">
      <div className="orders-container">
        <h1>Your Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/home" className="shop-now-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order: Order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <div className="info-item">
                      <span className="info-label">Order Placed</span>
                      <span className="info-value">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total</span>
                      <span className="info-value">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Order #</span>
                      <span className="info-value">{order.orderId}</span>
                    </div>
                  </div>
                  <div className={`order-status status-${order.status}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img 
                        src={`http://localhost:5000/${item.image}`} 
                        alt={item.title} 
                        className="item-img"
                        onClick={()=> navigate(`/products/${item.productId}`)}
                        />
                      <div className="item-details">
                        <h4
                          onClick={()=> navigate(`/products/${item.productId}`)}
                        >{item.title}</h4>
                        <div className="item-meta">
                          Quantity: {item.quantity} | Price: ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {order.status !== 'cancelled' && (
                  <div className="order-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order.orderId)}
                      disabled={loading}
                    >
                      {loading? "Processing..." : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
