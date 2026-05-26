export default function App() {
  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      background: "#f8fafc",
      minHeight: "100vh"
    }}>
      
      <header style={{
        background: "#0f172a",
        color: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between"
      }}>
       <div>
  <button style={{
    marginRight: "10px",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }}>
    Login
  </button>

  <button style={{
    padding: "10px 20px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }}>
    Sign Up
  </button>
</div>

      <section style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "#3b82f6",
        color: "white"
      }}>
        <h2>Find Your Perfect Holiday Stay</h2>
        <p>Discover static holiday homes, caravan stays and holiday parks across the UK</p>
        <button style={{
          padding: "15px 30px",
          background: "white",
          color: "#3b82f6",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          Search Holidays
        </button>
      </section>

      <section style={{ padding: "50px" }}>
        <h2>Featured Holiday Listings</h2>
        <div style={{
          display: "flex",
          gap: "20px"
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            Luxury Caravan Retreat
          </div>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            Coastal Holiday Lodge
          </div>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            Family Holiday Park Stay
          </div>
        </div>
      </section>

      <footer style={{
        background: "#0f172a",
        color: "white",
        textAlign: "center",
        padding: "20px"
      }}>
        Static Holidays © 2025
      </footer>

    </div>
  );
}
