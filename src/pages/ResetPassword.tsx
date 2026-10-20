
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Your password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(
          "We couldn't update your password. Your reset link may have expired. Please request a new one."
        );
        return;
      }

      setMessage("Your password has been updated successfully.");

      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
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
    background: "#fff",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        boxSizing: "border-box",
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
          background: "#fff",
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
          <p style={{ color: "#718174", fontSize: 13 }}>
            Lovely places to stay. Memorable moments to make.
          </p>
        </div>

        <h1 style={{ color: "#263d2e", fontSize: 27 }}>
          Choose a new password
        </h1>
        <p style={{ color: "#748075", fontSize: 14, lineHeight: 1.6 }}>
          Create a new password for your Static Holidays account.
        </p>

        <form onSubmit={updatePassword}>
          <label
            htmlFor="new-password"
            style={{
              display: "block",
              marginBottom: 7,
              color: "#315d43",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            style={inputStyle}
          />

          <label
            htmlFor="confirm-password"
            style={{
              display: "block",
              margin: "18px 0 7px",
              color: "#315d43",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter your password again"
            style={inputStyle}
          />

          {errorMessage && (
            <p role="alert" style={{ color: "#a3362b", fontSize: 13 }}>
              {errorMessage}
            </p>
          )}

          {message && (
            <p role="status" style={{ color: "#28543b", fontSize: 13 }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 24,
              padding: 14,
              border: "none",
              borderRadius: 10,
              background: "#315d43",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Updating password..." : "Update password"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 22, fontSize: 14 }}>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              background: "transparent",
              color: "#315d43",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Back to log in
          </button>
        </p>
      </section>
    </main>
  );
}
