import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function HostDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // -----------------------------
  // LOAD HOST DATA
  // -----------------------------
  async function loadDashboard() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);
    const { data: conv } = await supabase
  .from("conversations")
  .select("*")
  .eq("host_id", user.id);

setConversations(conv || []);

    const { data: rev } = await supabase
  .from("reviews")
  .select("*")
  .eq("host_id", user.id);

setReviews(rev || []);


    

    // PROFILE (HOST CHECK + VERIFICATION STATUS)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profileData || profileData.role !== "host") {
      navigate("/account");
      return;
    }

    setProfile(profileData);

    // PROPERTIES
    const { data: props } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id);

    setProperties(props || []);

    // BOOKINGS
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .in(
        "property_id",
        (props || []).map((p) => p.id)
      );

    setBookings(bookingsData || []);

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // -----------------------------
  // EARNINGS
  // -----------------------------
 const commissionRate =
  profile?.subscription_plan === "elite"
    ? 0.01
    : profile?.subscription_plan === "super"
    ? 0.05
    : 0.12;

const gross = bookings.reduce(
  (sum, b) => sum + (b.total_price || 0),
  0
);

const commission = gross * commissionRate;
const net = gross - commission;

  <p>Gross Earnings: £{gross}</p>
<p>Commission: £{commission}</p>
<p><b>Net Earnings: £{net}</b></p>
  {/* ---------------- MESSAGES ---------------- */}
<div style={card}>
  <h2>💬 Messages</h2>

  {conversations.length === 0 ? (
    <p>No messages yet</p>
  ) : (
    conversations.map((c) => (
      <div key={c.id} style={item}>
        <p>Booking ID: {c.booking_id}</p>

        <button
          onClick={() => navigate(`/messages/${c.booking_id}`)}
        >
          Open Chat
        </button>
      </div>
    ))
  )}
</div>

  {/* ---------------- REVIEWS ---------------- */}
<div style={card}>
  <h2>⭐ Reviews</h2>

  {reviews.length === 0 ? (
    <p>No reviews yet</p>
  ) : (
    reviews.map((r) => (
      <div key={r.id} style={item}>
        <p>⭐ {r.rating}</p>
        <p>{r.review_text}</p>
      </div>
    ))
  )}
</div>

  // -----------------------------
  // APPROVAL GATE
  // -----------------------------
  const isVerified =
    profile?.id_verified && profile?.insurance_verified;

  // -----------------------------
  // DELETE PROPERTY
  // -----------------------------
  async function deleteProperty(id: string) {
    const ok = window.confirm("Delete property?");
    if (!ok) return;

    await supabase.from("properties").delete().eq("id", id);

    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <h1>🏡 Host Dashboard</h1>

      {/* ---------------- VERIFICATION BANNER ---------------- */}
      {!isVerified && (
        <div style={warningBox}>
          <h3>⚠️ Account Not Verified</h3>
          <p>
            You must upload ID + Insurance before listing properties.
          </p>

          <button
            style={btn}
            onClick={() => navigate("/host-verification")}
          >
            Upload Documents
          </button>
        </div>
      )}

      {/* ---------------- PLAN + ACCOUNT ---------------- */}
      <div style={card}>
        <h2>💳 Account</h2>

        <p>
          <strong>Plan:</strong>{" "}
          {profile?.subscription_plan || "Free"}
        </p>

        <p>
          <strong>Newsletter:</strong>{" "}
          {profile?.newsletter ? "Subscribed" : "Not subscribed"}
        </p>

        <p>
          <strong>ID Verified:</strong>{" "}
          {profile?.id_verified ? "Yes" : "No"}
        </p>

        <p>
          <strong>Insurance Verified:</strong>{" "}
          {profile?.insurance_verified ? "Yes" : "No"}
        </p>
      </div>

      {/* ---------------- EARNINGS ---------------- */}
      <div style={card}>
        <h2>💰 Earnings</h2>

        <p>Total Earned: £{totalEarned}</p>
        <p>Potential Monthly: £{potentialMonthly}</p>
      </div>

      {/* ---------------- PROPERTIES ---------------- */}
      <div style={card}>
        <h2>🏡 Properties</h2>

        {/* BLOCK ADD PROPERTY IF NOT VERIFIED */}
        <button
          style={{
            ...btn,
            opacity: isVerified ? 1 : 0.5,
            cursor: isVerified ? "pointer" : "not-allowed",
          }}
          disabled={!isVerified}
          onClick={() => navigate("/add-property")}
        >
          ➕ Add Property
        </button>

        {properties.length === 0 ? (
          <p style={{ marginTop: 10 }}>No properties yet</p>
        ) : (
          properties.map((p) => (
            <div key={p.id} style={item}>
              <h3>{p.title}</h3>
              <p>{p.location}</p>
              <p>£{p.price_per_night}/night</p>

              <button onClick={() => navigate(`/calendar/${p.id}`)}>
                📅 Calendar
              </button>

              <button onClick={() => deleteProperty(p.id)}>
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* ---------------- BOOKINGS ---------------- */}
      <div style={card}>
        <h2>📅 Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} style={item}>
              <p>{b.start_date} → {b.end_date}</p>
              <p>£{b.total_price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
  <button onClick={() => navigate(`/calendar/${b.property_id}`)}>
  Calendar
</button>

<button onClick={() => navigate(`/messages/${b.id}`)}>
  Message Guest
</button>

// ---------------- STYLES ----------------
const card = {
  background: "#f5f5f5",
  padding: 20,
  marginBottom: 20,
  borderRadius: 10,
};

const item = {
  background: "white",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
};

const btn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const warningBox = {
  background: "#fff3cd",
  padding: 15,
  borderRadius: 10,
  marginBottom: 20,
  border: "1px solid #ffeeba",
};
