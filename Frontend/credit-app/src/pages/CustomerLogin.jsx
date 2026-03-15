import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerLogin.css";

export default function CustomerLogin() {

  const [emailid,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState(false);
  const navigate  = useNavigate();
  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      setLoading(true);

      const res = await axios.post("http://localhost:7600/ilba/loginCustomer",{
        emailid,
        password
      });

    //   alert(res.data.message);

    //   localStorage.setItem("token",res.data.token);
    setSuccess(true)
    localStorage.setItem("token",res.data.token);
    localStorage.setItem("customerEmail",res.data.email);
    localStorage.setItem("phone",res.data.phone);

    setTimeout(()=>{
        navigate("/customer-dashboard")
    },2000)

    }catch(err){
      alert(err.response?.data?.message);
    }finally{
      setLoading(false);
    }
  }

  return (

    <div className="login-page">

  <div className="glow-circle"></div>

  {success && (
    <div className="login-success">
        Login Successfull
        </div>
  )}

  <div className="login-card">
  <h1 className="logo">FINVENTORY</h1>
    <h2>Customer Login</h2>

    <form onSubmit={handleSubmit}>

      <input
        type="email"
        placeholder="Enter your email"
        value={emailid}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">
        Login
      </button>

    </form>

   <p className="back-home" onClick={() => navigate('/')}>
  ← Back to Home
</p>

  </div>

</div>
   
  );
}