import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Account() {
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("favourites")
      .select(`
        id,
        properties (
          id,
          title,
          location,
          images,
          price_per_night
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
    } else {
      setFavourites(data || []);
    }

    setLoading(false);
  }

  async function removeFavourite(id) {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setFavourites((prev) => prev.filter((fav) => fav.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#14532d" }}>👤 My Account</h1>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h2>Account Information</h2>

        <p>
          <strong>Email:</strong> {user?.email || "Not logged in"}
        </p>

        <p>
          <strong>User ID:</strong> {user?.id || "N/A"}
        </p>
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h2>❤️ My Favourite Properties</h2>

        {loading ? (
          <p>Loading...</p>
        ) : favourites.length === 0 ? (
          <p>No favourite properties yet.</p>
        ) : (
          favourites.map((fav) => {
            const property = fav.properties;

            return (
              <div
                key={fav.id}
                style={{
                  background: "white",
                  borderRadius: "10px",
                  padding: "15px",
                  marginTop: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={
                    property?.images ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  }
                  alt={property?.title}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                <h3 style={{ marginTop: "15px" }}>
                  {property?.title}
                </h3>

                <p>📍 {property?.location}</p>

                <p style={{ color: "#16a34a", fontWeight: "bold" }}>
                  £{property?.price_per_night}/night
                </p>

                <Link to={`/property/${property?.id}`}>
                  <button
                    style={{
                      background: "#14532d",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    View Property
                  </button>
                </Link>

                <button
                  onClick={() => removeFavourite(fav.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Remove Favourite
                </button>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
