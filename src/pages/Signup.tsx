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

if (error) {
  alert(error.message);
  return;
}

await supabase.from("profiles").insert([
  {
    id: data.user?.id,
    email: email.trim(),
    full_name: fullName,
    role: role,
  },
]);

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    // Save extra user information
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user?.id,
          email: email.trim(),
          full_name: fullName,
          role: role,
        },
      ]);

    if (profileError) {
      console.log(profileError);
      alert(profileError.message);
      return;
    }

    alert("Account created!");
    navigate("/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Account</h1>

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
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="guest">Guest</option>
        <option value="owner">Holiday Owner</option>
      </select>

      <br /><br />

      <button onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}
