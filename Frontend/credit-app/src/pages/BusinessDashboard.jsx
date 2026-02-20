// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const BusinessDashboard = () => {
//   const { businessCode } = useParams();
//   const navigate = useNavigate();

//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const owner = JSON.parse(localStorage.getItem("ownerData"));
//   const organisationCode = owner?.OrganisationCode;

//   useEffect(() => {
//     const token = localStorage.getItem("ownerToken");
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     setLoading(true);
//     setAnalytics(null);
//     setError("");

//     const fetchAnalytics = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:7600/ilba/BuisnessInfo/${businessCode}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();

//         if (res.ok && data.status === "success") {
//           setAnalytics(data);
//         } else {
//           setError(data.message || "Failed to load analytics");
//         }
//       } catch (err) {
//         setError(err.message || "Server error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, [businessCode, navigate]);

//   if (loading)
//     return <p style={{ padding: "30px" }}>Loading business dashboard...</p>;

//   if (error)
//     return <p style={{ color: "red", padding: "30px" }}>{error}</p>;

//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "30px" }}>
//       <button
//         onClick={() => navigate("/dashboard")}
//         style={{
//           marginBottom: "20px",
//           padding: "10px 16px",
//           background: "#1e293b",
//           color: "#fff",
//           border: "none",
//           borderRadius: "8px",
//           cursor: "pointer",
//         }}
//       >
//         ⬅ Back
//       </button>

//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "14px",
//           padding: "25px",
//           maxWidth: "900px",
//           margin: "0 auto",
//         }}
//       >
//         <h2>Business Dashboard</h2>

//         <p>
//           <strong>Business Code:</strong> {businessCode}
//         </p>

//         <div
//           style={{
//             background: "#e0f2fe",
//             padding: "20px",
//             borderRadius: "12px",
//             marginBottom: "20px",
//           }}
//         >
//           <p>Total Credit Transactions</p>
//           <h3>{analytics.TotalCreditTransactions}</h3>
//         </div>

//         {/* ADD CREDIT BUTTON */}
//         <button
//           onClick={() =>
//             navigate(`/add-credit/${organisationCode}/${businessCode}`)
//           }
//           style={{
//             padding: "12px 20px",
//             background: "#16a34a",
//             color: "#fff",
//             border: "none",
//             borderRadius: "10px",
//             cursor: "pointer",
//             marginBottom: "30px",
//           }}
//         >
//           ➕ Add Credit
//         </button>
//          {/* ADD PRODUCT BUTTON */}
// <button
//   onClick={() => navigate(`/business/${businessCode}/add-product`)}
//   style={{
//     padding: "12px 20px",
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     marginBottom: "30px",
//     marginLeft: "12px",
//   }}
// >
//   ➕ Add Product
// </button>
// <button
//   onClick={() =>
//     navigate(
//       `/business/${organisationCode}/${businessCode}/add-sale`
//     )
//   }
//   style={{
//     padding: "12px 20px",
//     background: "#dc2626",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//      marginLeft: "12px"
//   }}
// >
//   ➕ Create Sale
// </button>
// <button
//   onClick={() =>
//     navigate(`/business/${businessCode}/settle-credit`)
//   }
//   style={{
//     padding: "12px 20px",
//     background: "#16a34a",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     marginLeft: "12px"
//   }}
// >
//   💳 Settle Credit
// </button>

// <button
//   onClick={() =>
//     navigate(`/business/${organisationCode}/${businessCode}/profit-per-day`)
//   }
//   style={{
//     padding: "12px 20px",
//     background: "#7c3aed",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     marginLeft: "12px",
//   }}
// >
//   📈 Profit Per Day
// </button>

// <button
//   onClick={() =>
//     navigate(`/business/${organisationCode}/${businessCode}/credit-manager`)
//   }
//   style={{
//     padding: "12px 20px",
//     background: "#f59e0b",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     marginLeft: "12px",
//     marginBottom: "30px"
//   }}
// >
//   💳 Credit Manager
// </button>

//        <button
//   onClick={() => navigate(`/business/${businessCode}/sales`)}
//   style={{
//     padding: "12px 18px",
//     borderRadius: "10px",
//     border: "none",
//     background: "#0f766e",
//     color: "#fff",
//     fontWeight: "600",
//     cursor: "pointer",
//     boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
//   }}
// >
//   📊 View Sales
// </button>

       
//         <h3>Products in this Business</h3>

