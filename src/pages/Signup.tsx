import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const navigate = useNavigate();

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          email: email,
          role: role,
        },
      ]);
    }

    alert("Account created!");
    navigate("/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Sign Up</h1>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      {/* ROLE SELECT */}
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="guest">Guest</option>
        <option value="host">Holiday Owner</option>
      </select>

      <br /><br />

      <button onClick={handleSignup}>
        Create Account
      </button>
    </div>
  );
}
