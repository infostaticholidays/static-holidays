export default function Adverts() {
  const adverts = [
    {
      id: 1,
      businessName: "Seaside Cafe",
      category: "Cafe",
      description: "Relaxing seaside cafe with fresh breakfasts and coffee.",
      location: "Cornwall",
      phone: "01234 567890",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      id: 2,
      businessName: "Holiday Park Activities",
      category: "Activity",
      description: "Family fun activities and entertainment.",
      location: "Devon",
      phone: "09876 543210",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
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
      <h1
        style={{
          textAlign: "center",
          color: "#166534",
          marginBottom: "10px",
        }}
      >
        Local Directory
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#14532d",
        }}
      >
        Support local businesses near your stay.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {adverts.map((advert) => (
          <div
            key={advert.id}
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={advert.image}
              alt={advert.businessName}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "20px" }}>
              <h2 style={{ color: "#166534" }}>
                {advert.businessName}
              </h2>

              <p>
                <strong>Category:</strong> {advert.category}
              </p>

              <p>{advert.description}</p>

              <p>
                <strong>Location:</strong> {advert.location}
              </p>

              <p>
                <strong>Phone:</strong> {advert.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
