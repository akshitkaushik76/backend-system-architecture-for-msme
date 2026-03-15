import "./dashboard.css";
import { useEffect, useState,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"
 
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
  const mainContentRef = useRef(null);
  // const [filteredProduct,setFilterProduct] = useState(null);


const [salesModal, setSalesModal] = useState(false);
const [salesDate, setSalesDate] = useState("");
const [salesData, setSalesData] = useState([]);
const [salesLoading, setSalesLoading] = useState(false);
const [salesError, setSalesError] = useState("");


const [profitModal, setProfitModal] = useState(false);
const [profitDate, setProfitDate] = useState("");
const [profitValue, setProfitValue] = useState(null);
const [profitLoading, setProfitLoading] = useState(false);
const [profitError, setProfitError] = useState("");

const [creditModal, setCreditModal] = useState(false);
const [phoneNumber, setPhoneNumber] = useState("");
const [creditInfo, setCreditInfo] = useState(null);
const [creditError, setCreditError] = useState("");
const [creditLoading, setCreditLoading] = useState(false);

const [addCreditModal, setAddCreditModal] = useState(false);
const [addPhoneNumber, setAddPhoneNumber] = useState("");
const [addProductCode, setAddProductCode] = useState("");
const [addQuantity, setAddQuantity] = useState("");
const [addCreditError, setAddCreditError] = useState("");
const [addCreditSuccess, setAddCreditSuccess] = useState("");
const [addCreditLoading, setAddCreditLoading] = useState(false);  

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

//get sales method->
const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const fetchSales = async (e) => {
  e.preventDefault();

  if (!salesDate) return;

  setSalesLoading(true);
  setSalesError("");
  setSalesData([]);

  try {
    const token = localStorage.getItem("ownerToken");

    const res = await fetch(
      `http://localhost:7600/ilba/getSales/${businessCode}?date=${formatDate(salesDate)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (res.ok) {
      setSalesData(data.result || []);
    } else {
      setSalesError(data.message || "No sales found");
    }
  } catch {
    setSalesError("Server error");
  } finally {
    setSalesLoading(false);
  }
};



const formatDates = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const fetchProfit = async (e) => {
  e.preventDefault();
  if (!profitDate) return;

  setProfitLoading(true);
  setProfitError("");
  setProfitValue(null);

  try {
    const token = localStorage.getItem("ownerToken");

    const res = await axios.get(
      `http://localhost:7600/ilba/profitThisDay/${organisationCode}/${businessCode}`,
      {
        params: { date: formatDates(profitDate) },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProfitValue(res.data.profit);
  } catch (err) {
    setProfitError(
      err.response?.data?.message || "Failed to fetch profit"
    );
  } finally {
    setProfitLoading(false);
  }
};

const fetchCredit = async () => {
  if (!phoneNumber) {
    setCreditError("Please enter a phone number");
    return;
  }

  setCreditLoading(true);
  setCreditError("");
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
      setCreditError(data.message || "No credit info found");
    }
  } catch (err) {
    setCreditError(err.message || "Server error");
  } finally {
    setCreditLoading(false);
  }
};

const addCredit = async () => {
  if (!addPhoneNumber || !addProductCode || !addQuantity) {
    setAddCreditError("All fields are required");
    return;
  }

  setAddCreditLoading(true);
  setAddCreditError("");
  setAddCreditSuccess("");

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
        body: JSON.stringify({
          phoneNumber: addPhoneNumber,
          productCode: addProductCode,
          quantity: addQuantity,
        }),
      }
    );

    const data = await res.json();

    if (res.ok && data.status === "success") {
      setAddCreditSuccess("Credit added successfully!");
      setAddPhoneNumber("");
      setAddProductCode("");
      setAddQuantity("");
    } else {
      setAddCreditError(data.message || "Failed to add credit");
    }
  } catch (err) {
    setAddCreditError(err.message || "Server error");
  } finally {
    setAddCreditLoading(false);
  }
};


// const handleSelectProduct = (product) => {
//   setSearch(product.productName);
//   setSuggestions([]);
//   setHighlightedProduct(product._id);
//   setCurrentPage(1);
//   setFilterProduct(product.productcode);
//   setTimeout(() => {
//     document
//       .getElementById(`product-${product._id}`)
//       ?.scrollIntoView({ behavior: "smooth", block: "center" });
//   }, 100);
// };
// const handleSelectProduct = (product) => {
//   const productCode = product.productcode;

//   setSearch(product.productName);
//   setSuggestions([]);
//   setShowSuggestions(false);

//   const allProducts = analytics?.products || [];

//   const index = allProducts.findIndex(p => p === productCode);

//   if (index === -1) return;

//   const page = Math.floor(index / productsPerPage) + 1;

//   setCurrentPage(page);
//   setHighlightedProduct(productCode);

// setTimeout(() => {
//   const container = mainContentRef.current;
//   const element = document.getElementById(`product-${productCode}`);

//   if (!container || !element) return;

//   const containerRect = container.getBoundingClientRect();
//   const elementRect = element.getBoundingClientRect();

//   const offset = elementRect.top - containerRect.top - 100;

//   container.scrollBy({
//     top: offset,
//     behavior: "smooth",
//   });
// }, 300);
// };

// const handleSelectProduct = (product) => {
//   const productCode = product.productcode;

//   setSearch(product.productName);
//   setSuggestions([]);
//   setShowSuggestions(false);

//   const allProducts = analytics?.products || [];
//   const index = allProducts.findIndex(p => p === productCode);
//   if (index === -1) return;

//   const page = Math.floor(index / productsPerPage) + 1;

//   setCurrentPage(page);
//   setHighlightedProduct(productCode);

//   setTimeout(() => {
//     const element = document.getElementById(`product-${productCode}`);
//     element?.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//   }, 300);

//   setTimeout(() => {
//     setHighlightedProduct(null);
//   }, 2000);
// };

// const handleSelectProduct = (product) => {
//   const productCode = product.productcode;
  
//   setSearch(product.productName);
//   setSuggestions([]);
//   setShowSuggestions(false);

//   const allProducts = analytics?.products || [];
//   const index = allProducts.findIndex(p => p === productCode);
//   if (index === -1) return;

//   const page = Math.floor(index / productsPerPage) + 1;

//   setCurrentPage(page);
//   setHighlightedProduct(productCode);
//   console.log("Clicked productCode:", productCode);
// console.log("All products:", analytics?.products);
// };
const handleSelectProduct = (product) => {
  const productCode = product.productcode;

  setSearch(product.productName);
  setSuggestions([]);
  setShowSuggestions(false);

  const allProducts = analytics?.products || [];

  const index = allProducts.findIndex(
    p => String(p).trim().toLowerCase() === 
         String(productCode).trim().toLowerCase()
  );

  console.log("Index found:", index);

  if (index === -1) {
    console.log("Product not found in analytics.products");
    return;
  }

  const page = Math.floor(index / productsPerPage) + 1;

  setCurrentPage(page);
  console.log("Setting page to:", page);
   
  
  setHighlightedProduct(productCode);
};

// useEffect(() => {
//   if (!highlightedProduct) return;

//   const element = document.getElementById(`product-${highlightedProduct}`);

//   if (element) {
//     element.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//   }

//   const timer = setTimeout(() => {
//     setHighlightedProduct(null);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, [currentPage, highlightedProduct]);

useEffect(() => {
  if (!highlightedProduct) return;

  const timeout = setTimeout(() => {
    const element = document.getElementById(`product-${highlightedProduct}`);
    console.log("Trying to scroll to:", highlightedProduct);
    console.log("Element exists:", element);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, 100); // small delay to wait for DOM render

  const clearHighlight = setTimeout(() => {
    setHighlightedProduct(null);
  }, 2000);

  return () => {
    clearTimeout(timeout);
    clearTimeout(clearHighlight);
  };
}, [currentPage, highlightedProduct]);

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

// const currentProducts  = filteredProduct?[filteredProduct] : analytics?.products?.slice(indexOfFirstProduct,indexOfLastProduct) || [];
const currentProducts =
  analytics?.products?.slice(indexOfFirstProduct,indexOfLastProduct) || [];
 
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

  <button onClick={() => setSalesModal(true)}>
    📊 Sales
  </button>

  <button onClick={() =>setProfitModal(true)}>
    📈 Profit
  </button>

  <button onClick={() =>setCreditModal(true)}>
    💳 Credit Manager
  </button>

  {/* ✅ CORRECT */}
  <button onClick={()=> setAddCreditModal(true)}>
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
      <div className="mainContent" ref={mainContentRef}>

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
{/* {filteredProduct && (
  <button
    className="backInventoryBtn"
    onClick={() => {
      setFilterProduct(null);
      setSearch("");
    }}
  >
    ← Back to Full Inventory
  </button>
)} */}


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
              key={p}
              className={`productCard ${highlightedProduct === p ? "highlightCard" : ""}`}
              id={`product-${p}`}
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

        { totalPages > 1 && (
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

<AnimatePresence>
  {salesModal && (
    <>
      {/* Overlay */}
      <div
        className="modalBackdrop"
        onClick={() => setSalesModal(false)}
      />

      {/* Center Wrapper */}
      <div className="salesModalWrapper">
        <motion.div
          className="salesModal"
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
        >
          <div className="salesHeader">
            <h2>📊 Sales Report</h2>
            <button onClick={() => setSalesModal(false)}>✖</button>
          </div>

          <form onSubmit={fetchSales}>
            <input
              type="date"
              value={salesDate}
              onChange={(e) => setSalesDate(e.target.value)}
              required
            />

            <button disabled={salesLoading}>
              {salesLoading ? "Loading..." : "Get Sales"}
            </button>
          </form>

          {salesError && <p className="error">{salesError}</p>}

          <div className="salesList">
            {salesData.map((s, i) => (
              <div key={i} className="saleCard">
                <p><b>Product:</b> {s.productCode}</p>
                <p><b>Quantity:</b> {s.quantity}</p>
                <p><b>Revenue:</b> ₹{s.totalCost}</p>
                <p><b>Profit:</b> ₹{s.profitMade}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>
<AnimatePresence>
  {profitModal && (
    <>
      <div
        className="salesModalWrapper"
        onClick={() => setProfitModal(false)}
      />

      <div className="salesModalWrapper">
        <motion.div
          className="salesModal"
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
        >
          <div className="salesHeader">
            <h2>📈 Profit Per Day</h2>
            <button onClick={() => setProfitModal(false)}>
              ×
            </button>
          </div>

          <form onSubmit={fetchProfit}>
            <input
              type="date"
              value={profitDate}
              onChange={(e) => setProfitDate(e.target.value)}
              required
            />

            <button disabled={profitLoading}>
              {profitLoading ? "Calculating..." : "Get Profit"}
            </button>
          </form>

          {profitValue !== null && (
            <div className="saleCard" style={{ marginTop: "20px" }}>
              💰 Profit on <b>{profitDate}</b> :
              <h3 style={{ marginTop: "10px", color: "#2dd4bf" }}>
                ₹{profitValue}
              </h3>
            </div>
          )}

          {profitError && (
            <p style={{ color: "#f87171", marginTop: "12px" }}>
              {profitError}
            </p>
          )}
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>

<AnimatePresence>
  {creditModal && (
    <>
      <div
        className="salesModalWrapper"
        onClick={() => setCreditModal(false)}
      />

      <div className="salesModalWrapper">
        <motion.div
          className="salesModal"
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
        >
          <div className="salesHeader">
            <h2>💳 Credit Manager</h2>
            <button onClick={() => setCreditModal(false)}>×</button>
          </div>

          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Enter customer phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <button
              onClick={fetchCredit}
              disabled={creditLoading}
              style={{ marginTop: "10px" }}
            >
              {creditLoading ? "Fetching..." : "Get Credit Info"}
            </button>
          </div>

          {creditError && (
            <p style={{ color: "#f87171", marginTop: "12px" }}>
              {creditError}
            </p>
          )}

          {creditInfo && creditInfo.length > 0 && (
            <div style={{ marginTop: "20px", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr style={{ background: "#1f2937", color: "#fff" }}>
                    <th style={{ padding: "8px" }}>Product</th>
                    <th style={{ padding: "8px" }}>Qty</th>
                    <th style={{ padding: "8px" }}>Total</th>
                    <th style={{ padding: "8px" }}>Status</th>
                    <th style={{ padding: "8px" }}>Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {creditInfo.map((c) => (
                    <tr key={c._id}>
                      <td style={{ padding: "8px" }}>
                        {c.product || c.productcode}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {c.quantity}
                      </td>
                      <td style={{ padding: "8px" }}>
                        ₹{c.totalCost}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {c.status}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {c.issued || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {creditInfo && creditInfo.length === 0 && (
            <p style={{ marginTop: "12px" }}>
              No credit records found.
            </p>
          )}
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>
<AnimatePresence>
  {addCreditModal && (
    <>
      <div
        className="salesModalWrapper"
        onClick={() => setAddCreditModal(false)}
      />

      <div className="salesModalWrapper">
        <motion.div
          className="salesModal"
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
        >
          <div className="salesHeader">
            <h2>➕ Add Credit</h2>
            <button onClick={() => setAddCreditModal(false)}>×</button>
          </div>

          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Customer Phone Number"
              value={addPhoneNumber}
              onChange={(e) => setAddPhoneNumber(e.target.value)}
            />

            <input
              type="text"
              placeholder="Product Code"
              value={addProductCode}
              onChange={(e) => setAddProductCode(e.target.value)}
            />

            <input
              type="number"
              placeholder="Quantity"
              value={addQuantity}
              onChange={(e) => setAddQuantity(e.target.value)}
            />

            <button
              onClick={addCredit}
              disabled={addCreditLoading}
              style={{ marginTop: "5px" }}
            >
              {addCreditLoading ? "Adding..." : "Add Credit"}
            </button>
          </div>

          {addCreditError && (
            <p style={{ color: "#f87171", marginTop: "12px" }}>
              {addCreditError}
            </p>
          )}

          {addCreditSuccess && (
            <p style={{ color: "#34d399", marginTop: "12px" }}>
              {addCreditSuccess}
            </p>
          )}
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>

    </div>
  );
};

export default BusinessDashboard;