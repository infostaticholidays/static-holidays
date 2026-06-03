import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function GuestDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Guest Dashboard 🏖️</h1>

      {profile && (
        <>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </>
      )}

      <hr />

      <h3>✨ Features you will add next:</h3>
      <ul>
        <li>Favourite properties ❤️</li>
        <li>Saved destinations 📍</li>
        <li>Nearby events 🎉</li>
        <li>Holiday countdown ⏳</li>
      </ul>
    </div>
  );
}
