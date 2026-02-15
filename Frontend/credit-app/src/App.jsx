import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import LoginOwner from "./pages/LoginOwner";
import BusinessDashboard from "./pages/BusinessDashboard";
import AddCredit from "./pages/AddCredit";
import AddProduct from "./pages/Addproduct";
import CreateSale from "./pages/CreateSale";
import SettleCredit from "./pages/SettleCredit";
import ProfitPerDay from "./pages/ProfitPerDay";
import CreditManager from "./pages/CreditManager";
import CustomerLogin from "./pages/CustomerRegister";
import BusinessSales from "./pages/BusinessSales";

function App() {
  return (
    <Routes>
      <Route path="/signupowner" element={<Signup />} />
      <Route path="/" element={<LoginOwner />} />
      <Route path="/dashboard" element={<OwnerDashboard />} />

      {/* Business Dashboard */}
      <Route
        path="/business/:businessCode"
        element={<BusinessDashboard />}
      />

      {/* Add Credit */}
      <Route
        path="/add-credit/:organisationCode/:businessCode"
        element={<AddCredit />}
      />
      <Route
  path="/business/:BuisnessCode/add-product"
  element={<AddProduct />}
/>
<Route
  path="/business/:OrganisationCode/:BuisnessCode/add-sale"
  element={<CreateSale />}
/>
<Route
  path="/business/:BuisnessCode/settle-credit"
  element={<SettleCredit />}
/>
  <Route
  path="/business/:OrganisationCode/:BuisnessCode/profit-per-day"
  element={<ProfitPerDay />}
/>
<Route
  path="/business/:organisationCode/:businessCode/credit-manager"
  element={<CreditManager />}
/>
<Route path="/customer-register" element={<CustomerLogin />} />

<Route
  path="/business/:BusinessCode/sales"
  element={<BusinessSales />}
/>


    </Routes>
  );
}

export default App;
