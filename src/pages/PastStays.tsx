import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
type PastStay = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  properties: {
    title: string;
    location: string | null;
    property_images: {
      id: string;
      public_url: string;
      is_cover: boolean;
      position: number;
    }[];
  } | null;
};

type StayReviewStatus = {
  [bookingId: string]: boolean;
};

const colors = {
  cream: "#F6F4EE",
  sage: "#52765A",
  darkGreen: "#354C3C",
  text: "#59685A",
  border: "#E4E8DE",
  white: "#FFFFFF",
  paleGreen: "#EAF0E6",
};

const cardStyle = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 18,
  padding: 24,
  marginBottom: 20,
  boxShadow: "0 4px 16px rgba(53, 76, 60, 0.05)",
};

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

export default function PastStays() {
  const [stays, setStays] = useState<PastStay[]>([]);
  const [reviewStatus, setReviewStatus] = useState<StayReviewStatus>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPastStays() {
      setLoading(true);
      setErrorMessage("");

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("Please sign in to view your past stays.");

        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id,
            property_id,
            check_in,
            check_out,
            properties (
              title,
              location
            )
          `)
          .eq("guest_id", user.id)
          .eq("booking_status", "confirmed")
          .order("check_out", { ascending: false });

        if (error) throw error;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedStays = ((data || []) as unknown as PastStay[]).filter(
          (stay) => {
            const checkout = new Date(`${stay.check_out.slice(0, 10)}T00:00:00`);
            return checkout < today;
          }
        );

        if (cancelled) return;

        setStays(completedStays);

        const statuses: StayReviewStatus = {};

        for (const stay of completedStays) {
          const { data: review, error: reviewError } = await supabase
            .from("reviews")
            .select("id")
            .eq("booking_id", stay.id)
            .eq("reviewer_id", user.id)
            .eq("review_type", "guest_to_owner")
            .maybeSingle();

          if (reviewError) {
            console.error("Could not check review status:", reviewError);
          }

          statuses[stay.id] = !!review;
        }

        if (!cancelled) setReviewStatus(statuses);
      } catch (error) {
        console.error("Could not load past stays:", error);

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load your past stays."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPastStays();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.cream,
        padding: "40px 18px 60px",
        color: colors.darkGreen,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <Link
          to="/account"
          style={{
            color: colors.sage,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ← Back to your account
        </Link>

        <header style={{ margin: "30px 0" }}>
          <p
            style={{
              color: colors.sage,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            STATIC HOLIDAYS
          </p>

          <h1 style={{ fontSize: 34, margin: "0 0 12px" }}>
            Your Past Stays
          </h1>

          <p style={{ color: colors.text, lineHeight: 1.8 }}>
            Look back at your holidays, revisit properties and share your
            experience.
          </p>
        </header>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <h2 style={{ fontSize: 21, margin: 0 }}>
              Your completed holidays
            </h2>

            <span
              style={{
                background: colors.paleGreen,
                color: colors.darkGreen,
                borderRadius: 30,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {stays.length} {stays.length === 1 ? "stay" : "stays"}
            </span>
          </div>

          {loading && <p style={{ color: colors.text }}>Loading your past stays…</p>}

          {errorMessage && (
            <section style={{ ...cardStyle, color: "#963F32" }}>
              {errorMessage}
            </section>
          )}

          {!loading && !errorMessage && stays.length === 0 && (
            <section style={cardStyle}>
              <p style={{ color: colors.text }}>
                Your completed holidays will appear here.
              </p>
            </section>
          )}

          {!loading &&
            stays.map((stay) => (
              <article key={stay.id} style={cardStyle}>
                <h3
                  style={{
                    color: colors.darkGreen,
                    fontSize: 21,
                    margin: "0 0 6px",
                  }}
                >
                  {stay.properties?.title || "Your holiday property"}
                </h3>

                <p style={{ color: colors.text, margin: "0 0 20px" }}>
                  {stay.properties?.location || "Location not available"}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 14,
                  }}
                >
                  <div>
                    <p style={{ color: colors.sage, fontSize: 12, fontWeight: 700 }}>
                      CHECK-IN
                    </p>
                    <strong>{formatDate(stay.check_in)}</strong>
                  </div>

                  <div>
                    <p style={{ color: colors.sage, fontSize: 12, fontWeight: 700 }}>
                      CHECK-OUT
                    </p>
                    <strong>{formatDate(stay.check_out)}</strong>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    marginTop: 22,
                  }}
                >
                  <span
                    style={{
                      background: colors.paleGreen,
                      color: colors.darkGreen,
                      borderRadius: 30,
                      padding: "8px 13px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    ✓ Completed stay
                  </span>

                  {reviewStatus[stay.id] ? (
                    <span style={{ color: colors.sage, fontWeight: 700 }}>
                      ★★★★★ Review submitted
                    </span>
                  ) : (
                    <Link
                      to={`/my-booking/${stay.id}`}
                      style={{
                        color: colors.sage,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Leave a review →
                    </Link>
                  )}
                </div>

                <div style={{ marginTop: 18 }}>
                  <Link
                    to={`/property/${stay.property_id}`}
                    style={{
                      color: colors.sage,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    View property details →
                  </Link>
                </div>

                <div style={{ marginTop: 12 }}>
                  <Link
                    to={`/my-booking/${stay.id}`}
                    style={{
                      color: colors.text,
                      fontSize: 13,
                      textDecoration: "underline",
                    }}
                  >
                    View booking and host feedback
                  </Link>
                </div>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}
