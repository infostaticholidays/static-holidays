
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AddProperty from "./pages/AddProperty";
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import ShopDetail from "./pages/ShopDetail";
import HolidayOwners from "./pages/HolidayOwners";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Businesses from "./pages/Businesses";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import HostCompliance from "./pages/HostCompliance";
import PropertyCalendar from "./pages/PropertyCalendar";
import HostDashboard from "./pages/HostDashboard";

function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Page not found</h1>
      <p>The page you requested could not be found.</p>
      <Link to="/">Return home</Link>
    </div>
  );
}

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        color: "#1f2937",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "18px 24px",
          background: "#14532d",
          color: "#ffffff",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Static Holidays
        </Link>

        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
          }}
        >
          <Link to="/properties" style={{ color: "#ffffff" }}>
            Properties
          </Link>
          <Link to="/events" style={{ color: "#ffffff" }}>
            Events
          </Link>
          <Link to="/businesses" style={{ color: "#ffffff" }}>
            Businesses
          </Link>
          <Link to="/shop" style={{ color: "#ffffff" }}>
            Shop
          </Link>
          <Link to="/host-dashboard" style={{ color: "#ffffff" }}>
            Host Dashboard
          </Link>
          <Link to="/login" style={{ color: "#ffffff" }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: "#ffffff" }}>
            Sign up
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, width: "100%" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/add-property" element={<AddProperty />} />

          <Route path="/adverts" element={<Adverts />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopDetail />} />

          <Route path="/holidayowners" element={<HolidayOwners />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="/bookings" element={<Bookings />} />
          <Route path="/booking/:id" element={<BookingDetail />} />

          <Route path="/businesses" element={<Businesses />} />
          <Route path="/services" element={<Services />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<Account />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          <Route
            path="/host-dashboard"
            element={<HostDashboard />}
          />
          <Route
            path="/host-compliance"
            element={<HostCompliance />}
          />
          <Route
            path="/property-calendar/:propertyId"
            element={<PropertyCalendar />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer
        style={{
          padding: 24,
          textAlign: "center",
          background: "#f3f4f6",
          color: "#374151",
        }}
      >
        © {new Date().getFullYear()} Static Holidays
      </footer>
    </div>
  );
}
