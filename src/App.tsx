import { useState, useEffect } from "react";

import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";

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
        gap: "20px"
      }}>
        
        <button onClick={() => go("/")} style={btn}>Home</button>
        <button onClick={() => go("/properties")} style={btn}>Properties</button>
        <button onClick={() => go("/holidayowners")} style={btn}>Holiday Owners</button>
        <button onClick={() => go("/adverts")} style={btn}>Adverts</button>
        <button onClick={() => go("/shop")} style={btn}>Shop</button>

      </header>

      {/* PAGES */}
      {path === "/" && <h1 style={{ padding: 20 }}>Home Page</h1>}
      {path === "/properties" && <Properties />}
      {path === "/holidayowners" && <HolidayOwners />}
      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}

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
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "16px"
};
