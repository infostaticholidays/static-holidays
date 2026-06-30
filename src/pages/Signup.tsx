import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [trip, setTrip] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  useEffect(() => {
    loadUser();
  }, []);

  // ---------------- LOAD USER ----------------
  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    // FAVOURITES
    const { data: favData } = await supabase
      .from("favourites")
      .select(
        `
        id,
        properties (
          id,
          title,
          location,
          images,
          price_per_night
        )
      `
      )
      .eq("user_id", user.id);

    setFavourites(favData || []);

    // TRIP
    const { data: tripData } = await supabase
      .from("trips")
      .select("destination, start_date, end_date")
      .eq("user_id", user.id)
      .maybeSingle();

    setTrip(tripData || null);

    // REVIEWS
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    setReviews(reviewData || []);

    setLoading(false);
  }

  // ---------------- NEWSLETTER TOGGLE ----------------
  async function toggleNewsletter(value: boolean) {
    if (!user) return;

    setProfile((prev: any) => ({
      ...prev,
      newsletter: value,
    }));

    await supabase
      .from("profiles")
      .update({ newsletter: value })
      .eq("id", user.id);
  }

  // ---------------- REMOVE FAVOURITE ----------------
  async function removeFavourite(id: string) {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setFavourites((prev) => prev.filter((f) => f.id !== id));
  }

  // ---------------- LOGOUT ----------------
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // ---------------- COUNTDOWN ----------------
  useEffect(() => {
    if (!trip?.start_date) return;

    const start = new Date(trip.start_date).getTime();

    const timer = setInterval(() => {
      const diff = start - Date.now();

      if (diff <= 0) {
        setTimeLeft("🎉 Your holiday has started!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [trip]);

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <h1>👤 My Account</h1>

      {/* ---------------- ACCOUNT ---------------- */}
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 10 }}>
        <h2>Account Information</h2>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>User ID:</strong> {user?.id}
        </p>

        {/* ADDRESS + GOOGLE MAPS */}
        <p>
          <strong>Address:</strong>{" "}
          {profile?.address ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                profile.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.address}
            </a>
          ) : (
            "No address set"
          )}
        </p>

        {/* NEWSLETTER */}
        <label>
          <input
            type="checkbox"
            checked={profile?.newsletter || false}
            onChange={(e) => toggleNewsletter(e.target.checked)}
          />
          Subscribe to newsletter
        </label>
      </div>

      {/* ---------------- TRIP ---------------- */}
      <div style={{ marginTop: 20, background: "#f5f5f5", padding: 20 }}>
        <h2>🏖️ My Next Trip</h2>

        {!trip ? (
          <p>No trip booked yet.</p>
        ) : (
          <>
            <p>
              <strong>Destination:</strong> {trip.destination}
            </p>
            <p>
              <strong>Countdown:</strong> {timeLeft}
            </p>
          </>
        )}
      </div>

      {/* ---------------- FAVOURITES ---------------- */}
      <div style={{ marginTop: 20, background: "#f5f5f5", padding: 20 }}>
        <h2>❤️ My Favourites</h2>

        {loading ? (
          <p>Loading...</p>
        ) : favourites.length === 0 ? (
          <p>No favourites yet.</p>
        ) : (
          favourites.map((fav) => {
            const property = fav.properties;

            return (
              <div
                key={fav.id}
                style={{
                  background: "white",
                  padding: 15,
                  marginTop: 10,
                  borderRadius: 10,
                }}
              >
                <img
                  src={
                    property?.images ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  }
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                <h3>{property?.title}</h3>
                <p>📍 {property?.location}</p>
                <p>£{property?.price_per_night}/night</p>

                <Link to={`/property/${property?.id}`}>
                  <button>View</button>
                </Link>

                <button onClick={() => removeFavourite(fav.id)}>
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ---------------- REVIEWS ---------------- */}
      <div style={{ marginTop: 20, background: "#f5f5f5", padding: 20 }}>
        <h2>⭐ My Reviews</h2>

        {reviews.length > 0 && (
          <p>
            Average: ⭐ {averageRating} ({reviews.length})
          </p>
        )}

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: "white",
                padding: 15,
                marginTop: 10,
                borderRadius: 10,
              }}
            >
              <h3>⭐ {review.rating}</h3>
              <p>{review.review_text}</p>
            </div>
          ))
        )}
      </div>

      {/* ---------------- LOGOUT ---------------- */}
      <div style={{ marginTop: 30 }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
