export default function Adverts() {
  const adverts = [
    {
      id: 1,
      title: "Summer Caravan Sale",
      location: "Cornwall",
      price: "From £299",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      id: 2,
      title: "Luxury Lodge Weekend",
      location: "Lake District",
      price: "From £399",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
    },
    {
      id: 3,
      title: "Family Holiday Escape",
      location: "Devon",
      price: "From £249",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
  ];

  return (
    <div
      style={{
        padding: "80px 40px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          color: "#14532d",
          marginBottom: "15px",
        }}
      >
        Holiday Adverts
      </h1>

      <p
        style={{
          color: "#4b5563",
          marginBottom: "40px",
        }}
      >
        Discover the latest holiday park deals and special offers.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "25px",
        }}
      >
        {adverts.map((advert) => (
          <div
            key={advert.id}
            style={{
              background: "white",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={advert.image}
              alt={advert.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "24px" }}>
              <h2 style={{ color: "#14532d" }}>
                {advert.title}
              </h2>

              <p style={{ color: "#6b7280" }}>
                📍 {advert.location}
              </p>

              <p
                style={{
                  color: "#16a34a",
                  fontWeight: "bold",
                  fontSize: "24px",
                  marginTop: "10px",
                }}
              >
                {advert.price}
              </p>

              <button
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "14px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                View Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
