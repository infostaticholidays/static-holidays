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
  // LOAD DASHBOARD
  // -----------------------------
  async function loadDashboard() {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);

    // PROFILE
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

    // MESSAGES
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("host_id", user.id);

    setConversations(conv || []);

    // REVIEWS
    const { data: rev } = await supabase
      .from("reviews")
      .select("*")
      .eq("host_id", user.id);

    setReviews(rev || []);

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

  const totalEarned = net;

  const potentialMonthly = properties.reduce(
    (sum, p) => sum + (p.price_per_night || 0) * 30,
    0
  );

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

 
const isVerified =
  profile?.id_verified && profile?.insurance_verified;

return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
  <h1>
  🏡 {profile?.full_name
    ? `${profile.full_name}'s Dashboard`
    : "Host Dashboard"}
</h1>

<p style={{ fontSize: "18px", marginBottom: "30px" }}>
  Welcome back{" "}
  <strong>
    {profile?.full_name?.split(" ")[0] || "Host"}
  </strong>{" "}
  👋
</p>

      {/* ---------------- VERIFICATION ---------------- */}
      {!isVerified && (
        <div style={warningBox}>
          <h3>⚠️ Account Not Verified</h3>
          <p>Upload ID + Insurance before listing properties.</p>
          <button style={btn} onClick={() => navigate("/host-compliance")}>
  Upload Documents
</button>
        </div>
      )}

      {/* ---------------- ACCOUNT ---------------- */}
      <div style={card}>
  <h2>💳 Account</h2>

  <p>
    <strong>Plan:</strong>{" "}
    {profile?.subscription_plan === "elite"
      ? "👑 Elite Host"
      : profile?.subscription_plan === "super"
      ? "⭐ Super Host"
      : "🟢 Host (Free)"}
  </p>

  <label style={{ display: "block", marginTop: 15 }}>
    <input
      type="checkbox"
      checked={profile?.newsletter || false}
      onChange={async (e) => {
        const checked = e.target.checked;

        await supabase
          .from("profiles")
          .update({ newsletter: checked })
          .eq("id", user.id);

        setProfile({
          ...profile,
          newsletter: checked,
        });
      }}
    />

    {" "}Receive our newsletter
  </label>

  {profile?.subscription_plan === "super" ||
  profile?.subscription_plan === "elite" ? (
    <label style={{ display: "block", marginTop: 15 }}>
      <input
        type="checkbox"
        checked={profile?.featured_marketing || false}
        onChange={async (e) => {
          const checked = e.target.checked;

          await supabase
            .from("profiles")
            .update({
              featured_marketing: checked,
            })
            .eq("id", user.id);

          setProfile({
            ...profile,
            featured_marketing: checked,
          });
        }}
      />

      {" "}I'd like my property to be considered for newsletters and social media promotion.
    </label>
  ) : (
    <div
      style={{
        marginTop: 15,
        padding: 15,
        background: "#fff8dc",
        borderRadius: 8,
      }}
    >
      ⭐ Upgrade to Super Host or Elite Host to be eligible for newsletter and social media promotion.
    </div>
  )}

  <p style={{ marginTop: 15 }}>
    <strong>ID Verified:</strong>{" "}
    {profile?.id_verified ? "✅ Yes" : "❌ No"}
  </p>

  <p>
    <strong>Insurance Verified:</strong>{" "}
    {profile?.insurance_verified ? "✅ Yes" : "❌ No"}
  </p>

  <button
    style={{ ...btn, width: "100%", marginTop: 15 }}
    onClick={() => navigate("/host-compliance")}
  >
    📋 Compliance Centre
  </button>
</div>
      {/* ---------------- EARNINGS ---------------- */}
      <div style={card}>
        <h2>💰 Earnings</h2>
        <p>Gross: £{gross}</p>
        <p>Commission: £{commission}</p>
        <p>
          <b>Net: £{net}</b>
        </p>
        <p>Potential Monthly: £{potentialMonthly}</p>
      </div>

      {/* ---------------- MESSAGES ---------------- */}
      <div style={card}>
        <h2>💬 Messages</h2>

        {conversations.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          conversations.map((c) => (
            <div key={c.id} style={item}>
              <p>Booking: {c.booking_id}</p>
              <button onClick={() => navigate(`/messages/${c.booking_id}`)}>
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

      {/* ---------------- PROPERTIES ---------------- */}
      <div style={card}>
        <h2>🏡 Properties</h2>

        <button
          style={{ ...btn, opacity: isVerified ? 1 : 0.5 }}
          disabled={!isVerified}
          onClick={() => navigate("/add-property")}
        >
          ➕ Add Property
        </button>

        {properties.map((p) => (
          <div key={p.id} style={item}>
            <h3>{p.title}</h3>
            <p>{p.location}</p>
            <p>£{p.price_per_night}/night</p>

            <button onClick={() => navigate(`/calendar/${p.id}`)}>
              📅 Calendar
            </button>

            <button onClick={() => deleteProperty(p.id)}>🗑 Delete</button>
          </div>
        ))}
      </div>

      {/* ---------------- BOOKINGS ---------------- */}
      <div style={card}>
        <h2>📅 Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} style={item}>
              <p>
                {b.start_date} → {b.end_date}
              </p>
              <p>£{b.total_price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
