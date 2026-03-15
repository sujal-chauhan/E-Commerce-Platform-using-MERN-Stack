import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {

    const navigate = useNavigate();
  return (
    <>
        <div>
            <h1>
                404
            </h1>
            <h4>
                Page Not Found
            </h4>
            <button
                onClick={()=>navigate('/login')}
            >
                Login
            </button>
        </div>
    </>
  )
}

export default NotFoundPage