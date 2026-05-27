import Adverts from "./pages/Adverts";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";

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
      {/* HEADER */}
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

          <a href="/adverts" style={{ color: "white", textDecoration: "none" }}>
            Adverts
          </a>

          <a href="/bookings" style={{ color: "white", textDecoration: "none" }}>
            Bookings
          </a>

          <a href="/events" style={{ color: "white", textDecoration: "none" }}>
            Events
          </a>

          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Listings
          </a>

          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Contact
          </a>
        </nav>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ padding: "10px 20px", borderRadius: "8px", border: "none" }}>
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

      {/* HOME PAGE */}
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
              Discover static holiday homes, caravan parks and lodge retreats across the UK
            </p>

            {/* SEARCH / CALENDAR BAR */}
            <div style={{ marginTop: "30px" }}>
              <input
                type="text"
                placeholder="Search destination (e.g. Cornwall, Lakes, Wales)"
                style={{
                  padding: "12px",
                  width: "260px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              />

              <input
                type="date"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              />

              <input
                type="date"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              />

              <button
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>
          </section>

          <section style={{ padding: "60px 40px" }}>
            <h2 style={{ color: "#166534" }}>Featured Holiday Homes</h2>
          </section>
        </>
      )}

      {/* ADVERTS PAGE */}
      {path === "/adverts" && <Adverts />}

      {/* BOOKINGS LIST PAGE */}
      {path === "/bookings" && <Bookings />}

      {/* BOOKING DETAIL PAGE */}
      {path.startsWith("/bookings/") && <BookingDetail />}

      {/* EVENTS LIST PAGE */}
      {path === "/events" && <Events />}

      {/* EVENT DETAIL PAGE */}
      {path.startsWith("/events/") && <EventDetail />}

      {/* FOOTER */}
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
