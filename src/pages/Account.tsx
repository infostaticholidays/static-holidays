import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [trip, setTrip] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

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
    const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

    // ❤️ FAVOURITES
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

    if (error) console.error(error);
    else setFavourites(data || []);

    // 🏖️ TRIP
    const { data: tripData, error: tripError } = await supabase
      .from("trips")
      .select("destination, start_date, end_date")
      .eq("user_id", user.id)
      .maybeSingle();

    console.log("tripData:", tripData);
    console.log("tripError:", tripError);

   if (!tripError) {
  setTrip(tripData || null);
}

// ⭐ Load reviews
const { data: reviewData, error: reviewError } = await supabase
  .from("reviews")
  .select("*")
  .eq("reviewed_user_id", user.id)
  .order("created_at", { ascending: false });

if (reviewError) {
  console.error(reviewError);
} else {
  setReviews(reviewData || []);
}

setLoading(false);
}


  // ⏳ COUNTDOWN (FIXED - SINGLE useEffect ONLY)
  useEffect(() => {
    if (!trip?.start_date) {
      setTimeLeft("");
      return;
    }

    const holidayStart = new Date(trip.start_date).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = holidayStart - now;

      if (diff <= 0) {
        setTimeLeft("🎉 Your holiday has started!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [trip]);

  async function removeFavourite(id: string) {
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

      {/* ACCOUNT */}
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 10 }}>
        <h2>Account Information</h2>
        <p><strong>Email:</strong> {user?.email || "Not logged in"}</p>
        <p><strong>User ID:</strong> {user?.id || "N/A"}</p>
      </div>

      {/* TRIP */}
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 10, marginTop: 20 }}>
        <h2>🏖️ My Next Trip</h2>

        {!trip ? (
          <p>No trip booked yet.</p>
        ) : (
          <>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Countdown:</strong> {timeLeft}</p>
          </>
        )}
      </div>

      {/* FAVOURITES */}
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 10, marginTop: 20 }}>
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
                  padding: 15,
                  marginTop: 15,
                  borderRadius: 10,
                }}
              >
                <img
                  src={
                    property?.images ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  }
                  style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
                />

                <h3>{property?.title}</h3>
                <p>📍 {property?.location}</p>
                <p>£{property?.price_per_night}/night</p>

                <Link to={`/property/${property?.id}`}>
                  <button style={{ marginRight: 10 }}>View Property</button>
                </Link>

                <button onClick={() => removeFavourite(fav.id)}>
                  Remove Favourite
                </button>
              </div>
            );
          })
        )}
      </div>
      {/* REVIEWS */}
<div
  style={{
    background: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  }}
>
  <h2>⭐ My Reviews</h2>

  {reviews.length === 0 ? (
    <p>You don't have any reviews yet.</p>
  ) : (
    reviews.map((review) => (
      <div
        key={review.id}
        style={{
          background: "white",
          padding: 15,
          borderRadius: 10,
          marginTop: 15,
        }}
      >
        <h3>{review.rating} ⭐</h3>

        <p>{review.review_text}</p>

        <small>
          {new Date(review.created_at).toLocaleDateString("en-GB")}
        </small>
      </div>
    ))
  )}
</div>

      {/* LOGOUT */}
      <div style={{ marginTop: 30 }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
