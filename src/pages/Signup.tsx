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

    const user = data.user;

    if (!user) {
      alert("User not created");
      return;
    }

    // insert profile ONCE
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
    navigate("/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Sign Up</h1>

      <input placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} />
      <br /><br />

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="guest">Guest</option>
        <option value="owner">Holiday Owner</option>
      </select>

      <br /><br />

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
