import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";
import AddProperty from "./pages/AddProperty";
import HostLogin from "./pages/HostLogin";
import HostDashboard from "./pages/HostDashboard";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  // detect browser back/forward
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  // navigation function
  const go = (url: string) => {
    window.history.pushState({}, "", url);
    setPath(url);
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
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        <button onClick={() => go("/")} style={btn}>Home</button>
        <button onClick={() => go("/properties")} style={btn}>Properties</button>
        <button onClick={() => go("/adverts")} style={btn}>Adverts</button>
        <button onClick={() => go("/shop")} style={btn}>Shop</button>
        <button onClick={() => go("/holidayowners")} style={btn}>Holiday Owners</button>
        <button onClick={() => go("/host-login")} style={btn}>Become a Host</button>
        <button onClick={() => go("/host-dashboard")} style={btn}>Dashboard</button>
      </header>

      {/* ROUTES */}
      {path === "/" && <Home />}
      {path === "/properties" && <Properties />}
      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}
      {path === "/holidayowners" && <HolidayOwners />}
      {path === "/host-login" && <HostLogin />}
      {path === "/host-dashboard" && <HostDashboard />}
      {path === "/add-property" && <AddProperty />}

      {/* FOOTER */}
      <footer
        style={{
          background: "#14532d",
          color: "white",
          padding: "30px",
          marginTop: "40px",
          textAlign: "center"
        }}
      >
        Static Holidays © 2025
      </footer>

    </div>
  );
}

// BUTTON STYLE
const btn = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "8px 12px",
  cursor: "pointer",
  borderRadius: "6px"
};
