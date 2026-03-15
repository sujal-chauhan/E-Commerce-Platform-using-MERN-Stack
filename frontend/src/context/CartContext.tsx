// import React, { createContext, useContext, useState, useEffect } from 'react';

// import type {ReactNode} from 'react'
// import { getCart, addToCart as addToCartAPI, updateCartItem as updateCartItemAPI, removeCartItem as removeCartItemAPI, clearCart as clearCartAPI, createOrderFromCart } from '../services/api';
// import type { Cart } from '../types/Cart';
// import { useAuth } from './AuthContext';

// import {Bounce, toast} from 'react-toastify';

 
// interface CartContextType {
//   cart: Cart | null;
//   // cart: CartItem[] | null;
//   // cartCount: number | undefined;
//   loading: boolean;
//   productadding: String;
//   fetchCart: () => Promise<void>;
//   addToCart: (productId: string, quantity?: number) => Promise<void>;
//   updateCartItem: (productId: string, quantity: number) => Promise<void>;
//   removeCartItem: (productId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
//   placeOrder: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [cart, setCart] = useState<Cart | null>(null);
//   // const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isProcessingOrder, setIsProcessingOrder] = useState(false);
//   const { isAuthenticated } = useAuth();
//   const [productadding, setprodudct] = useState<String>("")

//   // const cartCount = cart?.items.length ??  0

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchCart();
//     } else {
//       setCart(null);
//     }
//   }, [isAuthenticated]);

//   const fetchCart = async () => {
//     if (!isAuthenticated) return;
    
//     try {
//       setLoading(true);
//       const response = await getCart();
//       // console.log("RESPONSE: ", response)
//       setCart(response.data.data);
//       // setCart(response.data.data.items);
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (productId: string, quantity: number = 1) => {
//     try {
//       setLoading(true);
//       setprodudct(productId)
//       const response = await addToCartAPI(productId, quantity);
//       console.log("RESPONSE AFTER ADDING", response);
//       setCart(response.data.data);
      
//       // setCart(response.data.data.items);
//       setprodudct("") 
//       return Promise.resolve();
//     } catch (error: any) {
//       console.error('Error adding to cart:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCartItem = async (productId: string, quantity: number) => {
//     try {
//       setLoading(true);
//       const response = await updateCartItemAPI(productId, quantity);
//       setCart(response.data.data);
//       // setCart(response.data.data.items);
//       return Promise.resolve();
//     } catch (error) {
//       console.error('Error updating cart item:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeCartItem = async (productId: string) => {
//     try {
//       setLoading(true);
//       const response = await removeCartItemAPI(productId);      
//       setCart(response.data.data);

//       toast.success("Cart item removed successfully",{
//         position: "top-center",
//         autoClose: 2000,
//         transition: Bounce
//       })

//       // setCart(response.data.data.items);
//       fetchCart()       
//     } catch (error) {
//       console.error('Error removing cart item:', error);
//       toast.error("Error removing cart item",{
//         position: "top-center",
//         autoClose: 2000,
//         transition: Bounce
//       })
//       throw error;

//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       setLoading(true);
//       const response = await clearCartAPI();
//       setCart(response.data.data);
//       // setCart(response.data.data.items);

//       toast.success("Cart cleared successfully",{
//         position: "top-center",
//         autoClose: 2000,
//         transition: Bounce
//       })

//       return Promise.resolve();
//     } catch (error) {
//       console.error('Error clearing cart:', error);

//       toast.error("Error clearing cart.",{
//         position: "top-center",
//         autoClose: 2000,
//         transition: Bounce
//       })

//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const placeOrder = async () => {
//     if (isProcessingOrder) return;
    
//     try {
//       setIsProcessingOrder(true);
//       setLoading(true);
//       await createOrderFromCart();

//       toast.success("Order placed successflly.",{
//         position: "top-center",
//         autoClose: 2000,
//         transition: Bounce
//       })

//       await fetchCart();
//     } catch (error) {
//       console.error('Error placing order:', error);

//       toast.error("Error placing order.",{
//         position: "top-center",
//         autoClose: 2000,
//         transition: Bounce
//       })

//       throw error;
//     } finally {
//       setLoading(false);
//       setIsProcessingOrder(false);
//     }
//   };

//   const value = {
//     cart,
//     // cartCount,
//     loading,
//     fetchCart,
//     addToCart,
//     updateCartItem,
//     removeCartItem,
//     clearCart,
//     placeOrder,
//     productadding
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };