import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignup() {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("User was not created.");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            email,
            role,
          },
        ]);

      if (profileError) {
        console.error(profileError);
        alert(profileError.message);
        return;
      }

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }
  <input
  placeholder="First name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
/>

<br /><br />

<input
  placeholder="Last name"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
/>

<br /><br />

<input
  placeholder="Phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

<br /><br />

<input
  placeholder="Address"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
/>

<br /><br />

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

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="guest">Guest</option>
        <option value="host">Holiday Owner</option>
      </select>

      <br />
      <br />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </div>
  );
}
