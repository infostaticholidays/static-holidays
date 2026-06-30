import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD USER ON PAGE LOAD
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: auth } = await supabase.auth.getUser();
    const currentUser = auth?.user;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    setUser(currentUser);

    // PROFILE
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    setProfile(profileData);

    // FAVOURITES
    const { data: favData } = await supabase
      .from("favourites")
      .select("*")
      .eq("user_id", currentUser.id);

    setFavourites(favData || []);

    setLoading(false);
  }

  // ✅ NEWSLETTER TOGGLE (ONLY ONCE)
  async function toggleNewsletter(value: boolean) {
    if (!user) return;

    setProfile((prev: any) => ({
      ...prev,
      newsletter: value,
    }));

    const { error } = await supabase
      .from("profiles")
      .update({ newsletter: value })
      .eq("id", user.id);

    if (error) alert(error.message);
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <h1>👤 My Account</h1>

      {/* ACCOUNT INFO */}
      <div style={{ background: "#f5f5f5", padding: 20 }}>
        <h2>Account Information</h2>
        <p>Email: {user?.email}</p>

        <label>
          <input
            type="checkbox"
            checked={profile?.newsletter || false}
            onChange={(e) => toggleNewsletter(e.target.checked)}
          />
          Subscribe to newsletter
        </label>
      </div>

      {/* FAVOURITES */}
      <div style={{ marginTop: 20 }}>
        <h2>❤️ Favourites</h2>

        {loading ? (
          <p>Loading...</p>
        ) : favourites.length === 0 ? (
          <p>No favourites yet</p>
        ) : (
          favourites.map((fav) => (
            <div key={fav.id} style={{ background: "#fff", margin: 10, padding: 10 }}>
              <p>{fav.title || "Property"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
