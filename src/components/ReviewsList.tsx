
import { useEffect, useState } from "react";
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
        padding: "7px 0",
        borderBottom: "1px solid #edf0ed",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#536258" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Stars rating={rating} />
        <strong style={{ color: "#405448" }}>{rating}/5</strong>
      </span>
    </div>
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
        reviews.map((review) => (
          <article
            key={review.id}
            style={{
              marginTop: 16,
              padding: 18,
              border: "1px solid #e3eae3",
              borderRadius: 12,
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <strong style={{ color: "#203128", fontSize: 14 }}>
                Guest review
              </strong>
              <span style={{ color: "#758078", fontSize: 12 }}>
                {new Date(review.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div
              style={{
                background: "#f6f9f5",
                borderRadius: 9,
                padding: 12,
                marginBottom: 12,
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
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Stars rating={review.rating} />
                  <strong style={{ color: "#405448", fontSize: 13 }}>
                    {review.rating ?? "—"}/5
                  </strong>
                </span>
              </div>
            </div>

            <div>
              <RatingRow
                label="Cleanliness"
                rating={review.cleanliness_rating}
              />
              <RatingRow
                label="Communication"
                rating={review.communication_rating}
              />
              <RatingRow
                label="Accuracy"
                rating={review.accuracy_rating}
              />
              <RatingRow
                label="Respect"
                rating={review.respect_rating}
              />
            </div>

            {review.review_text && (
              <p
                style={{
                  color: "#536258",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "15px 0 0",
                  whiteSpace: "pre-line",
                }}
              >
                {review.review_text}
              </p>
            )}
          </article>
        ))
      )}
    </div>
  );
}

