export default function App() {
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

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
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
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      <section
        style={{
          textAlign: "center",
          padding: "100px 20px",
          background: "linear-gradient(to bottom, #dcfce7, #f6fff8)",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            color: "#166534",
          }}
        >
          Find Your Perfect Holiday Stay
        </h2>

        <p
          style={{
            fontSize: "18px",
            color: "#14532d",
          }}
        >
          Discover static holiday homes across the UK
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "15px 30px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#16a34a",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Search Holidays
        </button>
      </section>

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
