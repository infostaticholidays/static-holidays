import { useParams, Link } from "react-router-dom";

export default function ShopDetail() {
  const { id } = useParams();

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <Link
        to="/shop"
        style={{
          textDecoration: "none",
          color: "#14532d",
          fontWeight: "bold",
        }}
      >
        ← Back to Shop
      </Link>

      <h1 style={{ marginTop: "30px" }}>
        Shop Product #{id}
      </h1>

      <img
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
        alt="Product"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      />

      <h2 style={{ color: "#16a34a" }}>
        £29.99
      </h2>

      <p>
        Product description coming soon...
      </p>

      <button
        style={{
          marginTop: "20px",
          background: "#14532d",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Add to Basket
      </button>
    </div>
  );
}
