import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";

export default function App() {
  const path = window.location.pathname;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

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
      </header>

      {/* HOME PAGE */}
      {path === "/" && (
        <>
          {/* HERO */}
          <section style={heroStyle}>
            <h2 style={{ fontSize: "56px" }}>
              Find Your Perfect Holiday Stay
            </h2>

            <p style={{ fontSize: "22px" }}>
              Discover caravans, lodges and holiday homes across the UK.
            </p>

            <div style={searchBox}>
              <input placeholder="Search destination" style={searchInput} />
              <input type="date" style={searchInput} />
              <input type="date" style={searchInput} />
              <select style={searchInput}>
                <option>Guests</option>
                <option>1-2</option>
                <option>3-5</option>
                <option>6+</option>
              </select>
              <button style={searchBtn}>Search</button>
            </div>
          </section>

          {/* FEATURED PROPERTIES */}
          <section style={{ padding: "60px 40px" }}>
            <h2 style={{ fontSize: "40px", color: "#14532d" }}>
              Featured Properties
            </h2>

            <div style={grid}>
              {featuredProperties.map((p) => (
                <div key={p.id} style={card}>
                  <img src={p.image} style={img} />
                  <div style={{ padding: "20px" }}>
                    <h3>{p.title}</h3>
                    <p>📍 {p.location}</p>
                    <p style={{ color: "#16a34a", fontWeight: "bold" }}>
                      {p.price}
                    </p>
                    <button style={cardBtn}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ROUTES */}
      {path === "/properties" && <Properties />}
      {path === "/holidayowners" && <HolidayOwners />}
      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}

      {/* FOOTER */}
      <footer style={footer}>
        Static Holidays © 2025
      </footer>
    </div>
  );
}

/* ================= STYLES ================= */

const navLink = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const heroStyle = {
  background:
    "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb') center/cover",
  color: "white",
  textAlign: "center",
  padding: "120px 20px",
};

const searchBox = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: "30px",
};

const searchInput = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const searchBtn = {
  background: "#16a34a",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const card = {
  background: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const img = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
};

const cardBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  width: "100%",
  marginTop: "10px",
  cursor: "pointer",
};

const footer = {
  background: "#14532d",
  color: "white",
  textAlign: "center",
  padding: "40px",
  marginTop: "40px",
};

const featuredProperties = [
  {
    id: 1,
    title: "Luxury Caravan",
    location: "Cornwall",
    price: "£120/night",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    id: 2,
    title: "Lodge Retreat",
    location: "Lake District",
    price: "£160/night",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156",
  },
];
