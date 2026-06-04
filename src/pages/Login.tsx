import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    alert("Logged in");
  }

  async function signUp() {
    await supabase.auth.signUp({
      email,
      password,
    });
    alert("Account created");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <br />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={signIn}>Login</button>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}
