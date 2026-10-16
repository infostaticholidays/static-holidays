
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  title: string | null;
  location: string | null;
  price_per_night?: number | null;
  nightly_price?: number | null;
  images?: string | null;
  cover_image_url?: string | null;
};

export default function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMyProperties() {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Please log in to view your properties.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id);

      if (error) {
        console.error("Could not load your properties:", error);
        setMessage("We couldn't load your properties. Please try again.");
      } else {
        setProperties((data || []) as Property[]);
      }

      setLoading(false);
    }

    fetchMyProperties();
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      padding: "32px 24px",
      background: "#f8faf8",
      color: "#153e2a",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Link to="/host-dashboard">← Back to dashboard</Link>

        <h1>My Properties</h1>
        <p>Manage the holiday properties you own.</p>

        {loading ? (
          <p>Loading your properties...</p>
        ) : message ? (
          <p>{message}</p>
        ) : properties.length === 0 ? (
          <p>You haven't added any properties yet.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}>
            {properties.map((property) => {
              const image =
                property.cover_image_url ||
                property.images?.split(",")[0]?.trim();

              const price =
                property.price_per_night ?? property.nightly_price;

              return (
                <article key={property.id} style={{
                  background: "#fff",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid #e1e9e2",
                  paddingBottom: "18px",
                }}>
                  {image && (
                    <img
                      src={image}
                      alt={property.title || "My holiday property"}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div style={{ padding: "18px" }}>
                    <h2>{property.title || "Untitled property"}</h2>
                    <p>{property.location || "Location not set"}</p>
                    <p>
                      {price != null ? `£${price} per night` : "Price not set"}
                    </p>
                    <Link to={`/property/${property.id}`}>
                      View property
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
