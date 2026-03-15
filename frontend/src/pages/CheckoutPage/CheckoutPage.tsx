import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrderFromCart } from '../../redux/orderSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createRazorpayOrderData, verifyRazorpayPayment } from '../../services/api';

import { toast } from 'react-toastify';

import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {cart} = useAppSelector((state)=> state.cart)
  const {user} = useAppSelector((state)=> state.auth)
  const hasTriggered = useRef(false);

  useEffect(() => {

    const initiatePayment = async() =>{
      if(hasTriggered.current) return;

      hasTriggered.current = true;

      try{
        setLoading(true);

        const response = await createRazorpayOrderData();
        const {order_id, amount, currency} = response.data;
 
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || 'vite_razorpay_key',
          amount: amount,
          currency: currency,
          name: 'FastCom',
          description: 'Order payment',
          order_id: order_id,

          handler: async(response:any)=>{
            try{
              setLoading(true);

              const verificationResponse = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if(verificationResponse.data.success){
                toast.success('Payment Successful');
                setLoading(false);
                setTimeout(()=> navigate('/orders'), 2000);
              }
            }catch(err: any){
              setError(err.response?.data?.message || 'Payment verification failed');
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#3399cc',
          },
          modal: {
            ondismiss: () =>{
              setLoading(false);
              setError('Payment cancelled by user');
            }
          }
        };

        const rzp = new(window as any).Razorpay(options);
        rzp.open();
      }catch(err: any){
        setError(err.response?.data?.message || 'Failed to initiate payment')
        setLoading(false);
      }
    };

    if(cart && cart.items.length > 0){
      initiatePayment();
    }else if(!loading){
      navigate('/cart');
    }

    // const handlePlaceOrder = async () => {
    //   if (hasTriggered.current) return; //preventing double trigger
    //   hasTriggered.current = true;
 
    //   try {
    //       await dispatch(createOrderFromCart()).unwrap();
    //       setLoading(false);
          
    //       setTimeout(() => {
    //         navigate('/orders');
    //       }, 3000);
      

    //   } catch (err: any) {
    //     setError(err || 'Failed to place order');
    //     setLoading(false);
    //   }
    // };

    // handlePlaceOrder();



  }, [cart, user, navigate]);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="checkout-status">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Initializing payment gateway...</p>
            </div>
          ) : (error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => navigate('/cart')} className="retry-btn">Return to Cart</button>
            </div>
          ) : (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <p>Payment Verified! Redirecting...</p>
              <button onClick={() => navigate('/orders')} className="view-orders-btn">View Orders Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
