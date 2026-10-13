```tsx
import { Routes, Route, Link } from "react-router-dom";

// Main pages
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
import HostDashboard from "./pages/HostDashboard";

import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";

import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";

import Profile from "./pages/Profile";
import Businesses from "./pages/Businesses";
import Services from "./pages/Services";

import Account from "./pages/Account";
import PropertyCalendar from "./pages/PropertyCalendar";
import HostCompliance from "./pages/HostCompliance";

import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";

// Temporary page for sections that have not been built yet.
function HostPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        maxWidth: 850,
        margin: "30px auto",
        padding: 28,
        background: "#ffffff",
        border: "1px solid #e4e9e6",
        borderRadius: 16,
        fontFamily: "Arial, sans-serif",
        color: "#1c2922",
      }}
    >
      <p
        style={{
          color: "#176b50",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: 1,
        }}
      >
        STATIC HOLIDAYS · HOST CENTRE
      </p>

      <h1 style={{ fontSize: 28, marginBottom: 12 }}>{title}</h1>

      <p style={{ color: "#68756e", lineHeight: 1.7 }}>
        {description}
      </p>

      <p style={{ color: "#68756e", fontSize: 14 }}>
        This section needs its own page and functionality. Your dashboard and
        other pages remain available.
      </p>

      <Link
        to="/host-dashboard"
        style={{
          display: "inline-block",
          marginTop: 12,
          background: "#176b50",
          color: "#ffffff",
          textDecoration: "none",
          padding: "12px 18px",
          borderRadius: 9,
          fontWeight: 700,
        }}
      >
        ← Back to Host Dashboard
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          background: "#14532d",
          color: "white",
          padding: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Link style={btn} to="/">Home</Link>
        <Link style={btn} to="/properties">Properties</Link>
        <Link style={btn} to="/blog">Blog</Link>
        <Link style={btn} to="/adverts">Adverts</Link>
        <Link style={btn} to="/shop">Shop</Link>
        <Link style={btn} to="/holidayowners">Holiday Owners</Link>
        <Link style={btn} to="/events">Events</Link>
        <Link style={btn} to="/login">Login</Link>
        <Link style={btn} to="/signup">Sign Up</Link>
        <Link style={btn} to="/account">Account</Link>
        <Link style={btn} to="/host-dashboard">Host Dashboard</Link>
      </header>

      <main style={{ flex: 1, padding: 40 }}>
        <Routes>
          {/* HOME AND AUTHENTICATION */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Profile />} />

          {/* PROPERTIES */}
          <Route path="/properties" element={<Properties />} />

          {/* Sidebar alias: My Properties */}
          <Route path="/my-properties" element={<Properties />} />

          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/add-property" element={<AddProperty />} />

          {/* Edit page placeholder until a dedicated editor exists */}
          <Route
            path="/edit-property/:id"
            element={
              <HostPlaceholder
                title="Edit Property"
                description="The property editor has not been connected yet. Open My Properties to view your listings."
              />
            }
          />

          {/* PROPERTY CALENDAR */}
          <Route
            path="/property-calendar/:propertyId"
            element={<PropertyCalendar />}
          />

          {/* HOST DASHBOARD */}
          <Route path="/host-dashboard" element={<HostDashboard />} />

          {/* BOOKINGS: both sidebar and existing URLs */}
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/host-bookings" element={<Bookings />} />
          <Route path="/booking/:id" element={<BookingDetail />} />

          {/* HOST COMPLIANCE */}
          <Route path="/host-compliance" element={<HostCompliance />} />

          {/* PROMOTION */}
          <Route
            path="/promote-property"
            element={
              <HostPlaceholder
                title="Promote a Property"
                description="You can select a property and start the £4.99 promotion checkout from the promotion section on your Host Dashboard."
              />
            }
          />

          {/* MESSAGES */}
          <Route
            path="/host-messages"
            element={
              <HostPlaceholder
                title="Host Messages"
                description="This is where your guest conversations and enquiries will be managed."
              />
            }
          />

          <Route
            path="/host-messages/:conversationId"
            element={
              <HostPlaceholder
                title="Guest Conversation"
                description="The individual conversation page still needs to be connected to your messaging system."
              />
            }
          />

          {/* EARNINGS */}
          <Route
            path="/host-earnings"
            element={
              <HostPlaceholder
                title="Host Earnings"
                description="Your dashboard currently shows estimated earnings and commission. A detailed earnings page has not been built yet."
              />
            }
          />

          {/* REVIEWS */}
          <Route
            path="/host-reviews"
            element={
              <HostPlaceholder
                title="Guest Reviews"
                description="Your dashboard displays available guest reviews. A dedicated reviews management page still needs to be built."
              />
            }
          />

          {/* MEMBERSHIP PLANS */}
          <Route
            path="/host-subscriptions"
            element={
              <HostPlaceholder
                title="Plans & Membership"
                description="Your Host Dashboard contains the Host Free, Super Host and Elite Host plans, together with the monthly and yearly pricing options."
              />
            }
          />

          {/* ADVERTS AND SHOP */}
          <Route path="/adverts" element={<Adverts />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopDetail />} />

          {/* HOLIDAY OWNERS */}
          <Route path="/holidayowners" element={<HolidayOwners />} />

          {/* EVENTS */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />

          {/* BUSINESSES AND SERVICES */}
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/services" element={<Services />} />

          {/* BLOG */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          {/* 404: only for genuinely unknown URLs */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: 40 }}>
                <h1>404 — Page not found</h1>
                <p>Sorry, we couldn't find that page.</p>
                <Link to="/">Return home</Link>
              </div>
            }
          />
        </Routes>
      </main>

      <footer
        style={{
          background: "#14532d",
          color: "white",
          padding: 20,
          textAlign: "center",
        }}
      >
        Static Holidays © 2026
      </footer>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "8px 12px",
  borderRadius: 6,
  textDecoration: "none",
};
```
