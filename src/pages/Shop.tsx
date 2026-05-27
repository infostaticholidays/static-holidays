export default function Shop() {
  const products = [
    {
      id: 1,
      name: "Holiday Welcome Pack",
      price: "£24.99",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      id: 2,
      name: "Luxury Caravan Essentials",
      price: "£39.99",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
      id: 3,
      name: "Family Holiday Bundle",
      price: "£59.99",
      image:
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
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
          marginBottom: "40px",
        }}
      >
        Holiday Shop
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "20px" }}>
              <h2 style={{ color: "#166534" }}>
                {product.name}
              </h2>

              <p
                style={{
                  fontWeight: "bold",
                  color: "#16a34a",
                }}
              >
                {product.price}
              </p>

              <button
                style={{
                  marginTop: "15px",
                  padding: "12px 20px",
                  backgroundColor: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
