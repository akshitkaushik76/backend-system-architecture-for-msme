import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddProduct = () => {
  const { BuisnessCode } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/addProduct/${BuisnessCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productName,
            costPrice,
            sellingPrice,
            quantity,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccess(true);

        // reset form
        setProductName("");
        setCostPrice("");
        setSellingPrice("");
        setQuantity("");
      } else {
        setError(data.message || "Failed to add product");
      }
    } catch (err) {
      setError("Server error",err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={headingStyle}>Add Product</h2>

        {success && (
          <div style={successStyle}>
            ✅ Product added successfully
          </div>
        )}

        <input
          type="text"
          placeholder="📦 Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="💰 Cost Price"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="🏷 Selling Price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="🔢 Quantity Purchased"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <p style={errorStyle}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#94a3b8" : "#2563eb",
          }}
        >
          {loading ? "Adding Product..." : "➕ Add Product"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={backButtonStyle}
        >
          ⬅ Back to Dashboard
        </button>
      </form>
    </div>
  );
};

/* ---------- styles ---------- */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#e0f2fe,#f8fafc)",
};

const cardStyle = {
  width: "380px",
  background: "#fff",
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#1e3a8a",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px",
};

const backButtonStyle = {
  marginTop: "18px",
  background: "transparent",
  border: "none",
  color: "#475569",
  cursor: "pointer",
  fontWeight: "600",
  width: "100%",
};

const errorStyle = {
  color: "#dc2626",
  textAlign: "center",
  marginBottom: "10px",
  fontWeight: "600",
};

const successStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "600",
  marginBottom: "15px",
};

export default AddProduct;
