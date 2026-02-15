import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CreateSale = () => {
  const { OrganisationCode, BuisnessCode } = useParams();
  const navigate = useNavigate();

  const [productCode, setProductCode] = useState("");
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
        `http://localhost:7600/ilba/addSales/${OrganisationCode}/${BuisnessCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productCode,
            quantity,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccess(true);
        setProductCode("");
        setQuantity("");
      } else {
        setError(data.message || "Failed to create sale");
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
        <h2 style={headingStyle}>Create Sale</h2>

        {success && (
          <div style={successStyle}>
            ✅ Sale recorded successfully
          </div>
        )}

        <input
          type="text"
          placeholder="🧾 Product Code"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="🔢 Quantity Sold"
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
            backgroundColor: loading ? "#94a3b8" : "#dc2626",
          }}
        >
          {loading ? "Processing Sale..." : "➕ Create Sale"}
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
  background: "linear-gradient(135deg,#fee2e2,#f8fafc)",
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
  color: "#7f1d1d",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
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

export default CreateSale;