//         {analytics.products.length === 0 ? (
//           <p>No products found.</p>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
//               gap: "15px",
//             }}
//           >
//             {analytics.products.map((p, i) => (
//               <div
//                 key={i}
//                 style={{
//                   padding: "14px",
//                   background: "#f8fafc",
//                   borderRadius: "10px",
//                   textAlign: "center",
//                 }}
//               >
//                 {p}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BusinessDashboard;
import "./dashboard.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BusinessDashboard = () => {
  const { businessCode } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [predictingProduct, setPredictingProduct] = useState(null);
  const [predictError, setPredictError] = useState("");

  const owner = JSON.parse(localStorage.getItem("ownerData"));
  const organisationCode = owner?.OrganisationCode;

  /* ================= FETCH BUSINESS DATA ================= */
  useEffect(() => {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:7600/ilba/BuisnessInfo/${businessCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.ok && data.status === "success") {
          setAnalytics(data);
        } else {
          setError(data.message || "Failed to load business data");
        }
      } catch (err) {
        setError("Server error while loading dashboard",err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [businessCode, navigate]);

  /* ================= RESTOCK PREDICTION ================= */
  // const predictRestock = async (productCode) => {
  //   try {
  //     setPredictError("");
  //     setPrediction(null);
  //     setPredictingProduct(productCode);

  //     const token = localStorage.getItem("ownerToken");

  //     const res = await fetch(
  //       `http://localhost:7600/ilba/predict/restock/${businessCode}/${productCode}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const data = await res.json();

  //     if (res.ok && data.status === "success") {
  //       setPrediction({
  //         product: productCode,
  //         result: data.prediction,
  //       });
  //     } else {
  //       setPredictError(data.message || "Prediction failed");
  //     }
  //   } catch {
  //     setPredictError("Server error while predicting");
  //   } finally {
  //     setPredictingProduct(null);
  //   }
  // };

const predictRestock = async (productCode) => {
  try {
    setPredictError("");
    setPrediction(null);
    setPredictingProduct(productCode);

    const token = localStorage.getItem("ownerToken");

    const res = await fetch(
      `http://localhost:7600/ilba/restock-check/${businessCode}/${productCode}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    // NEW RESPONSE STRUCTURE
    if (res.ok && data.success) {
      setPrediction({
        product: productCode,
        result: data.data,   // <-- IMPORTANT CHANGE
      });
    } else {
      setPredictError(data.message || "AI prediction failed");
    }
  } catch (err) {
    setPredictError("ML server not reachable",err);
  } finally {
    setPredictingProduct(null);
  }
};

  /* ================= LOADING UI ================= */
  if (loading)
    return (
      <div className="center">
        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p>Loading business dashboard...</p>
      </div>
    );

  if (error)
    return <p className="error">{error}</p>;

  return (
    <div className="page">

      {/* BACK BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="backBtn"
        onClick={() => navigate("/dashboard")}
      >
        ⬅ Back
      </motion.button>

      {/* MAIN CARD */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="title">Business Dashboard</h2>
        <p className="sub">Business Code: {businessCode}</p>

        {/* CREDIT BOX */}
        <motion.div
          className="creditBox"
          whileHover={{ scale: 1.03 }}
        >
          <p>Total Credit Transactions</p>
          <h1>{analytics?.TotalCreditTransactions || 0}</h1>
        </motion.div>

        {/* ACTION BUTTONS */}
        <div className="actions">
          <Action text="➕ Add Credit" color="#22c55e"
            click={() => navigate(`/add-credit/${organisationCode}/${businessCode}`)} />

          <Action text="➕ Add Product" color="#3b82f6"
            click={() => navigate(`/business/${businessCode}/add-product`)} />

          <Action text="➕ Create Sale" color="#ef4444"
            click={() => navigate(`/business/${organisationCode}/${businessCode}/add-sale`)} />

          <Action text="💳 Settle Credit" color="#10b981"
            click={() => navigate(`/business/${businessCode}/settle-credit`)} />

          <Action text="📈 Profit Per Day" color="#8b5cf6"
            click={() => navigate(`/business/${organisationCode}/${businessCode}/profit-per-day`)} />

          <Action text="💳 Credit Manager" color="#f59e0b"
            click={() => navigate(`/business/${organisationCode}/${businessCode}/credit-manager`)} />

          <Action text="📊 View Sales" color="#0ea5e9"
            click={() => navigate(`/business/${businessCode}/sales`)} />
        </div>

        {/* PRODUCTS */}
        <h3 className="productTitle">Products</h3>

        <div className="productGrid">
          {analytics?.products?.map((p, i) => (
            <motion.div
              key={i}
              className="productCard"
              whileHover={{ y: -6, scale: 1.04 }}
            >
              <h4>{p}</h4>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => predictRestock(p)}
                disabled={predictingProduct === p}
                className="predictBtn"
              >
                {predictingProduct === p ? "Analyzing Sales Pattern..." : "🔮 Predict Restock"}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* PREDICTION RESULT */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              className="prediction"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h3>🔮 AI Stock Prediction</h3>

              <p><b>Product:</b> {prediction.product}</p>
              <p><b>AI Message:</b> {prediction.result.message}</p>
               <p><b>Current Stock:</b> {prediction.result.currentStock}</p>
               <p><b>Expected 7-Day Demand:</b> {prediction.result.expectedConsumptionNext7Days.toFixed(2)}</p>
              {prediction.result.prediction === 1 ? (
                <motion.p
                  className="danger"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  🚨 RESTOCK REQUIRED
                </motion.p>
              ) : (
                <p className="safe">✅ Stock is Safe</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {predictError && <p className="error">{predictError}</p>}
      </motion.div>
    </div>
  );
};

const Action = ({ text, color, click }) => (
  <motion.button
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.95 }}
    style={{ background: color }}
    className="actionBtn"
    onClick={click}
  >
    {text}
  </motion.button>
);

export default BusinessDashboard;



