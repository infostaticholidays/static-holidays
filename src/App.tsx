# Modern Static Holidays Upgrade

Replace your current `src/App.tsx` with this modern version.

```tsx
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";

export default function App() {
  const path = window.location.pathname;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5fff7",
        minHeight: "100vh",
        color: "#1f2937",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#14532d",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "28px", margin: 0 }}>
          Static Holidays
        </h1>

        <nav style={{ display: "flex", gap: "25px" }}>
          <a href="/" style={navLink}>Home</a>
          <a href="/properties" style={navLink}>Properties</a>
          <a href="/adverts" style={navLink}>Adverts</a>
          <a href="/shop" style={navLink}>Shop</a>
        </nav>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={loginBtn}>Login</button>
          <button style={signupBtn}>Sign Up</button>
        </div>
      </header>

      {/* HOMEPAGE */}
      {path === "/" && (
        <>
          {/* HERO */}
          <section
            style={{
              background:
                "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb') center/cover",
              color: "white",
              textAlign: "center",
              padding: "120px 20px",
            }}
          >
            <h2
              style={{
                fontSize: "56px",
                marginBottom: "20px",
              }}
            >
              Find Your Perfect Holiday Stay
            </h2>

            <p
              style={{
                fontSize: "22px",
                maxWidth: "800px",
                margin: "0 auto 40px",
              }}
            >
              Discover luxury caravans, lodges and holiday homes across the UK.
            </p>

            {/* SEARCH BOX */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "18px",
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                flexWrap: "wrap",
                maxWidth: "1100px",
                margin: "0 auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <input
                placeholder="Search destination"
                style={searchInput}
              />

              <input type="date" style={searchInput} />
              <input type="date" style={searchInput} />

              <select style={searchInput}>
                <option>Guests</option>
                <option>1-2 Guests</option>
                <option>3-5 Guests</option>
                <option>6+ Guests</option>
              </select>

              <button style={searchBtn}>Search</button>
            </div>
          </section>

          {/* FEATURED PROPERTIES */}
          <section
            style={{
              padding: "80px 40px",
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "40px", color: "#14532d" }}>
                  Featured Properties
                </h2>
                <p style={{ color: "#4b5563" }}>
                  Hand-picked holiday stays for unforgettable escapes.
                </p>
              </div>

              <a
                href="/properties"
                style={{
                  color: "#16a34a",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                View All →
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "25px",
              }}
            >
              {featuredProperties.map((property) => (
                <div
                  key={property.id}
                  style={{
                    background: "white",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                  }}
                >
                  <img
                    src={property.image}
                    alt={property.title}
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: "24px" }}>
                    <h3 style={{ marginBottom: "10px", color: "#14532d" }}>
                      {property.title}
                    </h3>

                    <p style={{ color: "#6b7280" }}>
                      📍 {property.location}
                    </p>

                    <p
                      style={{
                        color: "#16a34a",
                        fontWeight: "bold",
                        fontSize: "22px",
                        marginTop: "15px",
                      }}
                    >
                      {property.price}
                    </p>

                    <button style={cardBtn}>View Property</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section
            style={{
              background: "#dcfce7",
              padding: "80px 40px",
            }}
          >
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: "40px", color: "#14532d" }}>
                Why Choose Static Holidays?
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "25px",
                  marginTop: "50px",
                }}
              >
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    style={{
                      background: "white",
                      padding: "30px",
                      borderRadius: "18px",
                    }}
                  >
                    <div style={{ fontSize: "42px" }}>{feature.icon}</div>
                    <h3 style={{ color: "#14532d" }}>{feature.title}</h3>
                    <p style={{ color: "#6b7280" }}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}
      {path === "/properties" && <Properties />}

      {/* FOOTER */}
      <footer
        style={{
          background: "#14532d",
          color: "white",
          padding: "50px 40px",
          marginTop: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div>
            <h3>Static Holidays</h3>
            <p>Luxury UK holiday homes and caravan stays.</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p>Properties</p>
            <p>Adverts</p>
            <p>Shop</p>
          </div>

          <div>
            <h4>Support</h4>
            <p>Contact Us</p>
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Static Holidays © 2025
        </p>
      </footer>
    </div>
  );
}

const navLink = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const loginBtn = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const signupBtn = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#22c55e",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const searchInput = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  minWidth: "180px",
};

const searchBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "14px 24px",
  cursor: "pointer",
  fontWeight: "bold",
};

const cardBtn = {
  width: "100%",
  marginTop: "18px",
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const featuredProperties = [
  {
    id: 1,
    title: "Luxury Coastal Caravan",
    location: "Cornwall",
    price: "£120/night",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    id: 2,
    title: "Woodland Lodge Retreat",
    location: "Lake District",
    price: "£160/night",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
  },
  {
    id: 3,
    title: "Family Holiday Park Stay",
    location: "Devon",
    price: "£95/night",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
];

const features = [
  {
    icon: "🏡",
    title: "Luxury Stays",
    text: "Premium caravans and lodges across the UK.",
  },
  {
    icon: "🌊",
    title: "Amazing Locations",
    text: "Coastal escapes, countryside retreats and family parks.",
  },
  {
    icon: "💳",
    title: "Secure Booking",
    text: "Easy and safe booking experience coming soon.",
  },
];
```

Then commit with:

```text
Modern homepage redesign
```

This will make the website look MUCH more professional instantly.
