import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function HostLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ MUST be async
  async function handleLogin() {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Logged in!");

    window.location.href = "/host-dashboard";
  }

  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      <h1>Holiday Owner Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
