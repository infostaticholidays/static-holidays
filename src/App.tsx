
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import EditProperty from "./pages/EditProperty";
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
import MyProperties from "./pages/MyProperties";
import PropertyCalendar from "./pages/PropertyCalendar";
import HostDashboard from "./pages/HostDashboard";



function NotFound() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p>The page you requested could not be found.</p>
      <Link to="/">Return home</Link>
    </div>
  );
}

function PromoteProperty() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1 style={{ color: "#14532d" }}>Promote a Property</h1>

      <p>
        Promote your holiday property to help more guests discover it.
      </p>

      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          padding: "24px",
          marginTop: "24px",
        }}
      >
        <h2>Property Promotion</h2>

        <p>
          A 30-day promotion option is planned at £4.99 per property.
        </p>

        <p>
          Promotion payments are not enabled on this temporary page.
        </p>

        <Link
          to="/my-properties"
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "12px 18px",
            background: "#14532d",
            color: "#ffffff",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          View My Properties
        </Link>
      </div>
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
      <main style={{ flex: 1, width: "100%" }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route
            path="/edit-property/:id"
            element={<EditProperty />}
          />

   <Route path="/my-properties" element={<MyProperties />} />

          <Route
            path="/promote-property"
            element={<PromoteProperty />}
          />

          <Route path="/adverts" element={<Adverts />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopDetail />} />

          <Route
            path="/holidayowners"
            element={<HolidayOwners />}
          />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route
            path="/bookings"
            element={
              <div style={{ padding: "40px" }}>
                <Bookings />
                <Link to="/">Back to Home</Link>
              </div>
            }
          />

          <Route
            path="/booking/:id"
            element={<BookingDetail />}
          />

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
  path="/dashboard"
  element={<HostDashboard />}
/>

          <Route
            path="/host-bookings"
            element={<Bookings />}
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
          padding: "24px",
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
