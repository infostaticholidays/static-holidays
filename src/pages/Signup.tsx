import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSignup() {
    // 1. Create auth user
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
      alert("User was not created");
      return;
    }

    console.log("AUTH USER:", user);

    // 2. Create profile row
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          email: email.trim(),
          full_name: fullName.trim(),
          role: role,
        },
      ]);

    if (profileError) {
      console.log("PROFILE ERROR:", profileError);
      alert(profileError.message);
      return;
    }

    alert("Account created successfully!");

    // 3. Send user to login
    navigate("/login");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <br /><br />

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

      <label>
        <input
          type="radio"
          value="guest"
          checked={role === "guest"}
          onChange={(e) => setRole(e.target.value)}
        />
        Guest
      </label>

      <br />

      <label>
        <input
          type="radio"
          value="owner"
          checked={role === "owner"}
          onChange={(e) => setRole(e.target.value)}
        />
        Holiday Owner
      </label>

      <br /><br />

      <button onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}
