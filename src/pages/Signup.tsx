import { useState } from "react";
import { supabase } from "../supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Please fill all fields");
      return;
    }
const { data, error } = await supabase.auth.signUp({
  email: cleanEmail,
  password: cleanPassword,
});

console.log("SIGNUP DATA", data);
console.log("SIGNUP ERROR", error);

if (error) {
  alert(error.message);
  return;
}
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Account created!");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Sign Up</h1>

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

      <button onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}
