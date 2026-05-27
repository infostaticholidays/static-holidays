import Adverts from "./pages/Adverts";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Shop from "./pages/Shop";
import ShopDetail from "./pages/ShopDetail";

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

        <nav style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "white" }}>Home</a>
          <a href="/adverts" style={{ color: "white" }}>Adverts</a>
          <a href="/bookings" style={{ color: "white" }}>Bookings</a>
          <a href="/events" style={{ color: "white" }}>Events</a>
          <a href="/properties" style={{ color: "white" }}>Properties</a>
          <a href="/shop" style={{ color: "white" }}>Shop</a>
        </nav>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ padding: "10px 20px", borderRadius: "8px" }}>
            Login
          </button>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#22c55e",
              color: "white",
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* HOME */}
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
              Search homes, events, and experiences across the UK
            </p>

            {/* SEARCH BAR */}
            <div style={{ marginTop: "30px" }}>
              <input
                type="text"
                placeholder="Search destination..."
                style={{ padding: "12px", borderRadius: "8px", marginRight: "10px" }}
              />
              <input type="date" style={{ padding: "12px", borderRadius: "8px", marginRight: "10px" }} />
              <input type="date" style={{ padding: "12px", borderRadius: "8px", marginRight: "10px" }} />
              <button style={{ padding: "12px 20px", backgroundColor: "#16a34a", color: "white" }}>
                Search
              </button>
            </div>
          </section>
        </>
      )}

      {/* ROUTES */}
      {path === "/adverts" && <Adverts />}
      {path === "/bookings" && <Bookings />}
      {path.startsWith("/bookings/") && <BookingDetail />}

      {path === "/events" && <Events />}
      {path.startsWith("/events/") && <EventDetail />}

      {path === "/properties" && <Properties />}
      {path.startsWith("/properties/") && <PropertyDetail />}

      {path === "/shop" && <Shop />}
      {path.startsWith("/shop/") && <ShopDetail />}

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
