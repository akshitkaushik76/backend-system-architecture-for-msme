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

  const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [productLoading, setProductLoading] = useState(false);
const [productError, setProductError] = useState("");

const [editMode,setEditMode] = useState(false);
const [editData,setEditData] = useState({
  sellingPrice:"",
  costPrice:"",
  quantity:""
})  
const [toast, setToast] = useState({show:false,message:""})
const [drawerTop,setDrawerTop] = useState(0);

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

  useEffect(()=>{
    if(selectedProduct) {
      setEditData({
        sellingPrice:selectedProduct.sellingPrice || "",
        costPrice:selectedProduct.costPrice|| "",
        quantity:selectedProduct.quantity||""
      });
    }
  },[selectedProduct]);

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


 


  const openProductDrawer = async (productCode) => {
  try {
    setDrawerTop(window.scrollY)
    setDrawerOpen(true);
    setProductLoading(true);
    setProductError("");
    setSelectedProduct(null);

    const token = localStorage.getItem("ownerToken");

    const res = await fetch(
      `http://localhost:7600/ilba/getProduct/${productCode}/${businessCode}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (res.ok && data.status === "success") {
      setSelectedProduct(data.product_info);
    } else {
      setProductError(data.message || "Failed to load product");
    }
  } catch (err) {
    setProductError("Server not reachable",err);
  } finally {
    setProductLoading(false);
  }
};

const handleChange = (e)=>{
  setEditData({
    ...editData,
    [e.target.name]:e.target.value
  });
};

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

    /* ✅ PROPER SUCCESS CHECK */
    if (res.ok && data.status === "success") {

      setSelectedProduct(data.product);
      setEditMode(false);

      // Toast message
      setToast({
        show: true,
        message: "✅ Product Updated Successfully",
      });

      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);

    } else {
      setToast({
        show: true,
        message: data.message || "Update failed",
      });
    }

  } catch (err) {
    setToast({
      show: true,
      message: "Server error while updating",
    });

    console.error("Update error:", err);
  }
};
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
  onClick={() => openProductDrawer(p)}
>
              <h4>{p}</h4>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {e.stopPropagation(),predictRestock(p)}}
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
        <AnimatePresence>
  {drawerOpen && (
    <>
      {/* BACKDROP */}
      <motion.div
        className="drawerBackdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setDrawerOpen(false)}
      />

      {/* RIGHT PANEL */}
      <motion.div
        className="productDrawer"
        
        style={{top:drawerTop}}
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        <div className="drawerHeader">
          <h2>Product Details</h2>
          <button className="closeDrawer" onClick={() => setDrawerOpen(false)}>✖</button>
        </div>

        {productLoading && <p>Loading product...</p>}
        {productError && <p className="error">{productError}</p>}

        {/* {selectedProduct && (
          <div className="drawerContent">

            <div className="infoRow">
              <span>Name</span>
              <b>{selectedProduct.productName}</b>
            </div>

            <div className="infoRow">
              <span>Product Code</span>
              <b>{selectedProduct.productcode}</b>
            </div>

            <div className="infoRow">
              <span>Cost Price</span>
              <b>₹ {selectedProduct.costPrice}</b>
            </div>

            <div className="infoRow">
              <span>Selling Price</span>
              <b>₹ {selectedProduct.sellingPrice}</b>
            </div>

            <div className="infoRow">
              <span>Available Quantity</span>
              <b>{selectedProduct.quantity}</b>
            </div>

            <div className="infoRow">
              <span>Purchase Date</span>
              <b>{selectedProduct.dateofPurchase || "Not Available"}</b>
            </div>

            <div className="infoRow">
              <span>Total Cost Spent</span>
              <b>₹ {selectedProduct.totalCostSpent || 0}</b>
            </div>

          </div>
        )} */}
        {selectedProduct && (
  <div className="drawerContent">

    <div className="infoRow">
      <span>Name</span>
      <b>{selectedProduct.productName}</b>
    </div>

    <div className="infoRow">
      <span>Product Code</span>
      <b>{selectedProduct.productcode}</b>
    </div>

    {/* SELLING PRICE */}
    <div className="infoRow">
      <span>Selling Price</span>
      {editMode ? (
        <input
          name="sellingPrice"
          value={editData.sellingPrice}
          onChange={handleChange}
          className="drawerInput"
        />
      ) : (
        <b>₹ {selectedProduct.sellingPrice}</b>
      )}
    </div>

    {/* COST PRICE */}
    <div className="infoRow">
      <span>Cost Price</span>
      {editMode ? (
        <input
          name="costPrice"
          value={editData.costPrice}
          onChange={handleChange}
          className="drawerInput"
        />
      ) : (
        <b>₹ {selectedProduct.costPrice}</b>
      )}
    </div>

    {/* QUANTITY */}
    <div className="infoRow">
      <span>Available Quantity</span>
      {editMode ? (
        <input
          name="quantity"
          value={editData.quantity}
          onChange={handleChange}
          className="drawerInput"
        />
      ) : (
        <b>{selectedProduct.quantity}</b>
      )}
    </div>

    <div className="infoRow">
      <span>Total Cost Spent</span>
      <b>₹ {selectedProduct.totalCostSpent || 0}</b>
    </div>

    <div className="drawerButtons">
      {!editMode ? (
        <button className="editBtn" onClick={() => setEditMode(true)}>
          Edit Product
        </button>
      ) : (
        <>
          <button className="saveBtn" onClick={updateProduct}>
            Save Changes
          </button>
          <button className="cancelBtn" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </>
      )}
    </div>

  </div>
)}
      </motion.div>
    </>
  )}
</AnimatePresence>
      </motion.div>


      <AnimatePresence>
  {toast.show && (
    <motion.div
      className="toast"
      initial={{ y: 80, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type:"spring", stiffness:300, damping:20 }}
    >
      ✓ {toast.message}
    </motion.div>
  )}
</AnimatePresence>
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
