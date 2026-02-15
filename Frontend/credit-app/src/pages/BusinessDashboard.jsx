import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BusinessDashboard = () => {
  const { businessCode } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const owner = JSON.parse(localStorage.getItem("ownerData"));
  const organisationCode = owner?.OrganisationCode;

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);
    setAnalytics(null);
    setError("");

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `http://localhost:7600/ilba/BuisnessInfo/${businessCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok && data.status === "success") {
          setAnalytics(data);
        } else {
          setError(data.message || "Failed to load analytics");
        }
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [businessCode, navigate]);

  if (loading)
    return <p style={{ padding: "30px" }}>Loading business dashboard...</p>;

  if (error)
    return <p style={{ color: "red", padding: "30px" }}>{error}</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "30px" }}>
      <button
        onClick={() => navigate("/dashboard")}
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
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2>Business Dashboard</h2>

        <p>
          <strong>Business Code:</strong> {businessCode}
        </p>

        <div
          style={{
            background: "#e0f2fe",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <p>Total Credit Transactions</p>
          <h3>{analytics.TotalCreditTransactions}</h3>
        </div>

        {/* ADD CREDIT BUTTON */}
        <button
          onClick={() =>
            navigate(`/add-credit/${organisationCode}/${businessCode}`)
          }
          style={{
            padding: "12px 20px",
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          ➕ Add Credit
        </button>
         {/* ADD PRODUCT BUTTON */}
<button
  onClick={() => navigate(`/business/${businessCode}/add-product`)}
  style={{
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "30px",
    marginLeft: "12px",
  }}
>
  ➕ Add Product
</button>
<button
  onClick={() =>
    navigate(
      `/business/${organisationCode}/${businessCode}/add-sale`
    )
  }
  style={{
    padding: "12px 20px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
     marginLeft: "12px"
  }}
>
  ➕ Create Sale
</button>
<button
  onClick={() =>
    navigate(`/business/${businessCode}/settle-credit`)
  }
  style={{
    padding: "12px 20px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginLeft: "12px"
  }}
>
  💳 Settle Credit
</button>

<button
  onClick={() =>
    navigate(`/business/${organisationCode}/${businessCode}/profit-per-day`)
  }
  style={{
    padding: "12px 20px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginLeft: "12px",
  }}
>
  📈 Profit Per Day
</button>

<button
  onClick={() =>
    navigate(`/business/${organisationCode}/${businessCode}/credit-manager`)
  }
  style={{
    padding: "12px 20px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginLeft: "12px",
    marginBottom: "30px"
  }}
>
  💳 Credit Manager
</button>

       <button
  onClick={() => navigate(`/business/${businessCode}/sales`)}
  style={{
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#0f766e",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
  }}
>
  📊 View Sales
</button>

       
        <h3>Products in this Business</h3>

        {analytics.products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "15px",
            }}
          >
            {analytics.products.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
