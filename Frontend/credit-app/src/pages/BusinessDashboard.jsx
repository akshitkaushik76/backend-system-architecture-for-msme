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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    sellingPrice: "",
    costPrice: "",
    quantity: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [predictingProduct, setPredictingProduct] = useState(null);
  const [predictError, setPredictError] = useState("");

  const [toast, setToast] = useState({ show: false, message: "" });
  const [sidebarOpen,setSidebarOpen] = useState(true);
  const [isMobile,setIsMobile] = useState(window.innerWidth < 900);
  const owner = JSON.parse(localStorage.getItem("ownerData"));
  const organisationCode = owner?.OrganisationCode;

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("ownerToken");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:7600/ilba/BuisnessInfo/${businessCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (res.ok && data.status === "success") {
          setAnalytics(data);
        } else {
          setError(data.message || "Failed to load dashboard");
        }
      } catch {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [businessCode, navigate]);


  useEffect(()=>{
    const handleResize = ()=>{
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);

      if(mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize",handleResize);
    return ()=> window.removeEventListener("resize",handleResize);
  },[]);
  /* ================= OPEN PRODUCT ================= */
  const openProductDrawer = async (productCode) => {
    try {
      setDrawerOpen(true);
      setProductLoading(true);
      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/getProduct/${productCode}/${businessCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSelectedProduct(data.product_info);
      } else {
        setProductError(data.message);
      }
    } catch {
      setProductError("Server not reachable");
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      setEditData({
        sellingPrice: selectedProduct.sellingPrice || "",
        costPrice: selectedProduct.costPrice || "",
        quantity: selectedProduct.quantity || ""
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE PRODUCT ================= */
  const updateProduct = async () => {
  try {
    const token = localStorage.getItem("ownerToken");

    const res = await fetch(
      `http://localhost:7600/ilba/updateProduct/${selectedProduct.productcode}/${businessCode}/${organisationCode}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sellingPrice: Number(editData.sellingPrice),
          costPrice: Number(editData.costPrice),
          quantity: Number(editData.quantity),
        }),
      }
    );

    const data = await res.json();

    if (res.ok && data.status === "success") {
      setSelectedProduct(data.product);
      setEditMode(false);

      setToast({ show: true, message: "✅ Product Updated Successfully" });

      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 2500);
    } else {
      setToast({ show: true, message: data.message });
    }
  } catch (err) {
    setToast({ show: true, message: "Server error while updating" },err);
  }
};

  /* ================= PREDICTION ================= */
  const predictRestock = async (productCode) => {
    try {
      setPredictingProduct(productCode);
      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/restock-check/${businessCode}/${productCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setPrediction({ product: productCode, result: data.data });
      } else {
        setPredictError(data.message);
      }
    } catch {
      setPredictError("ML server not reachable");
    } finally {
      setPredictingProduct(null);
    }
  };

  if (loading)
    return (
      <div className="center">
        <div className="loader" />
        <p>Loading Dashboard...</p>
      </div>
    );

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboardLayout">

      {isMobile && sidebarOpen && (
  <div
    className="sidebarOverlay"
    onClick={() => setSidebarOpen(false)}
  />
)}

      {/* SIDEBAR */}
    <motion.div className = {`sidebar ${sidebarOpen ? "open":"closed"} ${isMobile ? "mobile":""}`} initial = {false} animate={{x:sidebarOpen?0:-260}} transition={{type:"spring",stiffness:260,damping:30}}>
  <h2>FINVENTORY</h2>

  <button onClick={() => navigate("/dashboard")}>
    🏠 Home
  </button>

  <button onClick={() => navigate(`/business/${businessCode}/sales`)}>
    📊 Sales
  </button>

  <button onClick={() =>
    navigate(`/business/${organisationCode}/${businessCode}/profit-per-day`)
  }>
    📈 Profit
  </button>

  <button onClick={() =>
    navigate(`/business/${organisationCode}/${businessCode}/credit-manager`)
  }>
    💳 Credit Manager
  </button>

  {/* ✅ CORRECT */}
  <button onClick={() =>
    navigate(`/add-credit/${organisationCode}/${businessCode}`)
  }>
    ➕ Add Credit
  </button>

  {/* ✅ CORRECT (THIS WAS WRONG BEFORE) */}
  <button onClick={() =>
    navigate(`/business/${businessCode}/settle-credit`)
  }>
    💰 Settle Credit
  </button>

  {/* ✅ CORRECT */}
  <button onClick={() =>
    navigate(`/business/${organisationCode}/${businessCode}/add-sale`)
  }>
    🛒 Add Sale
  </button>

  {/* ✅ CORRECT (THIS WAS WRONG BEFORE) */}
  <button onClick={() =>
    navigate(`/business/${businessCode}/add-product`)
  }>
    📦 Add Product
  </button>
</motion.div>

      {/* MAIN */}
      <div className="mainContent">

        <div className="topbar">
          <button
  className="hamburger"
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  ☰
</button>
          <h1>Business Dashboard</h1>
          <div className="businessCode">Code: {businessCode}</div>
        </div>

        <div className="statsGrid">
          <div className="statCard blue">
            <p>Total Credit Transactions</p>
            <h2>{analytics?.TotalCreditTransactions || 0}</h2>
          </div>
          <div className="statCard purple">
            <p>Total Products</p>
            <h2>{analytics?.products?.length || 0}</h2>
          </div>
        </div>

        <h2 className="sectionTitle">Inventory</h2>

        <div className="productGrid">
          {analytics?.products?.map((p, i) => (
            <motion.div
              key={i}
              className="productCard"
              whileHover={{ y: -5 }}
              onClick={() => openProductDrawer(p)}
            >
              <h3>{p}</h3>
              <button
                className="predictBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  predictRestock(p);
                }}
              >
                {predictingProduct === p ? "Analyzing..." : "🔮 Predict Restock"}
              </button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {prediction && (
            <motion.div
              className="predictionPanel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h3>AI Prediction</h3>
              <p><b>Product:</b> {prediction.product}</p>
              <p>{prediction.result.message}</p>
              <p>Stock: {prediction.result.currentStock}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {drawerOpen && selectedProduct && (
          <>
            <div className="modalBackdrop" onClick={() => setDrawerOpen(false)} />
            <motion.div
              className="productModal"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              <h2>{selectedProduct.productName}</h2>

              <div className="infoRow">
                <span>Selling Price</span>
                {editMode ? (
                  <input name="sellingPrice" value={editData.sellingPrice} onChange={handleChange} />
                ) : (
                  <b>₹ {selectedProduct.sellingPrice}</b>
                )}
              </div>

              <div className="infoRow">
                <span>Cost Price</span>
                {editMode ? (
                  <input name="costPrice" value={editData.costPrice} onChange={handleChange} />
                ) : (
                  <b>₹ {selectedProduct.costPrice}</b>
                )}
              </div>

              <div className="infoRow">
                <span>Quantity</span>
                {editMode ? (
                  <input name="quantity" value={editData.quantity} onChange={handleChange} />
                ) : (
                  <b>{selectedProduct.quantity}</b>
                )}
              </div>

              {!editMode ? (
                <button className="editBtn" onClick={() => setEditMode(true)}>Edit</button>
              ) : (
                <>
                  <button className="saveBtn" onClick={updateProduct}>Save</button>
                  <button className="cancelBtn" onClick={() => setEditMode(false)}>Cancel</button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            className="toast"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BusinessDashboard;