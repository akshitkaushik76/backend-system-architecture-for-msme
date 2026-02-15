import { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmpassword: ""
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:7600/ilba/RegisterOwner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("ownerEmail",formData.email);
        localStorage.setItem("token", data.token);
        setSuccess("🎉 Signup successful! Redirecting...");
        
        

        setFormData({
          Name: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmpassword: ""
        });
        setTimeout(()=>{
            window.location.href = "/dashboard";
        },1200);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.",err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Owner Signup</h2>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}

        <input
          type="text"
          name="Name"
          placeholder="Owner Name"
          value={formData.Name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmpassword"
          placeholder="Confirm Password"
          value={formData.confirmpassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
