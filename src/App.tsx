import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";

import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import ShopDetail from "./pages/ShopDetail";

import HolidayOwners from "./pages/HolidayOwners";

import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";

import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";

import Profile from "./pages/Profile";
import AddProperty from "./pages/AddProperty";

import Account from "./pages/Account";

import PropertyCalendar from "./pages/PropertyCalendar";

export default function App() {
  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <header style={{
        background: "#14532d",
        color: "white",
        padding: 20,
        display: "flex",
        gap: 12,
        flexWrap: "wrap"
      }}>
        <Link style={btn} to="/">Home</Link>
        <Link style={btn} to="/properties">Properties</Link>
        <Link style={btn} to="/adverts">Adverts</Link>
        <Link style={btn} to="/shop">Shop</Link>
        <Link style={btn} to="/holidayowners">Holiday Owners</Link>
        <Link style={btn} to="/login">Login</Link>
        <Link style={btn} to="/signup">Sign Up</Link>
      </header>

      {/* ROUTES */}
      <main style={{ flex: 1, padding: 40 }}>
        <Routes>

          <Route path="/" element={<Home />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* MAIN */}
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />

          <Route path="/adverts" element={<Adverts />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopDetail />} />

          <Route path="/holidayowners" element={<HolidayOwners />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="/bookings" element={<Bookings />} />
          <Route path="/booking/:id" element={<BookingDetail />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/add-property" element={<AddProperty />} />

          {/* ACCOUNT (ONLY LOGIN DESTINATION) */}
          <Route path="/account" element={<Account />} />

          {/* PROPERTY CALENDAR */}
          <Route path="/property-calendar/:propertyId" element={<PropertyCalendar />} />

          {/* 404 */}
          <Route path="*" element={<h1>404 Page not found</h1>} />

        </Routes>
      </main>

      {/* FOOTER */}
      <footer style={{
        background: "#14532d",
        color: "white",
        padding: 20,
        textAlign: "center"
      }}>
        Static Holidays © 2025
      </footer>
    </div>
  );
}

// button style
const btn = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "8px 12px",
  borderRadius: "6px",
  textDecoration: "none"
};
