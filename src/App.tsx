import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";

export default function App() {
 import { useState, useEffect } from "react";
  const [path, setPath] = useState(window.location.pathname);

useEffect(() => {
  const onChange = () => setPath(window.location.pathname);
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

      {/* HEADER */}
      <header
        style={{
          background: "#14532d",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Static Holidays</h1>

        <nav style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "white" }}>Home</a>
          <a href="/properties" style={{ color: "white" }}>Properties</a>
          <a href="/holidayowners" style={{ color: "white" }}>Holiday Owners</a>
          <a href="/adverts" style={{ color: "white" }}>Adverts</a>
          <a href="/shop" style={{ color: "white" }}>Shop</a>
        </nav>
      </header>

      {/* ROUTES */}
      {path === "/" && <h1 style={{ padding: 20 }}>Home Page</h1>}

      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}
      {path === "/properties" && <Properties />}
      {path === "/holidayowners" && <HolidayOwners />}

      {/* FOOTER */}
      <footer
        style={{
          background: "#14532d",
          color: "white",
          padding: "40px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        Static Holidays © 2025
      </footer>

    </div>
  );
}
