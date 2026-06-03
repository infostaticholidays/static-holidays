import { Link } from "react-router-dom";

export default function App() {
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
        <Link style={btn} to="/">Home</Link>
        <Link style={btn} to="/properties">Properties</Link>
        <Link style={btn} to="/adverts">Adverts</Link>
        <Link style={btn} to="/shop">Shop</Link>
        <Link style={btn} to="/holidayowners">Holiday Owners</Link>
        <Link style={btn} to="/host-login">Become a Host</Link>
        <Link style={btn} to="/login">Login</Link>
        <Link style={btn} to="/signup">Sign Up</Link>
      </header>

      {/* HOME CONTENT */}
      <div style={{ padding: 40 }}>
        <h1>Welcome to Static Holidays</h1>
        <p>Select a section from the menu above.</p>
      </div>

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

const btn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "8px 12px",
  borderRadius: "6px",
  textDecoration: "none",
};
