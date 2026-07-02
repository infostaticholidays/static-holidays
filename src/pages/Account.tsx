import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const [previousTrips, setPreviousTrips] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // -----------------------------
  // LOAD ACCOUNT
  // -----------------------------
  async function loadAccount() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    setUser(user);

    // PROFILE (role check here)
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProfile(profileData);

    // 🔥 HOST REDIRECT (FIXED TO "host")
    const isHost =
      profileData?.role === "host" || profileData?.role === "admin";

    if (isHost) {
      navigate("/host-dashboard", { replace: true });
      return;
    }

    // -----------------------------
    // GUEST DATA ONLY BELOW
    // -----------------------------

    // FAVOURITES
    const { data: favData } = await supabase
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

    setFavourites(favData || []);

    // TRIPS
    const { data: tripsData } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date", { ascending: true });

    if (tripsData) {
      const today = new Date();

      const previous = tripsData.filter(
        (t) => new Date(t.end_date) < today
      );

      const upcoming = tripsData
        .filter((t) => new Date(t.end_date) >= today)
        .sort(
          (a, b) =>
            new Date(a.start_date).getTime() -
            new Date(b.start_date).getTime()
        );

      setPreviousTrips(previous);
      setTrip(upcoming[0] || null);
    }

    // REVIEWS
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    setReviews(reviewData || []);

    setLoading(false);
  }

  useEffect(() => {
    loadAccount();
  }, []);

  // -----------------------------
  // COUNTDOWN
  // -----------------------------
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
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [trip]);

  // -----------------------------
  // NEWSLETTER TOGGLE
  // -----------------------------
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

  // -----------------------------
  // REMOVE FAVOURITE
  // -----------------------------
  async function removeFavourite(id: string) {
    await supabase.from("favourites").delete().eq("id", id);
    setFavourites((prev) => prev.filter((f) => f.id !== id));
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <h1>👤 My Account</h1>

      {/* ACCOUNT */}
      <div style={{ background: "#f5f5f5", padding: 20 }}>
        <h2>Account Information</h2>

        <p>Email: {user?.email}</p>
        <p>Full name: {profile?.full_name || "Not set"}</p>
        <p>Phone: {profile?.phone || "Not set"}</p>

        <p>
          Address: {profile?.address || "Not set"}
          {profile?.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                profile.address
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: 8 }}
            >
              View on map
            </a>
          )}
        </p>

        <label>
          <input
            type="checkbox"
            checked={profile?.newsletter || false}
            onChange={(e) => toggleNewsletter(e.target.checked)}
          />
          Subscribe to newsletter
        </label>
      </div>

      {/* TRIP */}
      <div style={{ background: "#f5f5f5", padding: 20, marginTop: 20 }}>
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

      {/* FAVOURITES */}
      <div style={{ background: "#f5f5f5", padding: 20, marginTop: 20 }}>
        <h2>❤️ My Favourite Properties</h2>

        {favourites.length === 0 ? (
          <p>No favourites yet.</p>
        ) : (
          favourites.map((fav) => {
            const p = fav.properties;

            return (
              <div key={fav.id} style={{ background: "white", padding: 10 }}>
                <img src={p?.images} style={{ width: "100%" }} />
                <h3>{p?.title}</h3>
                <p>{p?.location}</p>

                <Link to={`/property/${p?.id}`}>
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

      {/* REVIEWS */}
      <div style={{ background: "#f5f5f5", padding: 20, marginTop: 20 }}>
        <h2>⭐ My Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} style={{ background: "white", padding: 10 }}>
              <p>{r.rating} ⭐</p>
              <p>{r.review_text}</p>
            </div>
          ))
        )}
      </div>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </button>
    </div>
  );
}
