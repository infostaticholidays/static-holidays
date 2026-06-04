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

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Logged in!");

    window.location.href = "/";
  }

  async function signUp() {
    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created!");
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

      <button
        onClick={signUp}
        style={{ marginLeft: "10px" }}
      >
        Sign Up
      </button>
    </div>
  );
}
