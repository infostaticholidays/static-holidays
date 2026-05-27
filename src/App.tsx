import Adverts from "./pages/Adverts";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Properties from "./pages/Properties";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Shop from "./pages/Shop";
import ShopDetail from "./pages/ShopDetail";

export default function App() {
  const path = window.location.pathname;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>

      {/* HEADER */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        background: "#166534",
        color: "white"
      }}>
        <h1>Static Holidays</h1>

        <nav style={{ display: "flex", gap: "15px" }}>
          <a href="/" style={{ color: "white" }}>Home</a>
          <a href="/properties" style={{ color: "white" }}>Properties</a>
          <a href="/adverts" style={{ color: "white" }}>Adverts</a>
          <a href="/bookings" style={{ color: "white" }}>Bookings</a>
          <a href="/events" style={{ color: "white" }}>Events</a>
          <a href="/shop" style={{ color: "white" }}>Shop</a>
        </nav>
      </header>

      {/* ROUTES */}
      {path === "/" && (
        <div style={{ padding: "60px", textAlign: "center" }}>
          <h2>Find Your Perfect Holiday Stay</h2>

          {/* SEARCH BAR (RESTORED) */}
          <div style={{ marginTop: "30px" }}>
            <input placeholder="Search location..." style={{ padding: 10, marginRight: 10 }} />
            <input type="date" style={{ padding: 10, marginRight: 10 }} />
            <input type="date" style={{ padding: 10, marginRight: 10 }} />
            <button style={{ padding: 10, background: "#16a34a", color: "white" }}>
              Search
            </button>
          </div>
        </div>
      )}

      {path === "/adverts" && <Adverts />}
      {path === "/bookings" && <Bookings />}
      {path.startsWith("/bookings/") && <BookingDetail />}

      {path === "/properties" && <Properties />}

      {path === "/events" && <Events />}
      {path.startsWith("/events/") && <EventDetail />}

      {path === "/shop" && <Shop />}
      {path.startsWith("/shop/") && <ShopDetail />}

      {/* FOOTER */}
      <footer style={{
        textAlign: "center",
        padding: "20px",
        background: "#166534",
        color: "white",
        marginTop: "40px"
      }}>
        Static Holidays © 2025
      </footer>

    </div>
  );
}
