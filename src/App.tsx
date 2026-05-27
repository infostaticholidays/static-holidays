import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";

export default function App() {
  const path = window.location.pathname;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>

      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          background: "#166534",
          color: "white",
          alignItems: "center",
        }}
      >
        <h1>Static Holidays</h1>

        <nav style={{ display: "flex", gap: "15px" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </a>

          <a href="/adverts" style={{ color: "white", textDecoration: "none" }}>
            Adverts
          </a>

          <a href="/shop" style={{ color: "white", textDecoration: "none" }}>
            Shop
          </a>
        </nav>
      </header>

      {/* HOMEPAGE */}
      {path === "/" && (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            background: "#f6fff8",
            minHeight: "80vh",
          }}
        >
          <h2
            style={{
              color: "#166534",
              fontSize: "42px",
            }}
          >
            Find Your Perfect Holiday Stay
          </h2>

          <p
            style={{
              color: "#14532d",
              fontSize: "18px",
            }}
          >
            Discover static holiday homes across the UK
          </p>

          {/* SEARCH BAR */}
          <div style={{ marginTop: "30px" }}>
            <input
              placeholder="Search location..."
              style={{
                padding: 10,
                marginRight: 10,
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="date"
              style={{
                padding: 10,
                marginRight: 10,
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="date"
              style={{
                padding: 10,
                marginRight: 10,
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <button
              style={{
                padding: 10,
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* PAGES */}
      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          background: "#166534",
          color: "white",
        }}
      >
        Static Holidays © 2025
      </footer>
    </div>
  );
}
