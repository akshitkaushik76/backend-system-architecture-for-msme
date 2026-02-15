import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const formatDate = (dateStr) => {
 const [ year,month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};


const ProfitPerDay = () => {
  const { OrganisationCode, BuisnessCode } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [profit, setProfit] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProfit(null);

    try {
      const token = localStorage.getItem("ownerToken");

      const res = await axios.get(
        `http://localhost:7600/ilba/profitThisDay/${OrganisationCode}/${BuisnessCode}`,
        {
          params: { date:formatDate(date) },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfit(res.data.profit);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center" }}>📈 Profit Per Day</h2>

        <form onSubmit={fetchProfit}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Calculating..." : "Get Profit"}
          </button>
        </form>

        {profit !== null && (
          <div style={profitBox}>
            💰 Profit on <b>{date}</b> : ₹{profit}
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back
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
};

const cardStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

const profitBox = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "10px",
  background: "#ecfeff",
  textAlign: "center",
  fontWeight: "600",
};

const backBtn = {
  marginTop: "18px",
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
};

export default ProfitPerDay;
