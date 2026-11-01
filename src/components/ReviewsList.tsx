
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
};

function Stars({ rating }: { rating: number | null }) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return (
    <span style={{ color: "#d49b32", letterSpacing: 1 }}>
      {"★".repeat(value)}
      {"☆".repeat(5 - value)}
    </span>
  );
}

function RatingRow({
  label,
  rating,
}: {
  label: string;
  rating: number | null;
}) {
  if (rating === null || rating === undefined) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: "5px 0",
        fontSize: 12,
      }}
    >
      <span style={{ color: "#536258" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Stars rating={rating} />
        <strong style={{ color: "#405448" }}>{rating}/5</strong>
      </span>
    </div>
  );
}

function averageRating(reviews: Review[], field: keyof Review) {
  const values = reviews
    .map((review) => review[field])
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value)
    );

  if (values.length === 0) return null;

  return (
    values.reduce((total, value) => total + value, 0) / values.length
  );
}

export default function ReviewsList({
  propertyId,
}: {
  propertyId: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      setLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select(
          "id, rating, cleanliness_rating, communication_rating, accuracy_rating, respect_rating, review_text, created_at"
        )
        .eq("property_id", propertyId)
        .eq("review_type", "guest_to_owner")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Could not load reviews:", error);
        if (!cancelled) setReviews([]);
      } else if (!cancelled) {
        setReviews((data ?? []) as Review[]);
      }

      if (!cancelled) setLoading(false);
    }

    if (propertyId) {
      void fetchReviews();
    } else {
      setReviews([]);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const overallAverage = averageRating(reviews, "rating");
  const latestReview = reviews[0];

  return (
    <div style={{ marginTop: 20 }}>
      {loading ? (
        <p style={{ color: "#758078", fontSize: 13 }}>
          Loading reviews…
        </p>
      ) : reviews.length === 0 ? (
        <p style={{ color: "#758078", fontSize: 13 }}>
          No reviews yet for this property.
        </p>
      ) : (
        <div
          style={{
            padding: 18,
            border: "1px solid #e3eae3",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    color: "#d49b32",
                    fontSize: 21,
                    fontWeight: 700,
                  }}
                >
                  ★ {overallAverage?.toFixed(1) ?? "—"}/5
                </span>

                <span style={{ color: "#758078", fontSize: 13 }}>
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              <p
                style={{
                  color: "#758078",
                  fontSize: 12,
                  margin: "4px 0 0",
                }}
              >
                Guest ratings
              </p>
            </div>

            <Link
              to={`/property/${propertyId}/reviews`}
              style={{
                color: "#52765A",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Read all reviews →
            </Link>
          </div>

          <div
            style={{
              borderTop: "1px solid #edf0ed",
              paddingTop: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <strong style={{ color: "#203128", fontSize: 14 }}>
                Latest guest review
              </strong>

              <span style={{ color: "#758078", fontSize: 12 }}>
                {new Date(latestReview.created_at).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>
            </div>

            <div
              style={{
                background: "#f6f9f5",
                borderRadius: 9,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <strong style={{ color: "#315640", fontSize: 13 }}>
                  Overall rating
                </strong>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Stars rating={latestReview.rating} />
                  <strong style={{ color: "#405448", fontSize: 13 }}>
                    {latestReview.rating ?? "—"}/5
                  </strong>
                </span>
              </div>
            </div>

            <div>
              <RatingRow
                label="Cleanliness"
                rating={latestReview.cleanliness_rating}
              />
              <RatingRow
                label="Communication"
                rating={latestReview.communication_rating}
              />
              <RatingRow
                label="Accuracy"
                rating={latestReview.accuracy_rating}
              />
              <RatingRow
                label="Respect"
                rating={latestReview.respect_rating}
              />
            </div>

            {latestReview.review_text && (
              <p
                style={{
                  color: "#536258",
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: "12px 0 0",
                  whiteSpace: "pre-line",
                }}
              >
                {latestReview.review_text}
              </p>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid #edf0ed",
              marginTop: 14,
              paddingTop: 12,
              textAlign: "center",
            }}
          >
            <Link
              to={`/property/${propertyId}/reviews`}
              style={{
                color: "#52765A",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Read all {reviews.length} reviews →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
