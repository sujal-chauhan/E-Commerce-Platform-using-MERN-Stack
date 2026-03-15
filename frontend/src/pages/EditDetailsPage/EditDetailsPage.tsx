import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import './EditDetailsPage.css'
import { Bounce, toast } from "react-toastify"


const EditDetailsPage = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-info") || "{}")

  const [name, setName] = useState<string>(user.name || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();
    setLoading(true);

    try{
      console.log("hehehehehe")
      console.log(user.token)
      const res = await axios.put("http://localhost:5000/user/update",
        {name},
      {headers:{
        Authorization: `Bearer ${user.token}`
      }});

      console.log(`response is : ${res}`)

      const updatedUser = {
        ...user, 
        name: res.data.name ?? name
      };

      localStorage.setItem("user-info", JSON.stringify(updatedUser));

      toast.success("User details updated successfully, please refresh to see updates", {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce
      })

      navigate("/profile")

    }catch(err){
      console.log('Got some error : ', err)

      toast.error("Failed to update user details")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="main-container-edit">
      <div className="container">
        <div className="form-area"> 
          <p className="title">Edit your details here</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label 
                htmlFor="name"
                className="sub-title"  
              >Name</label>
              <input 
                type="text" 
                value={name}
                placeholder="Enter old name"
                className="form-style"
                onChange={(e)=>setName(e.target.value)}
              />
            </div>
            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-back"
              >{
                loading 
                  ? 
                    <span className="btn-front">Saving...</span> 
                  : 
                    <span className="btn-front">Save</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditDetailsPage