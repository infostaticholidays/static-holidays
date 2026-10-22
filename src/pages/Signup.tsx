
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
          },
        },
      });

      if (error) throw error;

      const user = data.user;

      if (!user) {
        throw new Error("Your account could not be created. Please try again.");
      }

      // Save the details entered on the form.
      // If email confirmation is enabled, the user may need
      // to confirm their email before signing in.
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: email.trim(),
            role,
            full_name: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            newsletter,
          },
          { onConflict: "id" }
        );

      if (profileError) throw profileError;

      if (data.session) {
        navigate("/account");
        return;
      }

      setMessage(
        "Your account has been created. Please check your email to confirm your address before signing in."
      );
    } catch (err) {
      console.error("Signup error:", err);

      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    border: "1px solid #DCE3D7",
    borderRadius: 10,
    background: "#FFFFFF",
    color: "#354C3C",
    fontSize: 15,
    outlineColor: "#52765A",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 7,
    color: "#354C3C",
    fontSize: 14,
    fontWeight: 600,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F4EE",
        padding: "45px 18px 60px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#354C3C",
      }}
    >
      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 30 }}>
          <p
            style={{
              color: "#52765A",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 3,
              marginBottom: 12,
            }}
          >
            STATIC HOLIDAYS
          </p>

          <h1
            style={{
              fontSize: 34,
              lineHeight: 1.2,
              letterSpacing: "-0.8px",
              margin: "0 0 12px",
              color: "#354C3C",
            }}
          >
            Join our community
          </h1>

          <p
            style={{
              color: "#59685A",
              fontSize: 15,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Create your account to plan your next stay or share your
            holiday property.
          </p>
        </header>

        <section
          style={{
            background: "#FFFFFF",
            border: "1px solid #E4E8DE",
            borderRadius: 20,
            padding: "30px 26px",
            boxShadow: "0 6px 24px rgba(53, 76, 60, 0.06)",
          }}
        >
          <h2 style={{ fontSize: 22, margin: "0 0 8px" }}>
            Create your account
          </h2>

          <p
            style={{
              color: "#59685A",
              fontSize: 14,
              margin: "0 0 26px",
              lineHeight: 1.6,
            }}
          >
            Tell us a little about yourself to get started.
          </p>

          {errorMessage && (
            <div
              role="alert"
              style={{
                background: "#FBEAE6",
                color: "#963F32",
                borderRadius: 10,
                padding: 13,
                marginBottom: 18,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </div>
          )}

          {message && (
            <div
              role="status"
              style={{
                background: "#EAF0E6",
                color: "#354C3C",
                borderRadius: 10,
                padding: 15,
                marginBottom: 18,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {message}
              <p style={{ marginBottom: 0 }}>
                <Link
                  to="/login"
                  style={{ color: "#52765A", fontWeight: 700 }}
                >
                  Go to sign in
                </Link>
              </p>
            </div>
          )}

          {!message && (
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="fullName" style={labelStyle}>
                  Full name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={120}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label htmlFor="email" style={labelStyle}>
                  Email address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={254}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label htmlFor="phone" style={labelStyle}>
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Your contact number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={30}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label htmlFor="address" style={labelStyle}>
                  Home address
                </label>
                <textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Enter your home address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  maxLength={500}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
                <p
                  style={{
                    color: "#758174",
                    fontSize: 12,
                    lineHeight: 1.5,
                    margin: "7px 0 0",
                  }}
                >
                  Optional. Only provide this if you want it associated
                  with your account.
                </p>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label htmlFor="password" style={labelStyle}>
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  style={inputStyle}
                />
                <p
                  style={{
                    color: "#758174",
                    fontSize: 12,
                    margin: "7px 0 0",
                  }}
                >
                  Choose a password with at least 8 characters.
                </p>
              </div>

              <div style={{ marginBottom: 22 }}>
                <label htmlFor="role" style={labelStyle}>
                  How will you use Static Holidays? *
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                  }}
                >
                  <option value="guest">I'm looking for a holiday</option>
                  <option value="host">I own a holiday property</option>
                </select>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 24,
                  color: "#59685A",
                  fontSize: 13,
                  lineHeight: 1.6,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  style={{
                    marginTop: 4,
                    accentColor: "#52765A",
                  }}
                />
                <span>
                  I'd like to receive occasional news and updates from
                  Static Holidays. I can unsubscribe at any time.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  border: 0,
                  borderRadius: 11,
                  padding: "15px 20px",
                  background: loading ? "#9BAA9B" : "#52765A",
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? "Creating your account..." : "Create my account"}
              </button>
            </form>
          )}

          <div
            style={{
              borderTop: "1px solid #E4E8DE",
              marginTop: 25,
              paddingTop: 22,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#59685A",
                fontSize: 14,
                margin: 0,
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#52765A",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <p
          style={{
            textAlign: "center",
            color: "#758174",
            fontSize: 12,
            lineHeight: 1.7,
            marginTop: 24,
          }}
        >
          STATIC HOLIDAYS
          <br />
          Find your place to unwind.
        </p>
      </div>
    </main>
  );
}
