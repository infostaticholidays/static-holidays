
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
    owner_id: string;
    property_images: PropertyImage[] | null;
  } | null;
};

type Review = {
  booking_id: string;
  rating: number;
  cleanliness_rating: number;
  communication_rating: number;
  accuracy_rating: number;
  respect_rating: number;
  review_text: string;
  created_at: string;
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
  marginBottom: 28,
  boxShadow: "0 4px 16px rgba(53, 76, 60, 0.05)",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: 300,
  objectFit: "cover",
  display: "block",
};

const contentStyle: React.CSSProperties = {
  padding: 28,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #DCE3D7",
  borderRadius: 9,
  background: "#FCFCF9",
  color: "#354C3C",
  fontSize: 14,
  marginTop: 7,
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#52765A",
  color: "#FFFFFF",
  padding: "13px 22px",
  border: "none",
  borderRadius: 9,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            fontSize: 30,
            cursor: "pointer",
            color: star <= value ? "#C69B45" : "#D9DED5",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function PastStays() {
  const [pastStays, setPastStays] = useState<PastStay[]>([]);
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittingId, setSubmittingId] = useState("");
  const [formValues, setFormValues] = useState<
    Record<string, {
      rating: number;
      cleanliness: number;
      communication: number;
      accuracy: number;
      respect: number;
      reviewText: string;
    }>
  >({});

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
            owner_id,
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
          .select(`
            booking_id,
            rating,
            cleanliness_rating,
            communication_rating,
            accuracy_rating,
            respect_rating,
            review_text,
            created_at
          `)
          .in("booking_id", bookingIds)
          .eq("reviewer_id", user.id)
          .eq("review_type", "guest_to_owner");

        if (reviewsError) {
          console.error("Could not load submitted reviews:", reviewsError);
        } else if (!cancelled) {
          setSubmittedReviews((reviews ?? []) as Review[]);
        }
      }

      if (!cancelled) setLoading(false);
    }

    loadPastStays();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateForm(
    bookingId: string,
    field: string,
    value: string | number
  ) {
    setFormValues((previous) => ({
      ...previous,
      [bookingId]: {
        rating: 5,
        cleanliness: 5,
        communication: 5,
        accuracy: 5,
        respect: 5,
        reviewText: "",
        ...previous[bookingId],
        [field]: value,
      },
    }));
  }

  async function submitReview(stay: PastStay) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in to submit your review.");
      return;
    }

    const ownerId = stay.properties?.owner_id;

    if (!ownerId) {
      alert("We couldn't identify the property owner. Please contact support.");
      return;
    }

    const values = {
      rating: 5,
      cleanliness: 5,
      communication: 5,
      accuracy: 5,
      respect: 5,
      reviewText: "",
      ...formValues[stay.id],
    };

    if (!values.reviewText.trim()) {
      alert("Please write a few words about your stay before submitting.");
      return;
    }

    setSubmittingId(stay.id);

    const { error } = await supabase.from("reviews").insert({
      booking_id: stay.id,
      property_id: stay.property_id,
      reviewer_id: user.id,
      reviewed_user_id: ownerId,
      review_type: "guest_to_owner",
      verified_stay: true,
      booking_completed: true,
      rating: values.rating,
      cleanliness_rating: values.cleanliness,
      communication_rating: values.communication,
      accuracy_rating: values.accuracy,
      respect_rating: values.respect,
      review_text: values.reviewText.trim(),
    });

    if (error) {
      console.error("Could not submit review:", error);
      alert(
        error.code === "23505"
          ? "You have already submitted a review for this stay."
          : error.message
      );
      setSubmittingId("");
      return;
    }

    setSubmittedReviews((previous) => [
      ...previous,
      {
        booking_id: stay.id,
        rating: values.rating,
        cleanliness_rating: values.cleanliness,
        communication_rating: values.communication,
        accuracy_rating: values.accuracy,
        respect_rating: values.respect,
        review_text: values.reviewText.trim(),
        created_at: new Date().toISOString(),
      },
    ]);

    setSubmittingId("");
  }

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
            }}
          >
            Your Reviews
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
            Share your experience and help our hosts – it only takes a minute.
          </p>
        </header>

        <section>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 23, margin: 0, color: "#354C3C" }}>
              Your past stays
            </h2>
            <p style={{ color: "#718071", fontSize: 14, marginTop: 7 }}>
              Leave a review for the properties you’ve stayed at.
            </p>
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
              <h3 style={{ marginTop: 0 }}>No past stays yet</h3>
              <p style={{ color: "#59685A", lineHeight: 1.6 }}>
                Once you’ve completed a holiday, it will appear here.
              </p>
            </div>
          )}

          {!loading &&
            !errorMessage &&
            pastStays.map((stay) => {
              const images = stay.properties?.property_images ?? [];
              const sortedImages = [...images].sort(
                (a, b) =>
                  Number(b.is_cover) - Number(a.is_cover) ||
                  a.position - b.position
              );
              const coverImage = sortedImages[0];

              const review = submittedReviews.find(
                (item) => item.booking_id === stay.id
              );

              const values = {
                rating: 5,
                cleanliness: 5,
                communication: 5,
                accuracy: 5,
                respect: 5,
                reviewText: "",
                ...formValues[stay.id],
              };

              return (
                <article key={stay.id} style={cardStyle}>
                  <div style={{ minHeight: 300, background: "#EAF0E6" }}>
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
                        }}
                      >
                        Property photo unavailable
                      </div>
                    )}
                  </div>

                  <div style={contentStyle}>
                    <span
                      style={{
                        background: "#EAF0E6",
                        color: "#52765A",
                        borderRadius: 20,
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        alignSelf: "flex-start",
                        marginBottom: 14,
                      }}
                    >
                      Completed stay
                    </span>

                    <h3
                      style={{
                        color: "#354C3C",
                        fontSize: 23,
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
                          margin: "0 0 18px",
                        }}
                      >
                        {stay.properties.location}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 28,
                        flexWrap: "wrap",
                        marginBottom: 24,
                      }}
                    >
                      <div>
                        <p style={{ color: "#718071", fontSize: 11, margin: "0 0 5px", fontWeight: 700 }}>
                          CHECK-IN
                        </p>
                        <strong style={{ fontSize: 14 }}>
                          {formatDate(stay.check_in)}
                        </strong>
                      </div>
                      <div>
                        <p style={{ color: "#718071", fontSize: 11, margin: "0 0 5px", fontWeight: 700 }}>
                          CHECK-OUT
                        </p>
                        <strong style={{ fontSize: 14 }}>
                          {formatDate(stay.check_out)}
                        </strong>
                      </div>
                    </div>

                    {review ? (
                      <div
                        style={{
                          background: "#F3F6EF",
                          border: "1px solid #E0E8DA",
                          borderRadius: 13,
                          padding: 20,
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <h4 style={{ margin: "0 0 8px", color: "#354C3C" }}>
                          Thanks for your review!
                        </h4>
                        <p style={{ color: "#C69B45", fontSize: 23, margin: "0 0 10px" }}>
                          {"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating || 0)))}
                          {"☆".repeat(5 - Math.max(0, Math.min(5, Math.round(review.rating || 0))))}
                        </p>
                        <p style={{ color: "#59685A", lineHeight: 1.7, margin: 0 }}>
                          {review.review_text}
                        </p>
                        <p style={{ color: "#718071", fontSize: 12, marginBottom: 0 }}>
                          Your review has been submitted.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          submitReview(stay);
                        }}
                        style={{
                          width: "100%",
                          borderTop: "1px solid #E8ECE4",
                          paddingTop: 20,
                        }}
                      >
                        <h4 style={{ fontSize: 18, margin: "0 0 6px" }}>
                          Your review
                        </h4>
                        <p style={{ color: "#718071", fontSize: 14, margin: "0 0 16px" }}>
                          Tell us about your stay...
                        </p>

                        {([
                          ["rating", "Overall rating"],
                          ["cleanliness", "Cleanliness"],
                          ["communication", "Communication"],
                          ["accuracy", "Accuracy"],
                          ["respect", "Respect"],
                        ] as const).map(([field, label]) => (
                          <div key={field} style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 14, fontWeight: 600 }}>
                              {label}
                            </label>
                            <StarRating
                              value={values[field]}
                              onChange={(value) =>
                                updateForm(stay.id, field, value)
                              }
                            />
                          </div>
                        ))}

                        <label
                          htmlFor={`review-${stay.id}`}
                          style={{ fontSize: 14, fontWeight: 600 }}
                        >
                          Your comments
                        </label>
                        <textarea
                          id={`review-${stay.id}`}
                          rows={5}
                          required
                          maxLength={2000}
                          value={values.reviewText}
                          onChange={(event) =>
                            updateForm(stay.id, "reviewText", event.target.value)
                          }
                          placeholder="Tell us what you thought about the property and your host..."
                          style={{
                            ...inputStyle,
                            resize: "vertical",
                            lineHeight: 1.6,
                          }}
                        />

                        <button
                          type="submit"
                          disabled={submittingId === stay.id}
                          style={{
                            ...buttonStyle,
                            marginTop: 18,
                            opacity: submittingId === stay.id ? 0.65 : 1,
                          }}
                        >
                          {submittingId === stay.id
                            ? "Submitting..."
                            : "Submit review"}
                        </button>
                      </form>
                    )}

                    <Link
                      to={`/property/${stay.property_id}`}
                      style={{
                        color: "#52765A",
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: "none",
                        marginTop: 20,
                      }}
                    >
                      View property details →
                    </Link>
                  </div>
                </article>
              );
            })}
        </section>

        <div
          style={{
            marginTop: 36,
            background: "#EAF0E6",
            borderRadius: 18,
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#354C3C", margin: "0 0 9px", fontSize: 21 }}>
            Thank you!
          </h3>
          <p style={{ color: "#59685A", lineHeight: 1.7, margin: 0 }}>
            Your reviews help our hosts and future guests. Thank you for being
            part of Static Holidays!
          </p>
        </div>
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

