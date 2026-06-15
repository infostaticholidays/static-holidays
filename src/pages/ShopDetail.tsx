import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ShopDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    const { data, error } = await supabase
      .from("shop")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setProduct(data);
    setLoading(false);
  }

  if (loading) {
    return <h2 style={{ padding: 40 }}>Loading...</h2>;
  }

  if (!product) {
    return <h2 style={{ padding: 40 }}>Product not found</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "30px",
        }}
      >
        <div>
          <img
            src={
              product.image ||
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            }
            alt={product.name}
            style={{
              width: "100%",
              borderRadius: "12px",
            }}
          />
        </div>

        <div>
          <h1>{product.name}</h1>

          <h2 style={{ color: "#16a34a" }}>
            £{product.price}
          </h2>

          <p>{product.description}</p>

          <div style={{ marginTop: "30px" }}>
            <p>Quantity</p>

            <button
              onClick={() =>
                setQuantity(Math.max(1, quantity - 1))
              }
            >
              -
            </button>

            <span
              style={{
                margin: "0 20px",
                fontWeight: "bold",
              }}
            >
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity(quantity + 1)
              }
            >
              +
            </button>
          </div>

          <button
            style={{
              marginTop: "30px",
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "15px 25px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => alert("Added to basket")}
          >
            Add to Basket
          </button>

          <div style={{ marginTop: "30px" }}>
            <p>🚚 Free UK delivery over £50</p>
            <p>📦 Eco-friendly packaging</p>
            <p>🔒 Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
