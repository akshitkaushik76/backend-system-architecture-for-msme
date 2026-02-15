import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddCredit = () => {
  const { organisationCode, businessCode } = useParams();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [productCode, setProductCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // new state for success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/addCredit/${organisationCode}/${businessCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phoneNumber, productCode, quantity }),
        }
      );

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccess(true); // show success message
        // Optionally, you can reset the form
        setPhoneNumber("");
        setProductCode("");
        setQuantity("");
      } else {
        setError(data.message || "Failed to add credit");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          padding: "32px",
          borderRadius: "16px",
          width: "380px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            color: "#1e40af",
          }}
        >
          Add Credit
        </h2>

        {success ? (
          <div
            style={{
              padding: "20px",
              background: "#dcfce7",
              color: "#166534",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            ✅ Credit Added Successfully!
          </div>
        ) : (
          <>
            <input
              type="tel"
              placeholder="📞 Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="🛒 Product Code"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="🔢 Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "10px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: loading ? "#94a3b8" : "#16a34a",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 8px 20px rgba(22,163,74,0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Adding Credit..." : "➕ Add Credit"}
            </button>

            {error && (
              <p
                style={{
                  marginTop: "15px",
                  color: "#dc2626",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {error}
              </p>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => navigate(`/business/${businessCode}`)}
          style={{
            marginTop: "20px",
            background: "transparent",
            border: "none",
            color: "#475569",
            cursor: "pointer",
            fontWeight: "600",
            width: "100%",
          }}
        >
          ⬅ Back to Business Dashboard
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5f5",
  fontSize: "14px",
  outline: "none",
};

export default AddCredit;
