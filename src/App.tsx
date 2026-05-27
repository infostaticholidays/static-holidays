import Adverts from "./pages/Adverts";

export default function App() {
  const path = window.location.pathname;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f6fff8",
        minHeight: "100vh",
        margin: 0,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#166534",
          color: "white",
        }}
      >
        <h1>Static Holidays</h1>

        <nav style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </a>

          <a
            href="/adverts"
            style={{ color: "white", textDecoration: "none" }}
          >
            Adverts
          </a>

          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Listings
          </a>

          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Contact
          </a>
        </nav>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
            }}
          >
            Login
          </button>

          <button
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#22c55e",
              color: "white",
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* PAGE ROUTING (THIS IS THE IMPORTANT PART) */}
      {path === "/" && (
        <>
          <section
            style={{
              textAlign: "center",
              padding: "100px 20px",
              background: "linear-gradient(to bottom, #dcfce7, #f6fff8)",
            }}
          >
            <h2 style={{ fontSize: "42px", color: "#166534" }}>
              Find Your Perfect Holiday Stay
            </h2>

            <p style={{ fontSize: "18px", color: "#14532d" }}>
              Discover static holiday homes, caravan parks and lodge retreats
              across the UK
            </p>
          </section>

          <section style={{ padding: "60px 40px" }}>
            <h2 style={{ color: "#166534" }}>Featured Holiday Homes</h2>
          </section>
        </>
      )}

      {path === "/adverts" && <Adverts />}

      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#166534",
          color: "white",
        }}
      >
        Static Holidays © 2025
      </footer>
    </div>
  );
}
