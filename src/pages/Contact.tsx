
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const BRAND_GREEN = "#286442";
const DARK_GREEN = "#1d472f";
const PALE_GREEN = "#edf4ed";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General enquiry",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(
      "Your details are ready. Message sending will be enabled once the contact service is connected."
    );
  }

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setStatus("");
  }

  const inputStyle = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #d5ddd6",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#243329",
    fontSize: "15px",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: 600,
    color: DARK_GREEN,
  };

  return (
    <main
      style={{
        minHeight: "70vh",
        background: "#ffffff",
        color: "#26332b",
        fontFamily: "inherit",
      }}
    >
      <header
        style={{
          background: BRAND_GREEN,
          color: "#ffffff",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          STATIC HOLIDAYS
        </p>
        <h1 style={{ margin: "0 0 14px", fontSize: "clamp(32px, 5vw, 46px)" }}>
          Contact Us
        </h1>
        <p
          style={{
            maxWidth: "580px",
            margin: "0 auto",
            lineHeight: 1.7,
            fontSize: "17px",
          }}
        >
          We’re here to help make your next getaway special.
          Get in touch with any questions about your stay.
        </p>
      </header>

      <section
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "56px 24px 72px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "42px",
          alignItems: "start",
        }}
      >
        <div>
          <h2
            style={{
              color: DARK_GREEN,
              fontSize: "28px",
              margin: "0 0 14px",
            }}
          >
            How can we help?
          </h2>
          <p style={{ color: "#59645c", lineHeight: 1.8, marginTop: 0 }}>
            Whether you have a question about a property, an existing booking
            or planning your next break, send us a message.
          </p>

          <div
            style={{
              marginTop: "28px",
              padding: "24px",
              borderRadius: "12px",
              background: PALE_GREEN,
              borderLeft: `4px solid ${BRAND_GREEN}`,
            }}
          >
            <h3 style={{ color: DARK_GREEN, marginTop: 0 }}>
              Already made a booking?
            </h3>
            <p style={{ color: "#59645c", lineHeight: 1.7 }}>
              For questions about an existing reservation, please include
              your booking reference in your message.
            </p>
            <Link
              to="/dashboard"
              style={{
                color: BRAND_GREEN,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Visit your dashboard →
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "28px",
            border: "1px solid #e2e8e2",
            borderRadius: "14px",
            boxShadow: "0 8px 28px rgba(29, 71, 47, 0.07)",
            display: "grid",
            gap: "19px",
          }}
        >
          <h2 style={{ color: DARK_GREEN, margin: "0 0 2px", fontSize: "24px" }}>
            Send us a message
          </h2>

          <div>
            <label htmlFor="contact-name" style={labelStyle}>
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Enter your name"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="contact-email" style={labelStyle}>
              Email address
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="contact-subject" style={labelStyle}>
              What is your enquiry about?
            </label>
            <select
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              style={inputStyle}
            >
              <option>General enquiry</option>
              <option>Existing booking</option>
              <option>Property enquiry</option>
              <option>Listing my property</option>
              <option>Website support</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" style={labelStyle}>
              Your message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us how we can help..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px 20px",
              background: BRAND_GREEN,
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Send message
          </button>

          {status && (
            <p
              role="status"
              style={{
                margin: 0,
                padding: "12px",
                borderRadius: "8px",
                background: PALE_GREEN,
                color: DARK_GREEN,
                lineHeight: 1.6,
              }}
            >
              {status}
            </p>
          )}
        </form>
      </section>

      <footer
        style={{
          background: DARK_GREEN,
          borderTop: `5px solid ${BRAND_GREEN}`,
          color: "#ffffff",
          padding: "28px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 12px" }}>
          © {new Date().getFullYear()} Static Holidays
        </p>
        <nav
          aria-label="Footer navigation"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          <Link to="/properties" style={{ color: "#ffffff", textDecoration: "none" }}>
            Properties
          </Link>
          <Link to="/booking-terms" style={{ color: "#ffffff", textDecoration: "none" }}>
            Booking Terms
          </Link>
          <Link to="/privacy-policy" style={{ color: "#ffffff", textDecoration: "none" }}>
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </main>
  );
}
