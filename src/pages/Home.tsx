
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  title?: string | null;
  name?: string | null;
  location?: string | null;
  address?: string | null;
  town?: string | null;
  region?: string | null;
  description?: string | null;
  price?: number | string | null;
  price_per_night?: number | string | null;
  nightly_price?: number | string | null;
  image_url?: unknown;
  cover_image?: unknown;
  main_image?: unknown;
  featured_image?: unknown;
  images?: unknown;
  photos?: unknown;
  property_images?: unknown;
  rating?: number | string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

function titleOf(p: Property) {
  return p.title || p.name || "Holiday property";
}

function locationOf(p: Property) {
  return p.location || p.town || p.region || p.address || "United Kingdom";
}

function priceOf(p: Property): number | null {
  for (const value of [
    p.price_per_night,
    p.nightly_price,
    p.price,
  ]) {
    if (value === null || value === undefined || value === "") continue;

    const amount = Number(value);
    if (Number.isFinite(amount) && amount > 0) return amount;
  }

  return null;
}

function validImage(value: unknown): string | null {
  if (typeof value === "string") {
    const url = value.trim();

    if (/^https?:\/\//i.test(url)) return url;
    return null;
  }

  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;

    for (const key of [
      "url",
      "image_url",
      "src",
      "publicUrl",
      "public_url",
      "path",
    ]) {
      const image = validImage(item[key]);
      if (image) return image;
    }
  }

  return null;
}

function imageOf(p: Property): string | null {
  // Prefer the property's main/cover photo before gallery images.
  for (const key of [
    "cover_image",
    "main_image",
    "featured_image",
    "image_url",
    "images",
    "photos",
    "property_images",
  ]) {
    const value = p[key];

    const direct = validImage(value);
    if (direct) return direct;

    if (Array.isArray(value)) {
      for (const entry of value) {
        const image = validImage(entry);
        if (image) return image;
      }
    }
  }

  return null;
}

function dateScore(p: Property) {
  const date = p.created_at ? new Date(p.created_at).getTime() : 0;
  return Number.isFinite(date) ? date : 0;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "13px 14px",
  border: "1px solid #dce5dc",
  borderRadius: 10,
  background: "#fff",
  color: "#173b2b",
  fontSize: 14,
  boxSizing: "border-box",
};

const greenButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "13px 20px",
  background: "#176b45",
  color: "#fff",
  border: "1px solid #176b45",
  borderRadius: 10,
  fontWeight: 700,
  textDecoration: "none",
  cursor: "pointer",
};

