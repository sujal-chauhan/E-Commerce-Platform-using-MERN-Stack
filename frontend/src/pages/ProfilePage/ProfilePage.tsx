// import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'
// import { useAuth } from '../../context/AuthContext';
// import  type{ UserInfo } from '../../types/User';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import { logout } from '../../redux/authSlice';

 

const ProfilePage = () => {
  const navigate = useNavigate();
  // const {logout} = useAuth();
  const dispatch = useAppDispatch();

  // const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  // useEffect(()=>{
  //   const data = localStorage.getItem('user-info')
  //   if (data) {
  //       try {
  //           const userData = JSON.parse(data)
  //           setUserInfo(userData)
  //       } catch (error) {
  //           console.error("Failed to parse user info", error)
  //       }
  //   }
  // }, [])

  const {user} = useAppSelector((state)=> state.auth)
 
  const handleLogout = async () =>{
    // logout();
    await dispatch(logout());
    console.log("logged out successfully using rrreeddduuuxxxxx")
    navigate('/login')
  }

  return (
    <div className="main-container-profile">
      <div className="container">
        <div className='profile-container'>
          <div className='title-p'>Welcome back:<span className='user-name'>{user?.name || 'User'}</span></div>
          <div className="email-group">
            <h3>Email</h3>
            <h4>{user?.email || 'N/A'}</h4>
          </div>
            <h5>You can edit your details: </h5>
          <button
            className='edit-btn'
            onClick={()=> navigate('/edit-details')}
          >
            <span className='edit-btn-front'>
              Edit Details
            </span>
          </button>

          <h5>To log out click on following button:  </h5>
          <button
            className='logout-btn'
            onClick={handleLogout}
          >
            <span className='logout-btn-front'>
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage