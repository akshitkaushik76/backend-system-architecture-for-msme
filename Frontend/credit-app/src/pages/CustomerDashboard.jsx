import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerDashboard.css";
import { color } from "framer-motion";

export default function CustomerDashboard(){

const [view,setView] = useState("organisations");

const [organisations,setOrganisations] = useState([]);
const [businesses,setBusinesses] = useState([]);
const [credits,setCredits] = useState({});

const [selectedOrg,setSelectedOrg] = useState("");
const [selectedBusiness,setSelectedBusiness] = useState("");

const [products,setProducts] = useState([]);
const [query,setQuery] = useState("");
const [selectedProduct,setSelectedProduct] = useState(null);

const email = localStorage.getItem("customerEmail");
const token = localStorage.getItem("token");
const phone = localStorage.getItem("phone");
const name = localStorage.getItem("customerName");


// FETCH ORGANISATIONS
useEffect(()=>{

if(!email) return;

const fetchOrganisations = async()=>{

try{

const res = await axios.get(
`http://localhost:7600/ilba/getOrganisations/${encodeURIComponent(email)}`,
{ headers:{Authorization:`Bearer ${token}`} }
);

setOrganisations(res.data.organisations);

}catch(err){
console.log(err);
}

};

fetchOrganisations();

},[email,token]);



// LOAD BUSINESSES
const loadBusinesses = async(org)=>{

try{

setSelectedOrg(org);

const res = await axios.get(
`http://localhost:7600/ilba/getBusinesses/${org}`,
{ headers:{Authorization:`Bearer ${token}`} }
);

setBusinesses(res.data.Buisinesses);
setView("businesses");

}catch(err){
console.log(err);
}

};



// SELECT BUSINESS
const openBusiness = (code)=>{
setSelectedBusiness(code);
setView("business");
};



// SEARCH PRODUCTS
const searchProducts = async(value)=>{

setQuery(value);

if(!value){
setProducts([]);
return;
}

try{

const res = await axios.get(
`http://localhost:7600/ilba/search-products/${selectedBusiness}?q=${value}`,
{ headers:{Authorization:`Bearer ${token}`} }
);

setProducts(res.data.products);

}catch(err){
console.log(err);
}

};



// SELECT PRODUCT
const selectProduct = (product)=>{
setSelectedProduct(product);
setProducts([]);
setQuery(product.productName);
};



// LOAD CREDIT
const loadCredit = async()=>{

try{

const res = await axios.get(
`http://localhost:7600/ilba/getCreditinfo/${selectedOrg}/${selectedBusiness}/${phone}`,
{ headers:{Authorization:`Bearer ${token}`} }
);

setCredits(res.data);
setView("credit");

}catch(err){
console.log(err);
}

};



return(

<div className="layout">

{/* SIDEBAR */}

<div className="sidebar">

<h2 className="logo">FINVENTORY</h2>

<ul>

<li
className={view==="organisations"?"active":""}
onClick={()=>setView("organisations")}
>
Organisations
</li>

<li
className={view==="profile"?"active":""}
onClick={()=>setView("profile")}
>
Profile
</li>

</ul>

</div>



{/* MAIN */}

<div className="main">
<div className="main-content">
<div className="bg-circle"></div>


{/* WELCOME */}

<div className="welcome-box">

<h1>Welcome back, {name}</h1>

<p>
Track your businesses, products and credit records easily.
</p>

</div>



{/* ORGANISATIONS */}

{view==="organisations" && (

<div className="grid">

{organisations.map(org=>(

<div
key={org}
className="card org-card"
onClick={()=>loadBusinesses(org)}
>

<h3>{org}</h3>
<p>View Businesses →</p>

</div>

))}

</div>

)}



{/* BUSINESSES */}

{view==="businesses" && (

<div className="grid">

{businesses.map(b=>(

<div
key={b.CreationCode}
className="card"
onClick={()=>openBusiness(b.CreationCode)}
>

<h3>{b.BusinessName}</h3>
<p>{b.CreationCode}</p>

</div>

))}

</div>

)}



{/* BUSINESS VIEW */}

{view==="business" && (

<div className="business-section">

<div className="search-box">

<input
placeholder="Search product..."
value={query}
onChange={(e)=>searchProducts(e.target.value)}
/>

{products.length>0 && (

<div className="suggestions">

{products.map(p=>(

<div
key={p.productcode}
className="suggestion"
onClick={()=>selectProduct(p)}
>

{p.productName}

</div>

))}

</div>

)}

</div>



{selectedProduct && (

<div className="product-card">

<h3>{selectedProduct.productName}</h3>

<p>Price: ₹{selectedProduct.sellingPrice}</p>
<p>Quantity Left: {selectedProduct.quantity}</p>

</div>

)}



<button
className="credit-btn"
onClick={loadCredit}
>

View Credits

</button>

</div>

)}



{/* CREDIT */}

{view==="credit" && (

<div>

<h2 className="Heading">Credits</h2>

{credits.not_settledCredit?.map((c,i)=>(

<div key={i} className="credit-card unpaid">
<p>Unpaid ₹{c.totalCost}</p>
<p>Product Code : {c.productcode}</p>
<p>quantity : {c.quantity}</p>
<p>unique code: {c.uniqueCode}</p>
<p>issued : {c.issued}</p>
</div>

))}

{credits.partially_settled?.map((c,i)=>(

<div key={i} className="credit-card partial">
<p>partial ₹{c.totalCost}</p>
<p>Product Code : {c.productcode}</p>
<p>quantity : {c.quantity}</p>
<p>unique code: {c.uniqueCode}</p>
<p>issued : {c.issued}</p>
</div>

))}

{credits.settledCredit?.map((c,i)=>(

<div key={i} className="credit-card settled">

<p>Product Code : {c.productcode}</p>
<p>quantity : {c.quantity}</p>
<p>unique code: {c.uniqueCode}</p>
<p>issued : {c.issued}</p>
<p>Settle date : {c.settleDate}</p>
<p>Settle time: {c.settleTime}</p>
</div>

))}

</div>

)}



{/* PROFILE */}

{view==="profile" && (

<div className="profile">

<h2>Customer Profile</h2>

<p>Email: {email}</p>
<p>Phone: {phone}</p>

</div>

)}

</div>

</div>
</div>

);

}