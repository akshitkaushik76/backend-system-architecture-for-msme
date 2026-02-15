import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* Convert HTML date (YYYY-MM-DD) -> DB date (DD/MM/YYYY) */
const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const BusinessSales = () => {
  const { BusinessCode } = useParams();   // <-- correct param name
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSales = async (e) => {
    e.preventDefault();

    if (!date) return;

    setLoading(true);
    setError("");
    setSales([]);

    try {
      const token = localStorage.getItem("ownerToken");

      const res = await axios.get(
        `http://localhost:7600/ilba/getSales/${BusinessCode}`,
        {
          params: { date: formatDate(date) },  // IMPORTANT
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSales(res.data.result);

    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "No sales found for this date");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ textAlign: "center" }}>📊 Sales Report</h2>

        <form onSubmit={fetchSales} style={{ marginBottom: "20px" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={input}
          />

          <button style={btn} disabled={loading}>
            {loading ? "Loading..." : "Get Sales"}
          </button>
        </form>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {sales.length > 0 && (
          <div>
            {sales.map((s, i) => (
              <div key={i} style={saleCard}>
                <p><b>Product:</b> {s.productCode}</p>
                <p><b>Quantity:</b> {s.quantity}</p>
                <p><b>Revenue:</b> ₹{s.totalCost}</p>
                <p><b>Profit:</b> ₹{s.profitMade}</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back
        </button>
      </div>
    </div>
  );
};

const page = {
  minHeight: "100vh",
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#0f766e",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const saleCard = {
  padding: "14px",
  marginBottom: "10px",
  borderRadius: "10px",
  background: "#ecfeff",
  border: "1px solid #67e8f9",
};

const backBtn = {
  marginTop: "15px",
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
};

export default BusinessSales;
