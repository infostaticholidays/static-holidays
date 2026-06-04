import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";
import HostLogin from "./pages/HostLogin";
import HostDashboard from "./pages/HostDashboard";
import GuestDashboard from "./pages/GuestDashboard";
import AddProperty from "./pages/AddProperty";
import PropertyDetail from "./pages/PropertyDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/adverts" element={<Adverts />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/holidayowners" element={<HolidayOwners />} />
        <Route path="/host-login" element={<HostLogin />} />
        <Route path="/host-dashboard" element={<HostDashboard />} />
        <Route path="/guest-dashboard" element={<GuestDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-property" element={<AddProperty />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
