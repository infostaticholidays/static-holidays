import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Account() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();
  }, []);

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
      <h1 style={{ color: "#14532d" }}>
        👤 My Account
      </h1>

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
          <strong>Email:</strong>{" "}
          {user?.email || "Not logged in"}
        </p>

        <p>
          <strong>User ID:</strong>{" "}
          {user?.id || "N/A"}
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
        <h2>Coming Soon</h2>

        <ul>
          <li>🏡 My Properties</li>
          <li>❤️ Favourite Properties</li>
          <li>📍 Saved Destinations</li>
          <li>📅 My Bookings</li>
          <li>💬 Messages</li>
          <li>🛡 Verification Status</li>
          <li>⭐ Guest Trust Score</li>
          <li>📷 Profile Picture</li>
        </ul>
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
