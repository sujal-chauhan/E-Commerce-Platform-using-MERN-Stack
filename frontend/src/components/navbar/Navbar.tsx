import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import './Navbar.css';
import myimg from "../../assets/ecom-logo.png" 

import { logout } from '../../redux/authSlice';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faHouse,
    faCartPlus,
    faCartArrowDown,
    faUserPen,
    faUser,
} from "@fortawesome/free-solid-svg-icons"

 

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {isAuthenticated, user} = useAppSelector((state)=> state.auth)
  const {cart} = useAppSelector((state)=> state.cart)


  const count = cart?.items.length ?? 0
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  // console.log(window.location.pathname)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-brand">
          <div className='logo-section'>
            <img 
            src={myimg}
            alt='FastCom Logo'
            className='site-logo'
            style={{"width": "35px","height": "35px","borderRadius": "50%" }}
          />
            FastCom
          </div>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/home" className="nav-link">
            <FontAwesomeIcon icon={faHouse}/>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/cart" className="nav-link cart-link">
                <FontAwesomeIcon icon={faCartPlus}/>
                Cart
                {cart && count > 0 && <span className="cart-badge">{count}</span>}
              </NavLink>

              <NavLink to="/orders" className="nav-link">
                <FontAwesomeIcon icon={faCartArrowDown}/>
                Orders
              </NavLink>

              {user?.role === "admin" &&
                <NavLink to="/admin-page" className="nav-link">
                  <FontAwesomeIcon icon={faUserPen}/>
                  Admin
                </NavLink> 
              }
              <div className='overlay'></div>

              <div className="user-menu">
                <span className="user-name">
                  <FontAwesomeIcon icon={faUser}/>
                  {user?.name || 'User'}
                </span>
                <div className="dropdown-menu">
                    <NavLink to="/profile" className="dropdown-item"
                    >
                      <p>Profile</p>
                    </NavLink>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      Logout
                    </button>
                </div>
              </div>
            </>
          ) : (
            <NavLink to="/login" className="nav-link login-btn">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;