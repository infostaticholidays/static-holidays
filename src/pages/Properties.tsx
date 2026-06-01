import { useState } from "react";
export default function Properties() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const properties = [
    {
      id: 1,
      title: "Luxury Coastal Caravan",
      location: "Cornwall",
      price: "£120/night",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      featured: true,
    },
    {
      id: 2,
      title: "Woodland Lodge Retreat",
      location: "Lake District",
      price: "£160/night",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
      featured: false,
    },
    {
      id: 3,
      title: "Family Holiday Park Stay",
      location: "Devon",
      price: "£95/night",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      featured: true,
    },
  ];

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f6fff8",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: "#166534",
            fontSize: "42px",
          }}
        >
          Holiday Properties
        </h1>

        <p
          style={{
            color: "#14532d",
            fontSize: "18px",
          }}
        >
          Browse premium holiday homes, caravans and lodges across the UK.
        </p>
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search location..."
          style={{
            padding: "12px",
            width: "220px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <select
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option>Any Property Type</option>
          <option>Caravan</option>
          <option>Lodge</option>
          <option>Holiday Park</option>
        </select>

        <select
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option>Any Budget</option>
          <option>Under £100</option>
          <option>£100 - £200</option>
          <option>Luxury</option>
        </select>

        <button
          style={{
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* PROPERTY GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "25px",
        }}
      >
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              background: "white",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={property.image}
                alt={property.title}
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                }}
              />

              {property.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "#16a34a",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                >
                  Featured
                </div>
              )}
            </div>

            <div style={{ padding: "20px" }}>
              <h2 style={{ color: "#166534" }}>
                {property.title}
              </h2>

              <p style={{ color: "#555" }}>
                📍 {property.location}
              </p>

              <p
                style={{
                  fontWeight: "bold",
                  color: "#16a34a",
                  marginTop: "10px",
                  fontSize: "18px",
                }}
              >
                {property.price}
              </p>

              <button
                style={{
                  marginTop: "15px",
                  width: "100%",
                  backgroundColor: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                View Property
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
