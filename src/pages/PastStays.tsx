import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PropertyImage = {
  id: string;
  public_url: string;
  is_cover: boolean;
  position: number;
};

type PastStay = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  properties: {
    title: string;
    location: string | null;
    property_images: PropertyImage[] | null;
  } | null;
};

type Review = {
  booking_id: string;
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#F6F4EE",
  padding: "48px 20px 80px",
  color: "#354C3C",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E4E8DE",
  borderRadius: 18,
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "minmax(240px, 38%) 1fr",
  marginBottom: 24,
  boxShadow: "0 4px 16px rgba(53, 76, 60, 0.05)",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: 250,
  objectFit: "cover",
  display: "block",
};

const contentStyle: React.CSSProperties = {
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#52765A",
  color: "#FFFFFF",
  padding: "12px 19px",
  borderRadius: 9,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
};

const secondaryLinkStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#52765A",
  fontWeight: 600,
  fontSize: 14,
  textDecoration: "none",
  marginTop: 16,
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PastStays() {
  const [pastStays, setPastStays] = useState<PastStay[]>([]);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPastStays() {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (!cancelled) {
          setErrorMessage("Please sign in to view your past stays.");
          setLoading(false);
        }
        return;
      }

      const today = new Date();
      const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          property_id,
          check_in,
          check_out,
          properties (
            title,
            location,
            property_images (
              id,
              public_url,
              is_cover,
              position
            )
          )
        `)
        .eq("guest_id", user.id)
        .eq("booking_status", "confirmed")
        .lt("check_out", todayString)
        .order("check_out", { ascending: false });

      if (error) {
        console.error("Could not load past stays:", error);
        if (!cancelled) {
          setErrorMessage("We couldn't load your past stays. Please try again.");
          setLoading(false);
        }
        return;
      }

      const stays = (data ?? []) as unknown as PastStay[];

      if (cancelled) return;

      setPastStays(stays);

      if (stays.length > 0) {
        const bookingIds = stays.map((stay) => stay.id);

        const { data: reviews, error: reviewsError } = await supabase
          .from("reviews")
          .select("booking_id")
          .in("booking_id", bookingIds)
          .eq("reviewer_id", user.id)
          .eq("review_type", "guest_to_owner");

        if (reviewsError) {
          console.error("Could not load submitted reviews:", reviewsError);
        } else if (!cancelled) {
          const submittedIds = (reviews ?? []).map(
            (review: Review) => review.booking_id
          );
          setReviewedBookingIds(submittedIds);
        }
      }

      if (!cancelled) {
        setLoading(false);
      }
    }

    loadPastStays();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link
          to="/account"
          style={{
            color: "#52765A",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ← Back to my account
        </Link>

        <header style={{ marginTop: 30, marginBottom: 38 }}>
          <p
            style={{
              color: "#52765A",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            STATIC HOLIDAYS
          </p>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 44px)",
              lineHeight: 1.15,
              margin: "0 0 14px",
              color: "#354C3C",
              fontWeight: 700,
            }}
          >
            Your Past Stays
          </h1>

          <p
            style={{
              color: "#59685A",
              fontSize: 16,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 650,
            }}
          >
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
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 22,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 22,
                  margin: 0,
                  color: "#354C3C",
                }}
              >
                Your completed holidays
              </h2>
              <p
                style={{
                  color: "#718071",
                  fontSize: 14,
                  margin: "7px 0 0",
                }}
              >
                {pastStays.length}{" "}
                {pastStays.length === 1 ? "stay" : "stays"}
              </p>
            </div>
          </div>

          {loading && (
            <p style={{ color: "#59685A", padding: "24px 0" }}>
              Loading your past stays...
            </p>
          )}

          {!loading && errorMessage && (
            <p style={{ color: "#A33D32", padding: "24px 0" }}>
              {errorMessage}
            </p>
          )}

          {!loading && !errorMessage && pastStays.length === 0 && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E4E8DE",
                borderRadius: 18,
                padding: 32,
                textAlign: "center",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#354C3C" }}>
                No past stays yet
              </h3>
              <p style={{ color: "#59685A", lineHeight: 1.6 }}>
                Once you've completed a holiday, it will appear here.
              </p>
            </div>
          )}

          {!loading &&
            !errorMessage &&
            pastStays.map((stay) => {
              const propertyImages = stay.properties?.property_images ?? [];

              const sortedImages = [...propertyImages].sort(
                (a, b) =>
                  Number(b.is_cover) - Number(a.is_cover) ||
                  a.position - b.position
              );

              const coverImage = sortedImages[0];
              const hasReviewed = reviewedBookingIds.includes(stay.id);

              return (
                <article key={stay.id} style={cardStyle}>
                  <div
                    style={{
                      minHeight: 250,
                      background: "#EAF0E6",
                    }}
                  >
                    {coverImage?.public_url ? (
                      <img
                        src={coverImage.public_url}
                        alt={stay.properties?.title ?? "Holiday property"}
                        style={imageStyle}
                      />
                    ) : (
                      <div
                        style={{
                          ...imageStyle,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#718071",
                          fontSize: 15,
                        }}
                      >
                        Property photo unavailable
                      </div>
                    )}
                  </div>

                  <div style={contentStyle}>
                    <span
                      style={{
                        display: "inline-block",
                        background: "#EAF0E6",
                        color: "#52765A",
                        borderRadius: 20,
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 14,
                      }}
                    >
                      Completed stay
                    </span>

                    <h3
                      style={{
                        color: "#354C3C",
                        fontSize: 23,
                        lineHeight: 1.3,
                        margin: "0 0 6px",
                      }}
                    >
                      {stay.properties?.title ?? "Holiday property"}
                    </h3>

                    {stay.properties?.location && (
                      <p
                        style={{
                          color: "#718071",
                          fontSize: 14,
                          margin: "0 0 20px",
                        }}
                      >
                        {stay.properties.location}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 30,
                        flexWrap: "wrap",
                        marginBottom: 22,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "#718071",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            margin: "0 0 5px",
                          }}
                        >
                          Check-in
                        </p>
                        <p
                          style={{
                            color: "#354C3C",
                            fontSize: 14,
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {formatDate(stay.check_in)}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            color: "#718071",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            margin: "0 0 5px",
                          }}
                        >
                          Check-out
                        </p>
                        <p
                          style={{
                            color: "#354C3C",
                            fontSize: 14,
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {formatDate(stay.check_out)}
                        </p>
                      </div>
                    </div>

                    {hasReviewed ? (
                      <p
                        style={{
                          color: "#52765A",
                          fontWeight: 700,
                          fontSize: 14,
                          margin: "0 0 18px",
                        }}
                      >
                        ★★★★★ Review submitted
                      </p>
                    ) : (
                      <Link
                        to={`/my-booking/${stay.id}`}
                        style={buttonStyle}
                      >
                        Leave a review
                      </Link>
                    )}

                    <Link
                      to={`/property/${stay.property_id}`}
                      style={secondaryLinkStyle}
                    >
                      View property details →
                    </Link>

           
                  </div>
                </article>
              );
            })}
        </section>
      </div>

      <style>
        {`
          @media (max-width: 700px) {
            article {
              grid-template-columns: 1fr !important;
            }

            article img {
              height: 230px !important;
              min-height: 230px !important;
            }
          }
        `}
      </style>
    </main>
  );
}
