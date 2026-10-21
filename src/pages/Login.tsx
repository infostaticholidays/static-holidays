
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function signIn() {
    setMessage("");
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(
          "We couldn't log you in. Please check your details and try again."
        );
        return;
      }

      const user = data.user;

      if (!user) {
        setErrorMessage("We couldn't find your account. Please try again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        setErrorMessage(
          "You've signed in, but we couldn't load your account details. Please try again."
        );
        return;
      }

     
      if (profile?.role === "admin") {
        navigate("/admin/document-review");
      } else if (
        profile?.role === "host" ||
        profile?.role === "owner"
      ) {
        navigate("/host-dashboard");
      } else {
        navigate("/account");
      }


    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function sendPasswordReset() {
    setMessage("");
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address first.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage(
        "If an account exists for this email, a password reset link will be sent. Please check your inbox and spam folder."
      );
    } catch (error) {
      console.error(error);
      setErrorMessage("We couldn't send the reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #d5e2d6",
    borderRadius: 10,
    fontSize: 15,
    color: "#263d2e",
    backgroundColor: "#ffffff",
    outlineColor: "#477657",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 7,
    fontSize: 14,
    fontWeight: 600,
    color: "#315d43",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #f4f7f1, #eaf1e8)",
        fontFamily: "inherit",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 430,
          padding: "38px 32px",
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e9df",
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(38, 74, 49, 0.09)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.8px",
              color: "#28543b",
            }}
          >
            Static Holidays
          </div>

          <p
            style={{
              margin: "9px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#718174",
            }}
          >
            Lovely places to stay. Memorable moments to make.
          </p>
        </div>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: 27,
            letterSpacing: "-0.6px",
            color: "#263d2e",
          }}
        >
          {forgotPassword ? "Reset your password" : "Welcome back"}
        </h1>

        <p
          style={{
            margin: "0 0 26px",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#748075",
          }}
        >
          {forgotPassword
            ? "Enter your email address and we'll help you get back into your account."
            : "Log in to manage your stays and bookings."}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (forgotPassword) {
              void sendPasswordReset();
            } else {
              void signIn();
            }
          }}
        >
          <div style={{ marginBottom: 19 }}>
            <label htmlFor="login-email" style={labelStyle}>
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {!forgotPassword && (
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="login-password" style={labelStyle}>
                Password
              </label>

              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={{
                    ...inputStyle,
                    paddingRight: 75,
                  }}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#477657",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {!forgotPassword && (
            <div style={{ textAlign: "right", marginBottom: 22 }}>
              <button
                type="button"
                onClick={() => {
                  setForgotPassword(true);
                  setMessage("");
                  setErrorMessage("");
                }}
                style={{
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  color: "#315d43",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {message && (
            <p
              role="status"
              style={{
                padding: 12,
                borderRadius: 9,
                background: "#edf6ed",
                color: "#28543b",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
          )}

          {errorMessage && (
            <p
              role="alert"
              style={{
                padding: 12,
                borderRadius: 9,
                background: "#fff0ee",
                color: "#a3362b",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 18px",
              border: "none",
              borderRadius: 10,
              background: loading ? "#78927e" : "#315d43",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 4px 10px rgba(49, 93, 67, 0.15)",
            }}
          >
            {loading
              ? "Please wait..."
              : forgotPassword
                ? "Send reset link"
                : "Log in"}
          </button>
        </form>

        {forgotPassword ? (
          <p
            style={{
              margin: "22px 0 0",
              textAlign: "center",
              fontSize: 14,
              color: "#718174",
            }}
          >
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => {
                setForgotPassword(false);
                setMessage("");
                setErrorMessage("");
              }}
              style={{
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#315d43",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Log in
            </button>
          </p>
        ) : (
          <p
            style={{
              margin: "24px 0 0",
              textAlign: "center",
              fontSize: 14,
              color: "#718174",
            }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              style={{
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#315d43",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign up
            </button>
          </p>
        )}

        <div
          style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid #edf1eb",
            textAlign: "center",
            fontSize: 12,
            color: "#879287",
          }}
        >
          Your next getaway starts here.
        </div>
      </section>
    </main>
  );
}

