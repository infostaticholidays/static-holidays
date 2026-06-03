import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function Properties() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  function toggleFavorite(id: number) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((x) => x !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading properties:", error);
      return;
    }

    setProperties(data || []);
  }

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
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
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
                  ⭐ Featured
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
                £{property.price_per_night}/night
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

              <button
                onClick={() => toggleFavorite(property.id)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  backgroundColor: favorites.includes(property.id)
                    ? "#dc2626"
                    : "#111827",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {favorites.includes(property.id)
                  ? "❤️ Remove Favorite"
                  : "🤍 Add Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
