import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 NEW STATE
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const token = localStorage.getItem("ownerToken");
    const storedOwner = localStorage.getItem("ownerData");

    // 🔐 Protect route
    if (!token || !storedOwner) {
      window.location.href = "/";
      return;
    }

    const parsedOwner = JSON.parse(storedOwner);

    const fetchOwnerData = async () => {
      try {
        const res = await fetch("http://localhost:7600/ilba/loginPayload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: parsedOwner.email }),
        });

        const data = await res.json();
        if (!isMounted) return;

        if (res.ok && data.status === "success") {
          setOwnerData(data);
        } else {
          setError(data.message || "Failed to load dashboard");
        }
      } catch (err) {
        if (isMounted) setError("Server error",err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOwnerData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 🔹 NEW FUNCTION
  const handleCreateBusiness = async () => {
    try {
      setCreating(true);
      setCreateMsg("");

      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/newBuisness/${ownerData.OrganisationCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create business");
      }

      setCreateMsg("✅ New business created successfully");

      // Refresh to show new business
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setCreateMsg(`❌ ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>
        Welcome,{" "}
        <span style={{ color: "#1e40af" }}>{ownerData.Name}</span>
      </h2>

      <p style={{ marginBottom: "25px", color: "#334155" }}>
        <strong>Organisation Code:</strong> {ownerData.OrganisationCode}
      </p>

      {/* 🔹 CREATE BUSINESS BUTTON */}
      <button
        onClick={handleCreateBusiness}
        disabled={creating}
        style={{
          marginBottom: "12px",
          padding: "14px 24px",
          borderRadius: "12px",
          border: "none",
          background: creating ? "#94a3b8" : "#16a34a",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: "600",
          cursor: creating ? "not-allowed" : "pointer",
          boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
        }}
      >
        {creating ? "Creating Business..." : "+ Create New Business"}
      </button>

      {/* 🔹 FEEDBACK MESSAGE */}
      {createMsg && (
        <p style={{ marginBottom: "20px", fontWeight: "600" }}>
          {createMsg}
        </p>
      )}

      <h3 style={{ marginBottom: "15px" }}>Your Businesses</h3>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        {ownerData.Buisness.map((code, index) => (
          <button
            key={index}
            onClick={() => navigate(`/business/${code}`)}
            style={{
              padding: "14px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(0,0,0,0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 12px rgba(0,0,0,0.15)";
            }}
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;
