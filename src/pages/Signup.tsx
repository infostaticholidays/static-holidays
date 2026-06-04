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
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      alert("User ID not returned from Supabase");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          email: email.trim(),
          full_name: fullName.trim(),
          role: role,
        },
      ]);

    console.log("PROFILE ERROR:", profileError);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Account created successfully!");
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

      <br />
      <br />

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

      <br />
      <br />

      <button onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}
