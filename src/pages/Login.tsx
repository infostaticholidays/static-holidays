import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    console.log(profile);

    if (profileError || !profile) {
      alert("Profile not found");
      return;
    }

    if (profile.role === "owner") {
      window.location.href = "/host-dashboard";
    } else {
      window.location.href = "/guest-dashboard";
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={signIn}>
        Login
      </button>
    </div>
  );
}
