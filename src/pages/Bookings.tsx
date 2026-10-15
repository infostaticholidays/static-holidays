import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  status?: string | null;
  created_at?: string;
};

type Property = {
  id: string;
  title?: string;
};

function formatDate(date: string) {
  if (!date) return "Not set";

  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

function statusStyle(status: string) {
  const value = status.toLowerCase();

  if (value === "confirmed" || value === "accepted") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (value === "pending") {
    return { background: "#fef3c7", color: "#92400e" };
  }

  if (value === "cancelled" || value === "rejected") {
    return { background: "#fee2e2", color: "#991b1b" };
  }

  return { background: "#e5e7eb", color: "#374151" };
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please sign in to view bookings for your properties.");
        setLoading(false);
        return;
      }

      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id);

      if (propertyError) {
        setError(propertyError.message);
        setLoading(false);
        return;
      }

      const propertyList = (propertyData ?? []) as Property[];
      setProperties(propertyList);

      if (propertyList.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .in("property_id", propertyList.map((property) => property.id))
        .order("created_at", { ascending: false });

      if (bookingError) {
        setError(bookingError.message);
      } else {
        setBookings((bookingData ?? []) as Booking[]);
      }

      setLoading(false);
    }

    loadBookings();
  }, []);

  const getPropertyTitle = (propertyId: string) => {
    const property = properties.find((item) => item.id === propertyId);
    return property?.title || "Your holiday property";
  };

  const pendingCount = bookings.filter(
    (booking) => (booking.status || "").toLowerCase() === "pending"
  ).length;

  const confirmedCount = bookings.filter((booking) =>
    ["confirmed", "accepted"].includes((booking.status || "").toLowerCase())
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px 20px 60px",
        color: "#172033",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <Link
          to="/host-dashboard"
          style={{
            color: "#52647a",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to dashboard
        </Link>

        <header style={{ margin: "26px 0 30px" }}>
          <p
            style={{
              color: "#64748b",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            HOST MANAGEMENT
          </p>
          <h1
            style={{
              fontSize: 34,
              lineHeight: 1.2,
              margin: "0 0 10px",
              letterSpacing: -1,
            }}
          >
            Your bookings
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: 16 }}>
            Keep track of guest stays and manage your property reservations.
          </p>
        </header>

        {loading ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 40,
              textAlign: "center",
            }}
          >
            Loading your bookings…
          </div>
        ) : error ? (
          <div
            role="alert"
            style={{
              background: "#fff",
              border: "1px solid #fecaca",
              borderRadius: 14,
              padding: 24,
              color: "#991b1b",
            }}
          >
            <strong>We couldn’t load your bookings.</strong>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 30,
              }}
            >
              {[
                { label: "Total bookings", value: bookings.length },
                { label: "Pending requests", value: pendingCount },
                { label: "Confirmed stays", value: confirmedCount },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#fff",
                    border: "1px solid #e7ebf0",
                    borderRadius: 16,
                    padding: "22px 24px",
                    boxShadow: "0 4px 18px rgba(15, 23, 42, 0.03)",
                  }}
                >
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: 14,
                      margin: "0 0 12px",
                    }}
                  >
                    {item.label}
                  </p>
                  <strong style={{ fontSize: 32, letterSpacing: -1 }}>
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: 21, margin: 0 }}>All reservations</h2>
              <span style={{ color: "#64748b", fontSize: 14 }}>
                {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
              </span>
            </div>

            {bookings.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e7ebf0",
                  borderRadius: 16,
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ marginTop: 0 }}>No bookings yet</h3>
                <p style={{ color: "#64748b" }}>
                  New reservations for your properties will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {bookings.map((booking) => {
                  const status = booking.status?.trim() || "Not specified";
                  const nights =
                    booking.check_in && booking.check_out
                      ? Math.max(
                          0,
                          Math.round(
                            (new Date(`${booking.check_out.slice(0, 10)}T12:00:00`).getTime() -
                              new Date(`${booking.check_in.slice(0, 10)}T12:00:00`).getTime()) /
                              86400000
                          )
                        )
                      : 0;

                  return (
                    <article
                      key={booking.id}
                      style={{
                        background: "#fff",
                        border: "1px solid #e7ebf0",
                        borderRadius: 16,
                        padding: 24,
                        boxShadow: "0 4px 18px rgba(15, 23, 42, 0.03)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              color: "#64748b",
                              fontSize: 12,
                              fontWeight: 700,
                              letterSpacing: 1,
                              margin: "0 0 8px",
                              textTransform: "uppercase",
                            }}
                          >
                            PROPERTY
                          </p>
                          <h3 style={{ fontSize: 21, margin: "0 0 8px" }}>
                            {getPropertyTitle(booking.property_id)}
                          </h3>
                          <p
                            style={{
                              color: "#94a3b8",
                              fontSize: 12,
                              margin: 0,
                            }}
                          >
                            Booking reference: {booking.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>

                        <span
                          style={{
                            ...statusStyle(status),
                            padding: "7px 12px",
                            borderRadius: 30,
                            fontSize: 12,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {status}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: 16,
                          background: "#f8fafc",
                          borderRadius: 12,
                          padding: 18,
                          margin: "22px 0",
                        }}
                      >
                        <div>
                          <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 7px" }}>
                            CHECK-IN
                          </p>
                          <strong>{formatDate(booking.check_in)}</strong>
                        </div>
                        <div>
                          <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 7px" }}>
                            CHECK-OUT
                          </p>
                          <strong>{formatDate(booking.check_out)}</strong>
                        </div>
                        <div>
                          <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 7px" }}>
                            LENGTH OF STAY
                          </p>
                          <strong>
                            {nights} {nights === 1 ? "night" : "nights"}
                          </strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Link
                          to={`/booking/${booking.id}`}
                          style={{
                            display: "inline-block",
                            background: "#172033",
                            color: "#fff",
                            padding: "11px 18px",
                            borderRadius: 9,
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          View booking details →
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        <footer
          style={{
            borderTop: "1px solid #e2e8f0",
            marginTop: 36,
            paddingTop: 20,
            color: "#64748b",
            fontSize: 13,
          }}
        >
          Static Holidays · Host booking management
        </footer>
      </div>
    </main>
  );
}
