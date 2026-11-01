
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Review = {
  id: string;
  rating: number | null;
  cleanliness_rating: number | null;
  communication_rating: number | null;
  accuracy_rating: number | null;
  respect_rating: number | null;
  review_text: string | null;
  created_at: string;
  verified_stay: boolean | null;
  booking_completed: boolean | null;
};

type SortOption = "newest" | "highest" | "lowest";

const green = "#315640";
const muted = "#758078";
const gold = "#d49b32";

function Stars({ rating }: { rating: number | null }) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return (
    <span style={{ color: gold, letterSpacing: 2, fontSize: 20 }}>
      {"★".repeat(value)}
      {"☆".repeat(5 - value)}
    </span>
  );
}

function average(reviews: Review[], field: keyof Review) {
  const values = reviews
    .map((review) => review[field])
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value)
    );

  if (!values.length) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function RatingBar({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr 35px",
        alignItems: "center",
        gap: 12,
        margin: "12px 0",
        color: "#203128",
        fontSize: 14,
      }}
    >
      <span>{label}</span>
      <div
        style={{
          height: 11,
          borderRadius: 20,
          background: "#e3eae3",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, ((value ?? 0) / 5) * 100))}%`,
            height: "100%",
            borderRadius: 20,
            background: "#52765a",
          }}
        />
      </div>
      <strong>{value === null ? "—" : value.toFixed(1)}</strong>
    </div>
  );
}

export default function PropertyReviews() {
  const { id: propertyId } = useParams<{ id: string }>();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      if (!propertyId) {
        setReviews([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("reviews")
        .select(
          "id, rating, cleanliness_rating, communication_rating, accuracy_rating, respect_rating, review_text, created_at, verified_stay, booking_completed"
        )
        .eq("property_id", propertyId)
        .eq("review_type", "guest_to_owner")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Could not load property reviews:", error);
        setErrorMessage("We couldn't load the reviews just now. Please try again later.");
        setReviews([]);
      } else {
        setReviews((data ?? []) as Review[]);
      }

      setLoading(false);
    }

    void fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const averageRating = average(reviews, "rating");
  const cleanlinessAverage = average(reviews, "cleanliness_rating");
  const communicationAverage = average(reviews, "communication_rating");
  const accuracyAverage = average(reviews, "accuracy_rating");
  const respectAverage = average(reviews, "respect_rating");

  const starCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter(
      (review) => Math.round(Number(review.rating)) === stars
    ).length,
  }));

  const visibleReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      if (filterRating === null) return true;
      return Math.round(Number(review.rating)) === filterRating;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "highest") {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }

      if (sortBy === "lowest") {
        return (a.rating ?? 0) - (b.rating ?? 0);
      }

      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });
  }, [reviews, filterRating, sortBy]);

  const pageStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "28px 22px 50px",
    color: "#203128",
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #dce5da",
    borderRadius: 15,
    background: "#fff",
    padding: 24,
    marginBottom: 18,
  };

  return (
    <div style={{ background: "#fffefa", minHeight: "100vh" }}>
      <main style={pageStyle}>
        <Link
          to={`/property/${propertyId}`}
          style={{
            display: "inline-block",
            color: green,
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          ← Back to property
        </Link>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
            padding: "30px",
            borderRadius: 20,
            background: "#f0f4eb",
            marginBottom: 35,
          }}
        >
          <div>
            <h1
              style={{
                color: green,
                fontSize: 38,
                margin: "0 0 8px",
              }}
            >
              Guest Reviews
            </h1>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              See what our guests have to say about their stays.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              <span style={{ color: gold, fontSize: 32 }}>★</span>
              <strong style={{ color: green, fontSize: 48 }}>
                {averageRating === null ? "—" : averageRating.toFixed(1)}
                <span style={{ fontSize: 22 }}>/5</span>
              </strong>
              <span style={{ color: muted }}>
                from {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          <div
            style={{
              borderLeft: "1px solid #cbd8c8",
              paddingLeft: 24,
            }}
          >
            <RatingBar label="Cleanliness" value={cleanlinessAverage} />
            <RatingBar label="Communication" value={communicationAverage} />
            <RatingBar label="Accuracy" value={accuracyAverage} />
            <RatingBar label="Respect" value={respectAverage} />
          </div>
        </section>

        {!loading && !errorMessage && reviews.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ color: green, fontSize: 20 }}>
              Guest ratings
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 9,
                marginBottom: 20,
              }}
            >
              <button
                onClick={() => setFilterRating(null)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 25,
                  border: "1px solid #52765a",
                  background: filterRating === null ? green : "white",
                  color: filterRating === null ? "white" : green,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                All Reviews ({reviews.length})
              </button>

              {starCounts.map(({ stars, count }) => (
                <button
                  key={stars}
                  onClick={() => setFilterRating(stars)}
                  style={{
                    padding: "10px 15px",
                    borderRadius: 25,
                    border: "1px solid #b9cdb9",
                    background: filterRating === stars ? green : "white",
                    color: filterRating === stars ? "white" : green,
                    cursor: "pointer",
                  }}
                >
                  {stars} ★ ({count})
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <label htmlFor="review-sort" style={{ color: green }}>
                Sort by:
              </label>
              <select
                id="review-sort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                style={{
                  padding: "10px 14px",
                  border: "1px solid #cbd8c8",
                  borderRadius: 9,
                  background: "white",
                  color: green,
                  fontSize: 14,
                }}
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </section>
        )}

        {loading ? (
          <p style={{ color: muted }}>Loading guest reviews…</p>
        ) : errorMessage ? (
          <p style={{ color: "#a33" }}>{errorMessage}</p>
        ) : reviews.length === 0 ? (
          <div style={cardStyle}>
            <h2 style={{ color: green }}>No reviews yet</h2>
            <p style={{ color: muted }}>
              This property hasn't received any guest reviews yet.
            </p>
          </div>
        ) : visibleReviews.length === 0 ? (
          <div style={cardStyle}>
            <p>No reviews match this star rating.</p>
            <button
              onClick={() => setFilterRating(null)}
              style={{
                border: 0,
                background: green,
                color: "white",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Show all reviews
            </button>
          </div>
        ) : (
          visibleReviews.map((review) => {
            const verified =
              review.verified_stay === true &&
              review.booking_completed === true;

            return (
              <article key={review.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <strong style={{ color: green, fontSize: 18 }}>
                      Guest
                    </strong>
                    <div style={{ color: muted, fontSize: 14, marginTop: 4 }}>
                      {new Date(review.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>

                  {verified && (
                    <span
                      style={{
                        background: "#e8f1e4",
                        color: green,
                        borderRadius: 20,
                        padding: "7px 12px",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      ✓ Verified Stay
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "14px 0",
                    flexWrap: "wrap",
                  }}
                >
                  <Stars rating={review.rating} />
                  <strong style={{ color: green, fontSize: 20 }}>
                    {review.rating ?? "—"}/5
                  </strong>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: 12,
                    borderTop: "1px solid #e8eee7",
                    borderBottom: "1px solid #e8eee7",
                    padding: "14px 0",
                    marginBottom: 14,
                  }}
                >
                  {[
                    ["Cleanliness", review.cleanliness_rating],
                    ["Communication", review.communication_rating],
                    ["Accuracy", review.accuracy_rating],
                    ["Respect", review.respect_rating],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <div style={{ color: muted, fontSize: 13 }}>
                        {label}
                      </div>
                      <strong style={{ color: green }}>
                        {value === null ? "—" : `${value}/5`}
                      </strong>
                    </div>
                  ))}
                </div>

                {review.review_text && (
                  <p
                    style={{
                      color: "#536258",
                      fontSize: 15,
                      lineHeight: 1.7,
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    “{review.review_text}”
                  </p>
                )}
              </article>
            );
          })
        )}

        <section
          style={{
            marginTop: 35,
            padding: "28px 20px",
            borderRadius: 18,
            background: "#f0f4eb",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: green, margin: "0 0 8px" }}>
            Thank you for your feedback!
          </h2>
          <p style={{ color: "#536258", margin: 0 }}>
            Guest reviews help us maintain the high standards our guests love.
          </p>
        </section>
      </main>
    </div>
  );
}
