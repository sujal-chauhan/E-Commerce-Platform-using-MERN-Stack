import { type ReactNode } from 'react';
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage/LoginPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import EditDetailsPage from "./pages/EditDetailsPage/EditDetailsPage"
import HomePage from "./pages/HomePage/HomePage"
import CartPage from "./pages/CartPage/CartPage"
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage"
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage"
import OrdersPage from "./pages/OrdersPage/OrdersPage"
import NotFoundPage from "./pages/NotFoundPage"
import { GoogleOAuthProvider } from '@react-oauth/google';
// import HandleRefresh from "./components/HandleRefresh"

// testingggggg

import { useAppDispatch, useAppSelector } from './redux/hooks';

import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'



import './App.css'
import Navbar from './components/navbar/Navbar';

import AdminPage from './pages/AdminPage/AdminPage';

interface PrivateRouteProps {
  element: ReactNode;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AdminRouteProps{
  element: ReactNode;
  isAdmin: boolean;
  loading: boolean;
}

const PrivateRoute = ({ element, isAuthenticated, loading }: PrivateRouteProps) => {
  if (loading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }
  return isAuthenticated ? (element as React.ReactElement) : <Navigate to="/login" />;
};

const AdminRoute = ({element, isAdmin, loading}: AdminRouteProps)=>{
  if(loading){
    return(
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }
  return isAdmin ? (element as React.ReactElement) : <Navigate to="/home"/>
}


const GoogleAuthWrapper = () => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <LoginPage />
    </GoogleOAuthProvider>
  );
};

function AppContent() {
  const { isAuthenticated, loading, isAdmin } = useAppSelector((state)=> state.auth);

  return (
    <>
      {/* <Toaster /> */}
      <Navbar />
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/login" element={<GoogleAuthWrapper />} />

        <Route
          path="/profile"
          element={<PrivateRoute element={<ProfilePage />} isAuthenticated={isAuthenticated} loading={loading} />}
        />

        <Route
          path="/cart"
          element={<PrivateRoute element={<CartPage />} isAuthenticated={isAuthenticated} loading={loading} />}
        />

        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route
          path="/checkout"
          element={<PrivateRoute element={<CheckoutPage />} isAuthenticated={isAuthenticated} loading={loading} />}
        />

        <Route
          path="/orders"
          element={<PrivateRoute element={<OrdersPage />} isAuthenticated={isAuthenticated} loading={loading} />}
        />

        <Route path="/edit-details" element={<EditDetailsPage />} />


        <Route
          path='/admin-page'
          element={<PrivateRoute element={<AdminRoute element={<AdminPage/>} isAdmin={isAdmin} loading={loading} />} isAuthenticated={isAuthenticated} loading={loading}/>}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
          {/* <HandleRefresh /> */}
          <AppContent />
    </BrowserRouter>
  )
}

export default App
