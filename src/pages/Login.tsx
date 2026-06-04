import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) return;

    // get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      alert("Profile not found");
      return;
    }

    if (profile.role === "owner") {
      navigate("/host-dashboard");
    } else {
      navigate("/guest-dashboard");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={signIn}>Login</button>
    </div>
  );
}
