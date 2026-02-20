// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const OwnerDashboard = () => {
//   const [ownerData, setOwnerData] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🔹 NEW STATE
//   const [creating, setCreating] = useState(false);
//   const [createMsg, setCreateMsg] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     let isMounted = true;

//     const token = localStorage.getItem("ownerToken");
//     const storedOwner = localStorage.getItem("ownerData");

//     // 🔐 Protect route
//     if (!token || !storedOwner) {
//       window.location.href = "/";
//       return;
//     }

//     const parsedOwner = JSON.parse(storedOwner);

//     const fetchOwnerData = async () => {
//       try {
//         const res = await fetch("http://localhost:7600/ilba/loginPayload", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ email: parsedOwner.email }),
//         });

//         const data = await res.json();
//         if (!isMounted) return;

//         if (res.ok && data.status === "success") {
//           setOwnerData(data);
//         } else {
//           setError(data.message || "Failed to load dashboard");
//         }
//       } catch (err) {
//         if (isMounted) setError("Server error",err.message);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchOwnerData();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // 🔹 NEW FUNCTION
//   const handleCreateBusiness = async () => {
//     try {
//       setCreating(true);
//       setCreateMsg("");

//       const token = localStorage.getItem("ownerToken");

//       const res = await fetch(
//         `http://localhost:7600/ilba/newBuisness/${ownerData.OrganisationCode}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to create business");
//       }

//       setCreateMsg("✅ New business created successfully");

//       // Refresh to show new business
//       setTimeout(() => {
//         window.location.reload();
//       }, 1200);
//     } catch (err) {
//       setCreateMsg(`❌ ${err.message}`);
//     } finally {
//       setCreating(false);
//     }
//   };

//   if (loading) return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
//   if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

//   return (
//     <div
//       style={{
//         padding: "30px",
//         minHeight: "100vh",
//         backgroundColor: "#f8fafc",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <h2 style={{ marginBottom: "10px" }}>
//         Welcome,{" "}
//         <span style={{ color: "#1e40af" }}>{ownerData.Name}</span>
//       </h2>

//       <p style={{ marginBottom: "25px", color: "#334155" }}>
//         <strong>Organisation Code:</strong> {ownerData.OrganisationCode}
//       </p>

//       {/* 🔹 CREATE BUSINESS BUTTON */}
//       <button
//         onClick={handleCreateBusiness}
//         disabled={creating}
//         style={{
//           marginBottom: "12px",
//           padding: "14px 24px",
//           borderRadius: "12px",
//           border: "none",
//           background: creating ? "#94a3b8" : "#16a34a",
//           color: "#ffffff",
//           fontSize: "15px",
//           fontWeight: "600",
//           cursor: creating ? "not-allowed" : "pointer",
//           boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
//         }}
//       >
//         {creating ? "Creating Business..." : "+ Create New Business"}
//       </button>

//       {/* 🔹 FEEDBACK MESSAGE */}
//       {createMsg && (
//         <p style={{ marginBottom: "20px", fontWeight: "600" }}>
//           {createMsg}
//         </p>
//       )}

//       <h3 style={{ marginBottom: "15px" }}>Your Businesses</h3>

//       <div
//         style={{
//           display: "flex",
//           gap: "15px",
//           flexWrap: "wrap",
//         }}
//       >
//         {ownerData.Buisness.map((code, index) => (
//           <button
//             key={index}
//             onClick={() => navigate(`/business/${code}`)}
//             style={{
//               padding: "14px 20px",
//               borderRadius: "10px",
//               border: "none",
//               backgroundColor: "#1e293b",
//               color: "#ffffff",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "600",
//               letterSpacing: "0.5px",
//               boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
//               transition: "transform 0.2s ease, box-shadow 0.2s ease",
//             }}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = "translateY(-2px)";
//               e.currentTarget.style.boxShadow =
//                 "0 8px 16px rgba(0,0,0,0.25)";
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow =
//                 "0 6px 12px rgba(0,0,0,0.15)";
//             }}
//           >
//             {code}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OwnerDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ownerDashboard.css";

const OwnerDashboard = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [orgAnalytics, setOrgAnalytics] = useState(null);
  const [activeCustomers, setActiveCustomers] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");
    const storedOwner = JSON.parse(localStorage.getItem("ownerData"));

    if (!token || !storedOwner) {
      window.location.href = "/";
      return;
    }

    const fetchAllData = async () => {
      try {
        // -------- OWNER PAYLOAD --------
        const payloadRes = await fetch(
          "http://localhost:7600/ilba/loginPayload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: storedOwner.email }),
          }
        );

        const payloadData = await payloadRes.json();
        setOwnerData(payloadData);

        // -------- ORGANISATION ANALYTICS --------
        const analyticsRes = await fetch(
          `http://localhost:7600/ilba/Organisation_analytics/${payloadData.OrganisationCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const analyticsData = await analyticsRes.json();
        setOrgAnalytics(analyticsData.analytics);

        // -------- ACTIVE CUSTOMERS PER BUSINESS --------
        const customerMap = {};

        for (let code of payloadData.Buisness) {
          const res = await fetch(
            `http://localhost:7600/ilba/getActiveCustomers/${code}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          customerMap[code] = data.totalActiveCustomers || 0;
        }

        setActiveCustomers(customerMap);
      } catch (err) {
        setError("Failed to load dashboard",err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // CREATE BUSINESS
  const handleCreateBusiness = async () => {
    try {
      setCreating(true);
      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/newBuisness/${ownerData.OrganisationCode}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setCreateMsg("Business created successfully");

      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setCreateMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="loader">Loading dashboard...</div>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="owner-container">

      {/* HEADER */}
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Welcome back, {ownerData.Name}</h2>
        <p>Organisation Code: <b>{ownerData.OrganisationCode}</b></p>
      </motion.div>

      {/* KPI CARDS */}
      <div className="kpi-grid">

        <KPI title="Businesses" value={orgAnalytics.totalBuisnesses} color="#3b82f6"/>
        <KPI title="Customers" value={orgAnalytics.totalCustomers} color="#22c55e"/>
        <KPI title="Transactions" value={orgAnalytics.totalTransactions} color="#f59e0b"/>
        <KPI title="Revenue ₹" value={orgAnalytics.totalRevenue} color="#ef4444"/>

      </div>

      {/* CREATE BUSINESS */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="create-btn"
        onClick={handleCreateBusiness}
        disabled={creating}
      >
        {creating ? "Creating..." : "+ Create New Business"}
      </motion.button>

      {createMsg && <p className="success">{createMsg}</p>}

      {/* BUSINESS CARDS */}
      <h3 className="section-title">Your Businesses</h3>

      <div className="business-grid">
        {ownerData.Buisness.map((code, i) => (
          <motion.div
            key={i}
            className="business-card"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/business/${code}`)}
          >
            <h4>{code}</h4>
            <p>Active Customers</p>
            <span className="customer-count">
              {activeCustomers[code] || 0}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const KPI = ({ title, value, color }) => (
  <motion.div
    className="kpi-card"
    style={{ borderTop: `5px solid ${color}` }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h4>{title}</h4>
    <h2>{value}</h2>
  </motion.div>
);

export default OwnerDashboard;

