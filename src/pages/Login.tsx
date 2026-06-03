import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const { data } = await supabase.auth.signInWithPassword({
  email,
  password,
});

const user = data.user;

const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (profile.role === "guest") {
  navigate("/guest-dashboard");
} else {
  navigate("/host-dashboard");
}
  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
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
    navigate("/");
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

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={signIn}>Login</button>

      <br /><br />

      <button onClick={() => navigate("/signup")}>
        Sign Up
      </button>
    </div>
  );
}
