import { useState } from "react";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const recommended = [
    { title: "Lake District Escape", price: "£110/night" },
    { title: "Cornwall Coastal Stay", price: "£95/night" },
    { title: "Devon Family Park", price: "£85/night" },
  ];

  const summerDeals = [
    { title: "Summer Beach Deal", price: "£79/night" },
    { title: "Half-Term Family Offer", price: "£89/night" },
    { title: "Last Minute Caravan", price: "£69/night" },
  ];

  const bestReviewed = [
    { title: "5★ Luxury Lodge", price: "£150/night" },
    { title: "Top Rated Caravan", price: "£99/night" },
    { title: "Premium Coastal Home", price: "£130/night" },
  ];

  const popular = [
    { title: "Holiday Park Classic", price: "£75/night" },
    { title: "Seaside Retreat", price: "£90/night" },
    { title: "Forest Cabin Stay", price: "£120/night" },
  ];

  const renderSlider = (title: string, items: any[]) => (
    <div style={{ margin: "40px 0" }}>
      <h2 style={{ marginLeft: "40px", color: "#14532d" }}>{title}</h2>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "20px 40px",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              minWidth: "260px",
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                height: "140px",
                background: "#e5e7eb",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />

            <h3>{item.title}</h3>
            <p style={{ color: "#16a34a", fontWeight: "bold" }}>
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>

      {/* HERO SEARCH */}
      <div
        style={{
          padding: "70px 20px",
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

        <div
          style={{
            marginTop: "25px",
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
            style={input}
          />

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={input}
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={input}
          />

          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            style={input}
          >
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4+ Guests</option>
          </select>

          <button style={btn}>Search</button>
        </div>
      </div>

      {/* 4 SLIDERS */}
      {renderSlider("⭐ Recommended Holidays", recommended)}
      {renderSlider("☀️ Summer Holiday Deals", summerDeals)}
      {renderSlider("🏆 Best Reviewed Stays", bestReviewed)}
      {renderSlider("💡 Popular Holiday Parks", popular)}

    </div>
  );
}

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minWidth: "160px",
};

const btn = {
  padding: "12px 18px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
