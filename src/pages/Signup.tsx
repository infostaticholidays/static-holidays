import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("No user returned");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email: email.trim(),
        full_name: fullName.trim(),
        role: role,
      },
    ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Account created!");
    window.location.href = "/login";
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Sign Up</h1>

      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <br /><br />

      <input
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

      <label>
        <input
          type="radio"
          value="guest"
          checked={role === "guest"}
          onChange={(e) => setRole(e.target.value)}
        />
        Guest
      </label>

      <label style={{ marginLeft: 20 }}>
        <input
          type="radio"
          value="owner"
          checked={role === "owner"}
          onChange={(e) => setRole(e.target.value)}
        />
        Holiday Owner
      </label>

      <br /><br />

      <button onClick={handleSignup}>Create Account</button>
    </div>
  );
}