export default function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      setLoading(true);
      setLoadError("");

      const result = await supabase
        .from("properties")
        .select("*")
        .limit(100);

      if (!active) return;

      if (result.error) {
        console.error("Homepage property loading failed:", result.error);
        setLoadError("Properties could not be loaded. Please try again.");
        setProperties([]);
      } else {
        setProperties((result.data || []) as Property[]);
      }

      setLoading(false);
    }

    void loadProperties();

    return () => {
      active = false;
    };
  }, []);

  const matchingProperties = useMemo(() => {
    const query = destination.trim().toLowerCase();

    return properties.filter((p) => {
      if (!query) return true;

      return [
        titleOf(p),
        locationOf(p),
        typeof p.description === "string" ? p.description : "",
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [properties, destination]);

  const recommended = matchingProperties.slice(0, 8);

  const summerDeals = [...matchingProperties]
    .filter((p) => priceOf(p) !== null)
    .sort((a, b) => (priceOf(a) ?? Infinity) - (priceOf(b) ?? Infinity))
    .slice(0, 8);

  const bestReviewed = [...matchingProperties]
    .filter((p) => Number(p.rating) > 0)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 8);

  const popular = [...matchingProperties]
    .sort((a, b) => dateScore(b) - dateScore(a))
    .slice(0, 8);

  function search() {
    const params = new URLSearchParams();

    if (destination.trim()) params.set("destination", destination.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", guests);

    // Keep your search details in the URL for the listings page.
    navigate(`/properties?${params.toString()}`);
  }

  function PropertySection({
    heading,
    items,
  }: {
    heading: string;
    items: Property[];
  }) {
    return (
      <section style={{ margin: "52px 0 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 16,
            padding: "0 5%",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                color: "#528365",
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              YOUR NEXT ESCAPE
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: 27,
                letterSpacing: "-0.7px",
                color: "#173b2b",
              }}
            >
              {heading}
            </h2>
          </div>

          <Link
            to="/properties"
            style={{
              color: "#176b45",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Explore all stays →
          </Link>
        </div>

        {items.length === 0 ? (
          <p style={{ padding: "18px 5%", color: "#64756a" }}>
            {loading
              ? "Finding your next getaway..."
              : "No matching properties in this collection yet."}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 245px), 1fr))",
              gap: 22,
              padding: "24px 5% 4px",
            }}
          >
            {items.map((p) => {
              const photo = imageOf(p);
              const price = priceOf(p);

              return (
                <article
                  key={p.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e7eee7",
                    borderRadius: 16,
                    overflow: "hidden",
                    minWidth: 0,
                    boxShadow: "0 6px 24px rgba(24, 66, 43, 0.055)",
                    transition: "transform 160ms ease",
                  }}
                >
                  <Link
                    to={`/property/${p.id}`}
                    aria-label={`View ${titleOf(p)}`}
                    style={{ display: "block", textDecoration: "none" }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={titleOf(p)}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: 205,
                          objectFit: "cover",
                          display: "block",
                          background: "#edf2ed",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 205,
                          display: "grid",
                          placeItems: "center",
                          background: "#edf2ed",
                          color: "#64756a",
                          fontSize: 14,
                        }}
                      >
                        Property photo unavailable
                      </div>
                    )}
                  </Link>

                  <div style={{ padding: 18 }}>
                    <p
                      style={{
                        margin: "0 0 9px",
                        color: "#528365",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {locationOf(p)}
                    </p>

                    <h3
                      style={{
                        margin: "0 0 14px",
                        fontSize: 18,
                        lineHeight: 1.35,
                        color: "#173b2b",
                      }}
                    >
                      {titleOf(p)}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        borderTop: "1px solid #edf1ed",
                        paddingTop: 14,
                      }}
                    >
                      <div>
                        <strong style={{ color: "#176b45", fontSize: 17 }}>
                          {price !== null
                            ? `£${price.toLocaleString("en-GB")}`
                            : "Contact host"}
                        </strong>
                        {price !== null && (
                          <span style={{ color: "#718078", fontSize: 12 }}>
                            {" "}/ night
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/property/${p.id}`}
                        style={{
                          color: "#176b45",
                          fontSize: 13,
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        View stay →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff",
        color: "#173b2b",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Main navigation */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8eee8",
          position: "relative",
          zIndex: 2,
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: 1440,
            minHeight: 78,
            margin: "0 auto",
            padding: "12px 5%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            boxSizing: "border-box",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              color: "#173b2b",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                background: "#176b45",
                color: "#fff",
                fontSize: 23,
              }}
            >
              ⌂
            </span>
            <span>
              <strong style={{ display: "block", fontSize: 19 }}>
                Static Holidays
              </strong>
              <span style={{ fontSize: 11, color: "#718078" }}>
                Find your place to unwind
              </span>
            </span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/properties"
              style={{ color: "#355746", textDecoration: "none", fontSize: 14 }}
            >
              Explore stays
            </Link>
            <Link
              to="/dashboard"
              style={{
                color: "#176b45",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/login"
              style={greenButton}
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero and search */}
      <section
        style={{
          padding: "78px 5% 64px",
          background:
            "linear-gradient(120deg, #f2f8f1 0%, #ffffff 60%, #e8f3e8 100%)",
        }}
      >
        <div style={{ maxWidth: 1050, margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "8px 13px",
              borderRadius: 30,
              background: "#e0eee1",
              color: "#176b45",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            YOUR UK GETAWAY STARTS HERE
          </span>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.08,
              letterSpacing: "-2px",
              margin: "24px auto 18px",
              maxWidth: 850,
              color: "#173b2b",
            }}
          >
            Find a stay worth{" "}
            <span style={{ color: "#238354" }}>looking forward to.</span>
          </h1>

          <p
            style={{
              maxWidth: 620,
              margin: "0 auto",
              color: "#607267",
              fontSize: 17,
              lineHeight: 1.8,
            }}
          >
            Discover welcoming holiday homes, coastal escapes and peaceful
            lodges across the UK.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              search();
            }}
            style={{
              margin: "35px auto 0",
              maxWidth: 1000,
              padding: 15,
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
              gap: 12,
              background: "#fff",
              border: "1px solid #e2ebe2",
              borderRadius: 18,
              boxShadow: "0 14px 45px rgba(28, 77, 48, 0.09)",
              textAlign: "left",
            }}
          >
            <label style={labelStyle}>
              Destination
              <input
                placeholder="Where would you like to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Check-in
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) {
                    setCheckOut("");
                  }
                }}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Check-out
              <input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setCheckOut(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Guests
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                style={inputStyle}
              >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4+ guests</option>
              </select>
            </label>

            <button type="submit" style={{ ...greenButton, alignSelf: "end" }}>
              Search stays →
            </button>
          </form>
        </div>
      </section>

      {/* Property collections */}
      <div style={{ maxWidth: 1440, margin: "0 auto", paddingBottom: 65 }}>
        {loadError && (
          <p
            role="alert"
            style={{
              margin: "24px 5%",
              padding: 15,
              borderRadius: 10,
              background: "#fff1f0",
              color: "#9f2929",
            }}
          >
            {loadError}
          </p>
        )}

        <PropertySection
          heading="Handpicked for you"
          items={recommended}
        />

        <PropertySection
          heading="Great stays for less"
          items={summerDeals}
        />

        <PropertySection
          heading="Top-rated stays"
          items={bestReviewed}
        />

        <PropertySection
          heading="Discover more places"
          items={popular}
        />

        {!loading && properties.length === 0 && !loadError && (
          <p style={{ padding: "25px 5%", color: "#607267" }}>
            No properties are available to display yet.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "35px 5%",
          background: "#123c2a",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <strong style={{ fontSize: 19 }}>Static Holidays</strong>
            <p style={{ color: "#d0e1d5", fontSize: 13 }}>
              Your next favourite place is waiting.
            </p>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link to="/properties" style={footerLink}>Explore</Link>
            <Link to="/dashboard" style={footerLink}>Dashboard</Link>
            <Link to="/login" style={footerLink}>Sign in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: "#355746",
  fontSize: 12,
  fontWeight: 700,
};

const footerLink: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
};

