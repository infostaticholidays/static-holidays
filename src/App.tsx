import { Link, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

export default function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      {/* HEADER */}
      <header
        style={{
          background: "#14532d",
          color: "white",
          padding: "20px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link style={btn} to="/">
          Home
        </Link>

        <Link style={btn} to="/properties">
          Properties
        </Link>

        <Link style={btn} to="/adverts">
          Adverts
        </Link>

        <Link style={btn} to="/shop">
          Shop
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

        <Link style={btn} to="/account">
          My Account
        </Link>
      </header>

      {/* PAGE CONTENT */}
      <main style={{ padding: "40px", minHeight: "70vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />

          {/* Temporary placeholders */}
          <Route path="/properties" element={<h1>Properties</h1>} />
          <Route path="/adverts" element={<h1>Adverts</h1>} />
          <Route path="/shop" element={<h1>Shop</h1>} />
          <Route path="/holidayowners" element={<h1>Holiday Owners</h1>} />
          <Route path="/host-login" element={<h1>Become a Host</h1>} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: "#14532d",
          color: "white",
          padding: "30px",
          textAlign: "center",
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
