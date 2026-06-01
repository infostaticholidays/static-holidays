import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";
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
    <a href="/holidayowners" style={navLink}>Holiday Owners</a>
    <a href="/adverts" style={navLink}>Adverts</a>
    <a href="/shop" style={navLink}>Shop</a>
  </nav>

  <div style={{ display: "flex", gap: "12px" }}>
    <button style={loginBtn}>Login</button>
    <button style={signupBtn}>Sign Up</button>
  </div>
</header>
          Static Holidays
        </h1>
<nav style={{ display: "flex", gap: "25px" }}>
  <a href="/" style={navLink}>Home</a>
  <a href="/properties" style={navLink}>Properties</a>
  <a href="/holidayowners" style={navLink}>Holiday Owners</a>
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

          {/* SUMMER HOLIDAY DEALS */}
          <section
            style={{
              padding: "70px 40px",
              background: "#fef9c3",
            }}
          >
            <div
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
              }}
            >
              <h2
                style={{
                  fontSize: "40px",
                  color: "#14532d",
                  marginBottom: "15px",
                }}
              >
                Summer Holiday Deals ☀️
              </h2>

              <p
                style={{
                  color: "#4b5563",
                  marginBottom: "40px",
                  fontSize: "18px",
                }}
              >
                Discover amazing summer offers across the UK.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "25px",
                }}
              >
                <div
                  style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "18px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3 style={{ color: "#14532d" }}>
                    Beach Escapes
                  </h3>

                  <p style={{ color: "#6b7280" }}>
                    Save up to 30% on coastal stays.
                  </p>

                  <button style={cardBtn}>
                    View Deals
                  </button>
                </div>

                <div
                  style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "18px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3 style={{ color: "#14532d" }}>
                    Family Packages
                  </h3>

                  <p style={{ color: "#6b7280" }}>
                    Kids stay free at selected parks.
                  </p>

                  <button style={cardBtn}>
                    Explore
                  </button>
                </div>

                <div
                  style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "18px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3 style={{ color: "#14532d" }}>
                    Last Minute Deals
                  </h3>

                  <p style={{ color: "#6b7280" }}>
                    Weekend getaways from £79/night.
                  </p>

                  <button style={cardBtn}>
                    Book Now
                  </button>
                </div>
              </div>
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

                    <button style={cardBtn}>
                      View Property
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

     {path === "/properties" && <Properties />}
{path === "/holidayowners" && <HolidayOwners />}
{path === "/adverts" && <Adverts />}
{path === "/shop" && <Shop />}

      {/* FOOTER */}
      <footer
        style={{
          background: "#14532d",
          color: "white",
          padding: "50px 40px",
          marginTop: "50px",
          textAlign: "center",
        }}
      >
        Static Holidays © 2025
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
