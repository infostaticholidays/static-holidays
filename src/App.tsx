import { Link, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyCalendar from "./pages/PropertyCalendar";
import AddProperty from "./pages/AddProperty";

import Adverts from "./pages/Adverts";

import Shop from "./pages/Shop";
import ShopDetail from "./pages/ShopDetail";

import HolidayOwners from "./pages/HolidayOwners";

import HostLogin from "./pages/HostLogin";
import HostRegister from "./pages/HostRegister";

import GuestDashboard from "./pages/GuestDashboard";
import HostDashboard from "./pages/HostDashboard";

import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";

import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";

import Profile from "./pages/Profile";

export default function App() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          background: "#14532d",
          color: "white",
          padding: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <Link style={btn} to="/">Home</Link>

        <Link style={btn} to="/properties">
          Properties
        </Link>

        <Link style={btn} to="/adverts">
          Adverts
        </Link>

        <Link style={btn} to="/shop">
          Shop
        </Link>

        <Link style={btn} to="/events">
          Events
        </Link>

        <Link style={btn} to="/holidayowners">
          Holiday Owners
        </Link>

        <Link style={btn} to="/host-login">
          Become a Host
        </Link>

        <Link style={btn} to="/login">
          Login
        </Link>

        <Link style={btn} to="/signup">
          Sign Up
        </Link>

        <Link style={btn} to="/profile">
          My Account
        </Link>
      </header>

      <main style={{ flex: 1, padding: "40px" }}>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/guest-dashboard" element={<GuestDashboard />} />
          <Route path="/host-dashboard" element={<HostDashboard />} />

          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/property-calendar/:propertyId" element={<PropertyCalendar />} />
          <Route path="/add-property" element={<AddProperty />} />

          <Route path="/adverts" element={<Adverts />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopDetail />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="/bookings" element={<Bookings />} />
          <Route path="/booking/:id" element={<BookingDetail />} />

          <Route path="/holidayowners" element={<HolidayOwners />} />

          <Route path="/host-login" element={<HostLogin />} />
          <Route path="/host-register" element={<HostRegister />} />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="*"
            element={
              <div>
                <h1>404</h1>
                <p>Page not found.</p>
              </div>
            }
          />

        </Routes>
      </main>

      <footer
        style={{
          background: "#14532d",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        Static Holidays © 2025
      </footer>
    </div>
  );
}

const btn = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "8px 12px",
  borderRadius: "6px",
  textDecoration: "none",
};
