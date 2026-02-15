import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CreditManager = () => {
  const { organisationCode, businessCode } = useParams();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [creditInfo, setCreditInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCredit = async () => {
    if (!phoneNumber) {
      setError("Please enter a phone number");
      return;
    }

    setLoading(true);
    setError("");
    setCreditInfo(null);

    try {
      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/getCreditphno/${organisationCode}/${businessCode}?phoneNumber=${phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setCreditInfo(data.creditinfo);
      } else {
        setError(data.message || "No credit info found");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Function to color rows based on status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "#d1fae5"; // green
      case "partially-paid":
        return "#fef9c3"; // yellow
      case "unpaid":
        return "#fee2e2"; // red
      default:
        return "#f0f0f0"; // default gray
    }
  };

  const thStyle = {
    padding: "8px",
    borderBottom: "1px solid #cbd5e1",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #e2e8f0",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "30px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          background: "#1e293b",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>

      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "25px",
          maxWidth: "800px",
          margin: "0 auto",
          overflowX: "auto",
        }}
      >
        <h2>💳 Credit Manager</h2>

        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Enter customer phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginRight: "10px",
              width: "60%",
            }}
          />
          <button
            onClick={fetchCredit}
            disabled={loading}
            style={{
              padding: "10px 16px",
              background: "#f59e0b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Fetching..." : "Get Credit Info"}
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {creditInfo && creditInfo.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              background: "#ecfeff",
              padding: "12px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            <h4>Credit Records:</h4>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#dbeafe" }}>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Quantity</th>
                  <th style={thStyle}>Total (₹)</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Issued</th>
                  <th style={thStyle}>Settle Date</th>
                  <th style={thStyle}>Unique Code</th>
                </tr>
              </thead>
              <tbody>
                {creditInfo.map((c) => (
                  <tr key={c._id} style={{ background: getStatusColor(c.status) }}>
                    <td style={tdStyle}>{c.product || c.productcode}</td>
                    <td style={tdStyle}>{c.quantity}</td>
                    <td style={tdStyle}>{c.totalCost}</td>
                    <td style={tdStyle}>{c.status || "N/A"}</td>
                    <td style={tdStyle}>{c.issued || "N/A"}</td>
                    <td style={tdStyle}>{c.settleDate || "-"}</td>
                    <td style={tdStyle}>{c.uniqueCode || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {creditInfo && creditInfo.length === 0 && <p>No credit records found.</p>}
      </div>
    </div>
  );
};

export default CreditManager;
