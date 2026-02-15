import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SettleCredit = () => {
  const { BuisnessCode } = useParams();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("ownerToken");

      const res = await axios.post(
        `http://localhost:7600/ilba/SettleCreditChunk/${BuisnessCode}`,
        { phoneNumber, amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessage(res.data.message);
      setPhoneNumber("");
      setAmount("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>💳 Settle Customer Credit</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Customer Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Amount Paid"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading ? "#9ca3af" : "#16a34a"
            }}
          >
            {loading ? "Processing..." : "Settle Credit"}
          </button>
        </form>

        {message && (
          <div style={successStyle}>
            ✅ {message}
          </div>
        )}

        <button onClick={() => navigate(-1)} style={backBtnStyle}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

/* ---------- STYLES ---------- */

const pageStyle = {
  minHeight: "100vh",
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const cardStyle = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "14px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
};

const headingStyle = {
  marginBottom: "20px",
  textAlign: "center",
  color: "#1f2937"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "600"
};

const successStyle = {
  marginTop: "16px",
  padding: "12px",
  borderRadius: "10px",
  background: "#ecfdf5",
  color: "#065f46",
  textAlign: "center",
  fontWeight: "500"
};

const backBtnStyle = {
  marginTop: "20px",
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto"
};

export default SettleCredit;
