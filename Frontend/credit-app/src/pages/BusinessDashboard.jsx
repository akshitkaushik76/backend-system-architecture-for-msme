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

  const [customers, setCustomers] = useState([]);
  const [customerModal, setCustomerModal] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState("");


  const [activeCustomerCount,setActiveCustomerCount] = useState(0);

  const [search,setSearch] = useState("");
  const [suggestions,setSuggestions] = useState([]);
  const [showSuggestions,setShowSuggestions] = useState(false);
  const [searchLoading,setSearchLoading] = useState(false);
  const [currentPage,setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [highlightedProduct,setHighlightedProduct] = useState(null);
  const [filteredProduct,setFilterProduct] = useState(null);


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

  /* ================= FETCH ACTIVE CUSTOMER COUNT ================= */
useEffect(() => {
  const fetchCustomerCount = async () => {
    try {
      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/getCustomerinfo/${businessCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setActiveCustomerCount(data.customers.length);
      }
    } catch (err) {
      console.log("Customer count load failed",err);
    }
  };

  fetchCustomerCount();
}, [businessCode]);

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

    useEffect(() => {
  if (!search) {
    setSuggestions([]);
    return;
  }



  const delay = setTimeout(async () => {
    try {
      setSearchLoading(true);

      const token = localStorage.getItem("ownerToken");

      const res = await fetch(
        `http://localhost:7600/ilba/search-products/${businessCode}?q=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (res.ok) {
        setSuggestions(data.products);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.log("search error",err);
    } finally {
      setSearchLoading(false);
    }
  }, 350);   //  debounce (Google uses ~300ms)

  return () => clearTimeout(delay);
}, [search, businessCode]);

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


 const fetchCustomers = async () => {
  try {
    setCustomerModal(true);
    setCustomerLoading(true);
    setCustomerError("");

    const token = localStorage.getItem("ownerToken");

    const res = await fetch(
      `http://localhost:7600/ilba/getCustomerinfo/${businessCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok && data.status === "success") {
      setCustomers(data.customers);
    } else {
      setCustomerError(data.message || "Failed to fetch customers");
    }
  } catch (err) {
    setCustomerError("Server not reachable",err);
  } finally {
    setCustomerLoading(false);
  }
};



const handleSelectProduct = (product) => {
  setSearch(product.productName);
  setSuggestions([]);
  setHighlightedProduct(product._id);
  setCurrentPage(1);
  setFilterProduct(product);
  setTimeout(() => {
    document
      .getElementById(`product-${product._id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
};

  if (loading)
    return (
      <div className="center">
        <div className="loader" />
        <p>Loading Dashboard...</p>
      </div>
    );

  if (error) return <p className="error">{error}</p>;

const indexOfLastProduct = currentPage*productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

const currentProducts  = filteredProduct?[filteredProduct] : analytics?.products?.slice(indexOfFirstProduct,indexOfLastProduct) || [];
console.log(currentProducts)
const totalPages = Math.ceil((analytics?.products?.length || 0) / productsPerPage)

console.log(analytics?.products);

// const filteredProducts =
//   analytics?.products?.filter((p) => {
//     if (!p?.productName) return false;

//     return p.productName
//       .toLowerCase()
//       .includes(search?.toLowerCase() || "");
//   }) || [];

// const indexOfLastProduct = currentPage * productsPerPage;
// const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

// const currentProducts = filteredProducts.slice(
//   indexOfFirstProduct,
//   indexOfLastProduct
// );

// const totalPages = Math.ceil(
//   filteredProducts.length / productsPerPage
// );


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
          <div className="statCard green" onClick={fetchCustomers} style={{cursor:"pointer"}}>
          <p>Active Customers</p>
          <h2>{activeCustomerCount}</h2>
</div>
        </div>

        {/* <h2 className="sectionTitle">Inventory</h2> */}
        
        <div className="inventoryHeader">
  <h2 className="sectionTitle">Inventory</h2>
{filteredProduct && (
  <button
    className="backInventoryBtn"
    onClick={() => {
      setFilterProduct(null);
      setSearch("");
    }}
  >
    ← Back to Full Inventory
  </button>
)}


  <div className="searchBox">
    <input
      type="text"
      placeholder="Search product..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => setTimeout(()=>setShowSuggestions(false),200)}
    />

    {showSuggestions && suggestions.length > 0 && (
      <div className="suggestions">
        {suggestions.map((p) => (
         <div
  key={p._id}
  className="suggestionItem"
  onClick={() => handleSelectProduct(p)}
>
  <div className="suggestionLeft">
    <div className="productDot"></div>
    <div className="productInfo">
      <div className="productName">{p.productName}</div>
      <div className="productMeta">Inventory item</div>
    </div>
  </div>

  <div className="stockBadge">
    {p.stock} left
  </div>
</div>
        ))}
      </div>
    )}
  </div>
</div>

        <div className="productGrid">
          
          {currentProducts.map((p, i) => (
            
            <motion.div
              key={p.productcode}
              className={`productCard ${highlightedProduct === p._id? "highlightCard":""}`}
              id={`product-${p._id}`}
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
                {predictingProduct === p ? (
  <span className="thinking">
    <span className="dot"></span>
    <span className="dot"></span>
    <span className="dot"></span>
    AI Thinking
  </span>
) : "🔮 Predict Restock"}
              </button>
            </motion.div>
          ))}
        </div>

        {!filteredProduct && totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      ⬅ Prev
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={currentPage === index + 1 ? "activePage" : ""}
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
      Next ➡
    </button>
  </div>
)}

<AnimatePresence>
  {prediction && (
    <>
      {/* Dark overlay */}
      <div
        className="modalBackdrop"
        onClick={() => setPrediction(null)}
      />

      {/* Centering wrapper */}
      <div className="aiWrapper">
        <motion.div
          className="predictionPanel"
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
          <div className="aiHeader">
            <div className="aiOrb"></div>
            <h3>AI Stock Intelligence</h3>

            <button
              className="aiClose"
              onClick={() => setPrediction(null)}
            >
              ✖
            </button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <b>Product:</b> {prediction.product}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {prediction.result.message}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <b>Current Stock:</b> {prediction.result.currentStock}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <b>Expected 7 days restocking:</b>{" "}
            {prediction.result.expectedConsumptionNext7Days.toFixed(2)}
          </motion.p>
        </motion.div>
      </div>
    </>
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


        {/* <AnimatePresence>
  {customerModal && (
    <>
      <div
        className="modalBackdrop"
        onClick={() => setCustomerModal(false)}
      />

      <motion.div
        className="customerModal"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
      >
        <div className="customerHeader">
          <h2>Active Customers</h2>
          <button onClick={() => setCustomerModal(false)}>✖</button>
        </div>

        {customerLoading && <p>Loading customers...</p>}
        {customerError && <p className="error">{customerError}</p>}

        <div className="customerList">
          {customers.map((c, index) => (
            <div key={index} className="customerCard">
              <h3>{c.Name}</h3>
              <p>📞 {c.phoneNumber}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence> */}
<AnimatePresence>
  {customerModal && (
    <>
      <div
        className="modalBackdrop"
        onClick={() => setCustomerModal(false)}
      />

      <div className="customerModalWrapper">
        <motion.div
          className="customerModal"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
        >
          <div className="customerHeader">
          <h2>Active Customers</h2>
          <button onClick={() => setCustomerModal(false)}>✖</button>
        </div>

        {customerLoading && <p>Loading customers...</p>}
        {customerError && <p className="error">{customerError}</p>}

        <div className="customerList">
          {customers.map((c, index) => (
            <div key={index} className="customerCard">
              <h3>{c.Name}</h3>
              <p>📞 {c.phoneNumber}</p>
            </div>
          ))}
        </div>

        </motion.div>
      </div>
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