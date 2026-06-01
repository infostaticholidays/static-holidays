import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";
import AddProperty from "./pages/AddProperty";
import HostLogin from "./pages/HostLogin";
{path === "/host-login" && <HostLogin />}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  const go = (url: string) => {
    window.history.pushState({}, "", url);
    setPath(url);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

      {/* HEADER */}
      <header style={{
        background: "#14532d",
        color: "white",
        padding: "20px",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        <button onClick={() => go("/")} style={btn}>Home</button>
        <button onClick={() => go("/properties")} style={btn}>Properties</button>
        <button onClick={() => go("/adverts")} style={btn}>Adverts</button>
        <button onClick={() => go("/shop")} style={btn}>Shop</button>
        <button onClick={() => go("/holidayowners")} style={btn}>Holiday Owners</button>
      </header>

      {/* ROUTES */}
      {path === "/" && <Home />}
      {path === "/properties" && <Properties />}
      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}
      {path.replace(/\/$/, "").toLowerCase() === "/holidayowners" && (
  <HolidayOwners />
)}

      {/* FOOTER */}
      <footer style={{
        background: "#14532d",
        color: "white",
        padding: "30px",
        marginTop: "40px",
        textAlign: "center"
      }}>
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
  cursor: "pointer",
  borderRadius: "6px"
};
