import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HandleRefresh = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const data = localStorage.getItem('user-info');

    if (!data) return;

    let userInfo: any;

    try {
      userInfo = JSON.parse(data);
    } catch {
      userInfo = null;
    }

    if (userInfo && userInfo.token) {
      login(userInfo);

      if (location.pathname === '/' || location.pathname === '/login') {
        navigate('/profile', { replace: false });
      }
    }
  }, [location.pathname, navigate, login]);

  return null;
};

export default HandleRefresh;
