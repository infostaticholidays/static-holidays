import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignup() {
    try {
      setLoading(true);

      // 1. Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      if (!user) {
        alert("User was not created.");
        return;
      }

      // 2. Create profile row (THIS powers Account page)
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: email,
            role: role,
            newsletter: false,
          },
        ]);

      if (profileError) {
        console.error(profileError);
        alert(profileError.message);
        return;
      }

      // 3. Auto login user (important fix)
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 4. Go to account page
      navigate("/account");

    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
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

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="guest">Guest</option>
        <option value="host">Holiday Owner</option>
      </select>

      <br /><br />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </div>
  );
}
