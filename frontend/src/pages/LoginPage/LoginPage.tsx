import { useGoogleLogin, type CodeResponse } from '@react-oauth/google'
import {googleAuth} from '../../services/api'
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAppDispatch } from '../../redux/hooks';
import { login } from '../../redux/authSlice';


const LoginPage = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  

  const resSuccessFn = async(authRes:CodeResponse)=>{
    try{
      if(authRes['code']){
        const result = await googleAuth(authRes['code'])

        const {name, email, role} = result.data.user
        const {token} = result.data

        console.log(`the token is : ${token}`)
        const obj = {name, email, token, role}
        await dispatch(login(obj))
        navigate('/home')

        console.log(`result is : ${result.data.user}`)
        console.log(`token is : ${result.data.token}`)
      }
      console.log("hellooooo");
    }catch(err){
      console.log("Error while requesting code from google : ", err)
    }
  }

  const resErrorFn = async()=>{
    console.log("Error")
  }

  const googleLogin = useGoogleLogin({
    onSuccess:resSuccessFn,
    onError:resErrorFn,
    flow:'auth-code',
    redirect_uri: 'http://localhost:5173'
  }) 
  
  return (
    <div className="login-page-container">
      <main className="login-content">
        <div className="login-card">
          <header className="login-header">
            <h1>Welcome Back</h1>
            <p>Please sign in to continue your shopping experience</p>
          </header>

          <button
            className="google-login-button"
            onClick={() => googleLogin()}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google Icon" 
              className="google-icon"
            />
            Sign in with Google
          </button>

          <footer className="login-footer">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default LoginPage