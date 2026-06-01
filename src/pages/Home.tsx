import { useState } from "react";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const featured = [
    {
      title: "Cornwall Beach Caravan",
      price: "£89/night",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      title: "Lake District Lodge",
      price: "£120/night",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
    },
    {
      title: "Devon Family Park",
      price: "£99/night",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
  ];

  return (
    <div>

      {/* HERO SEARCH */}
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
          backgroundSize: "cover",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "42px" }}>
          Find Your Perfect Holiday Stay
        </h1>

        {/* SEARCH BOX */}
        <div
          style={{
            marginTop: "30px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={inputStyle}
          />

          <button style={btnStyle}>Search</button>
        </div>
      </div>

      {/* FEATURED SLIDER */}
      <div style={{ padding: "40px" }}>
        <h2>⭐ Featured Holiday Listings</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          {featured.map((item, i) => (
            <div
              key={i}
              style={{
                minWidth: "300px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={item.image}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <h3>{item.title}</h3>
                <p style={{ color: "green", fontWeight: "bold" }}>
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEALS */}
      <div style={{ padding: "40px" }}>
        <h2>☀️ Summer & Half Term Deals</h2>

        <ul>
          <li>Beach Escape - Cornwall - £89/night</li>
          <li>Family Break - Devon - £120/night</li>
          <li>Luxury Lodge - Lake District - £150/night</li>
        </ul>
      </div>

      {/* RECOMMENDATIONS */}
      <div style={{ padding: "40px" }}>
        <h2>⭐ Recommendations</h2>
        <ul>
          <li>Top Rated Coastal Stays</li>
          <li>Best Family Parks</li>
          <li>Romantic Getaways</li>
        </ul>
      </div>

    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minWidth: "180px",
};

const btnStyle = {
  padding: "12px 20px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
