import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user-info');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const googleAuth = async (code: string) => {
  return await axios.get(`${API_BASE_URL}/auth/google?code=${code}`);
};


///////user//////
export const getUserProfile = async () => {
  return await api.get('/user/profile');
};

export const updateUserProfile = async (name: string) => {
  return await api.put('/user/update', { name });
};

export const deleteUserAccount = async () => {
  return await api.delete('/user/account');
};

//////// product//////
export const createProduct = async (productData: FormData) => {
  return await api.post('/api/products', productData);
};

export const getAllProducts = async (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  return await api.get('/api/products', { params });
};

export const getProductById = async (productId: string) => {
  return await api.get(`/api/products/${productId}`);
};

export const updateProduct = async (productId: string, updateData: any) => {
  return await api.put(`/api/products/${productId}`, updateData);
};

export const deleteProduct = async (productId: string) => {
  return await api.delete(`/api/products/${productId}`);
};

export const getCategories = async () => {
  return await api.get('/api/products/categories/list');
};

export const getProductsByCategory = async (
  category: string,
  params?: { page?: number; limit?: number; sort?: string }
) => {
  return await api.get(`/api/products/category/${category}`, { params });
};




////////////// Cart////////////////
export const getCart = async () => {
  return await api.get('/api/cart');
};

export const getCartCount = async () => {
  return await api.get('/api/cart/count');
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  return await api.post('/api/cart', { productId, quantity });
};

export const updateCartItem = async (productId: string, quantity: number) => {
  return await api.put(`/api/cart/${productId}`, { quantity });
};

export const removeCartItem = async (productId: string) => {
  return await api.delete(`/api/cart/${productId}`);
};

export const clearCart = async () => {
  return await api.delete('/api/cart');
};





//////////////// Order API ////////////////// 
export const createOrderFromCart = async () => {
  return await api.post('/api/orders/checkout');
};

// export const buyNow = async (productId: string, quantity: number = 1) => {
//   return await api.post('/api/orders/buy-now', { productId, quantity });
// };

export const getOrders = async () => {
  return await api.get('/api/orders');
};

export const cancelOrder = async (orderId: string) => {
  return await api.put(`/api/orders/${orderId}/cancel`);
};

export const createRazorpayOrderData = async () =>{
  return await api.post('/api/orders/razorpay/order');
} 

export const verifyRazorpayPayment = async (paymentData:any)=>{
  return await api.post('/api/orders/razorpay/verify', paymentData)
}

export default api;