import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function PropertyDetail() {
  const { id } = useParams();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, []);

  async function fetchProperty() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProperty(data);
    setLoading(false);
  }

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  if (!property) {
    return <h2 style={{ padding: "40px" }}>Property not found</h2>;
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <img
        src={
          property.images ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        }
        alt={property.title}
        style={{
          width: "100%",
          height: "450px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      <h1 style={{ marginTop: "20px" }}>
        {property.title}
      </h1>

      <p>
        📍 {property.location}
      </p>

      <h2
        style={{
          color: "#16a34a",
        }}
      >
        £{property.price_per_night}/night
      </h2>

      <p style={{ marginTop: "20px" }}>
        {property.description}
      </p>
    </div>
  );
}
