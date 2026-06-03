import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";
import AddProperty from "./pages/AddProperty";
import HostLogin from "./pages/HostLogin";
import HostDashboard from "./pages/HostDashboard";
import GuestDashboard from "./pages/GuestDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  // sync browser back/forward buttons
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // navigation function
  const go = (url: string) => {
    window.history.pushState({}, "", url);
    setPath(url);
  };

  const renderPage = () => {
    switch (path) {
      case "/":
        return <Home />;

      case "/properties":
        return <Properties />;

      case "/adverts":
        return <Adverts />;

      case "/shop":
        return <Shop />;

      case "/holidayowners":
        return <HolidayOwners />;

      case "/dashboard":
        return <GuestDashboard />;

      case "/host-login":
        return <HostLogin />;

      case "/host-dashboard":
        return <HostDashboard />;

      case "/add-property":
        return <AddProperty />;

      case "/login":
        return <Login />;

      case "/signup":
        return <Signup />;

      default:
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>404 - Page Not Found</h2>
            <button onClick={() => go("/")} style={btn}>
              Go Home
            </button>
          </div>
        );
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
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
        <button onClick={() => go("/")} style={btn}>Home</button>
        <button onClick={() => go("/properties")} style={btn}>Properties</button>
        <button onClick={() => go("/adverts")} style={btn}>Adverts</button>
        <button onClick={() => go("/shop")} style={btn}>Shop</button>
        <button onClick={() => go("/holidayowners")} style={btn}>Holiday Owners</button>
        <button onClick={() => go("/host-login")} style={btn}>Become a Host</button>
        <button onClick={() => go("/login")} style={btn}>Login</button>
        <button onClick={() => go("/signup")} style={btn}>Sign Up</button>
        <button onClick={() => go("/host-dashboard")} style={btn}>Dashboard</button>
      </header>

      {/* PAGE CONTENT */}
      {renderPage()}

      {/* FOOTER */}
      <footer
        style={{
          background: "#14532d",
          color: "white",
          padding: "30px",
          marginTop: "40px",
          textAlign: "center",
        }}
      >
        Static Holidays © 2025
      </footer>
    </div>
  );
}

// shared button style
const btn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "8px 12px",
  cursor: "pointer",
  borderRadius: "6px",
};
