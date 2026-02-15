import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    OrganisationCode: "",
    Name: "",
    emailid: "",
    phoneNumber: "",
    password: "",
    confirmpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:7600/ilba/CustomerRegister",
        formData
      );

      if (res.data.status === "success") {
        setMessage("🎉 Registration successful! Check your email.");

        // optional: auto login
        localStorage.setItem("customerToken", res.data.token);
        localStorage.setItem(
          "customerData",
          JSON.stringify(res.data.Customerdata)
        );

        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🧾 Customer Registration</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="OrganisationCode"
            placeholder="Organisation Code"
            value={formData.OrganisationCode}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="Name"
            placeholder="Full Name"
            value={formData.Name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="emailid"
            placeholder="Email Address"
            value={formData.emailid}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading ? "#94a3b8" : "#16a34a",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}

        <p style={footerText}>
          Already registered?{" "}
          <span style={linkStyle} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #ecfeff, #f8fafc)",
};

const cardStyle = {
  background: "#fff",
  padding: "34px",
  borderRadius: "18px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "22px",
  color: "#065f46",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};

const errorStyle = {
  marginTop: "14px",
  color: "#dc2626",
  textAlign: "center",
  fontWeight: "600",
};

const successStyle = {
  marginTop: "14px",
  color: "#15803d",
  textAlign: "center",
  fontWeight: "600",
};

const footerText = {
  marginTop: "18px",
  textAlign: "center",
  fontSize: "14px",
};

const linkStyle = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: "600",
};

export default CustomerRegister;
