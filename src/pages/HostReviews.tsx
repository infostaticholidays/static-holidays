
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string | null;
  guest_id: string | null;
  check_in: string | null;
  check_out: string | null;
  completed: boolean | null;
  status: string | null;
  booking_status: string | null;
};

type Property = {
  id: string;
  title?: string | null;
};

type Profile = {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
};

type Review = {
  id: string;
  booking_id: string | null;
  property_id: string | null;
  reviewer_id: string | null;
  reviewed_user_id: string | null;
  rating: number | null;
  review_text: string | null;
  created_at: string | null;
  would_host_again?: boolean | null;
};

const green = "#23834b";
const darkGreen = "#176638";
const paleGreen = "#edf8f0";
const textColour = "#203328";
const muted = "#68796e";

function displayName(profile?: Profile) {
  if (!profile) return "Guest";

  const fullName = profile.full_name?.trim();
  const parts = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || parts || "Guest";
}

function formatDate(date?: string | null) {
  if (!date) return "Date unavailable";

  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

function Stars({ rating }: { rating: number | null }) {
  return (
    <span
      style={{ color: "#e4a72e", letterSpacing: 2, fontSize: 19 }}
      aria-label={rating == null ? "No rating" : `${rating} out of 5 stars`}
    >
      {rating == null
        ? "No rating"
        : "★".repeat(Math.max(0, Math.min(5, Math.round(rating))) ) +
          "☆".repeat(5 - Math.max(0, Math.min(5, Math.round(rating))))}
    </span>
  );
}

export default function HostReviews() {
  const [userId, setUserId] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [guestReviews, setGuestReviews] = useState<Review[]>([]);
  const [hostReviews, setHostReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [wouldHostAgain, setWouldHostAgain] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadPage() {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      const user = authData?.user;

      if (authError || !user) {
        setError("Please sign in to view and manage your reviews.");
        return;
      }

      setUserId(user.id);

      const [
        bookingsResult,
        propertiesResult,
        guestReviewsResult,
        hostReviewsResult,
      ] = await Promise.all([
        supabase
          .from("bookings")
          .select(
            "id, property_id, guest_id, check_in, check_out, completed, status, booking_status"
          )
          .eq("owner_id", user.id)
          .eq("completed", true)
          .order("check_out", { ascending: false }),

        supabase
          .from("properties")
          .select("id, title")
          .eq("owner_id", user.id),

        supabase
          .from("reviews")
          .select(
            "id, booking_id, property_id, reviewer_id, reviewed_user_id, rating, review_text, created_at, would_host_again"
          )
          .eq("reviewed_user_id", user.id)
          .eq("review_type", "guest_to_owner")
          .order("created_at", { ascending: false }),

        supabase
          .from("reviews")
          .select(
            "id, booking_id, property_id, reviewer_id, reviewed_user_id, rating, review_text, created_at, would_host_again"
          )
          .eq("reviewer_id", user.id)
          .eq("review_type", "owner_to_guest")
          .order("created_at", { ascending: false }),
      ]);

      if (bookingsResult.error) throw bookingsResult.error;
      if (propertiesResult.error) throw propertiesResult.error;
      if (guestReviewsResult.error) throw guestReviewsResult.error;
      if (hostReviewsResult.error) throw hostReviewsResult.error;

      const bookingData = (bookingsResult.data ?? []) as Booking[];
      const propertyData = (propertiesResult.data ?? []) as Property[];
      const guestReviewData = (guestReviewsResult.data ?? []) as Review[];
      const hostReviewData = (hostReviewsResult.data ?? []) as Review[];

      setBookings(bookingData);
      setProperties(propertyData);
      setGuestReviews(guestReviewData);
      setHostReviews(hostReviewData);

      const ids = new Set<string>();

      bookingData.forEach((booking) => {
        if (booking.guest_id) ids.add(booking.guest_id);
      });

      guestReviewData.forEach((review) => {
        if (review.reviewer_id) ids.add(review.reviewer_id);
      });

      hostReviewData.forEach((review) => {
        if (review.reviewed_user_id) ids.add(review.reviewed_user_id);
      });

      if (ids.size > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, first_name, last_name")
          .in("id", Array.from(ids));

        if (profileError) throw profileError;

        setProfiles((profileData ?? []) as Profile[]);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      console.error("Error loading host reviews:", err);
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't load your reviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, []);

  function propertyName(propertyId: string | null) {
    return (
      properties.find((property) => property.id === propertyId)?.title ||
      "Your holiday property"
    );
  }

  function guestName(guestId: string | null) {
    return displayName(profiles.find((profile) => profile.id === guestId));
  }

  function alreadyReviewed(bookingId: string) {
    return hostReviews.some((review) => review.booking_id === bookingId);
  }

  async function submitReview() {
    if (!selectedBooking || !userId || !selectedBooking.guest_id) return;

    if (!reviewText.trim()) {
      setNotice("Please write a comment before submitting your review.");
      return;
    }

    setSaving(true);
    setNotice("");

    try {
      const { data: existing, error: checkError } = await supabase
        .from("reviews")
        .select("id")
        .eq("booking_id", selectedBooking.id)
        .eq("reviewer_id", userId)
        .eq("review_type", "owner_to_guest")
        .limit(1);

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        setNotice("You've already reviewed this stay.");
        setSelectedBooking(null);
        await loadPage();
        return;
      }

      const { error: insertError } = await supabase
        .from("reviews")
        .insert({
          booking_id: selectedBooking.id,
          property_id: selectedBooking.property_id,
          reviewer_id: userId,
          reviewed_user_id: selectedBooking.guest_id,
          review_type: "owner_to_guest",
          verified_stay: true,
          booking_completed: true,
          rating,
          review_text: reviewText.trim(),
          would_host_again: wouldHostAgain,
        });

      if (insertError) throw insertError;

      setNotice("Your guest review has been submitted successfully.");
      setSelectedBooking(null);
      setRating(5);
      setReviewText("");
      setWouldHostAgain(true);

      await loadPage();
    } catch (err) {
      console.error("Error submitting guest review:", err);
      setNotice(
        err instanceof Error
          ? `Couldn't submit review: ${err.message}`
          : "Couldn't submit your review. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e2eee5",
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 5px 20px rgba(25, 80, 45, 0.04)",
  };

  const headingStyle = {
    color: textColour,
    fontSize: 23,
    margin: "0 0 7px",
  };

  const buttonStyle = {
    background: green,
    color: "#ffffff",
    border: "none",
    borderRadius: 9,
    padding: "12px 17px",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5faf6",
        color: textColour,
        padding: "32px 20px 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <Link
          to="/host-dashboard"
          style={{
            color: darkGreen,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Host Dashboard
        </Link>

        <header style={{ margin: "28px 0" }}>
          <div
            style={{
              display: "inline-block",
              background: paleGreen,
              color: darkGreen,
              padding: "7px 12px",
              borderRadius: 30,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            HOST MANAGEMENT
          </div>

          <h1 style={{ fontSize: 34, margin: "0 0 10px", letterSpacing: -1 }}>
            Reviews & Guest Feedback
          </h1>
          <p style={{ color: muted, margin: 0, lineHeight: 1.6 }}>
            Read guest feedback and review guests who have completed their stays
            at your properties.
          </p>
        </header>

        {notice && (
          <div
            role="status"
            style={{
              background: paleGreen,
              color: darkGreen,
              border: "1px solid #cce8d3",
              borderRadius: 10,
              padding: 14,
              marginBottom: 20,
            }}
          >
            {notice}
          </div>
        )}

        {loading ? (
          <div style={cardStyle}>Loading your reviews…</div>
        ) : error ? (
          <div
            role="alert"
            style={{ ...cardStyle, borderColor: "#efb4b4", color: "#a32121" }}
          >
            <h2 style={{ marginTop: 0 }}>We couldn't load your reviews</h2>
            <p>{error}</p>
            <button style={buttonStyle} onClick={loadPage}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginBottom: 32,
              }}
            >
              <div style={cardStyle}>
                <p style={{ color: muted, margin: "0 0 10px" }}>
                  Reviews from guests
                </p>
                <strong style={{ fontSize: 32 }}>
                  {guestReviews.length}
                </strong>
              </div>

              <div style={cardStyle}>
                <p style={{ color: muted, margin: "0 0 10px" }}>
                  Completed guest stays
                </p>
                <strong style={{ fontSize: 32 }}>{bookings.length}</strong>
              </div>

              <div style={cardStyle}>
                <p style={{ color: muted, margin: "0 0 10px" }}>
                  Guests reviewed by you
                </p>
                <strong style={{ fontSize: 32 }}>{hostReviews.length}</strong>
              </div>
            </div>

            <section style={{ marginBottom: 38 }}>
              <div style={{ marginBottom: 17 }}>
                <h2 style={headingStyle}>Guest reviews for your properties</h2>
                <p style={{ color: muted, margin: 0 }}>
                  Feedback guests have left for you.
                </p>
              </div>

              {guestReviews.length === 0 ? (
                <div style={cardStyle}>
                  <div
                    style={{
                      background: paleGreen,
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ color: green, fontSize: 23 }}>★</span>
                  </div>
                  <h3 style={{ margin: "0 0 8px" }}>No guest reviews yet</h3>
                  <p style={{ color: muted, margin: 0, lineHeight: 1.6 }}>
                    When guests submit reviews for your properties, their
                    ratings and comments will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 15 }}>
                  {guestReviews.map((review) => (
                    <article key={review.id} style={cardStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <h3 style={{ margin: "0 0 7px" }}>
                            {propertyName(review.property_id)}
                          </h3>
                          <p style={{ color: muted, margin: "0 0 10px" }}>
                            From {guestName(review.reviewer_id)}
                          </p>
                        </div>
                        <Stars rating={review.rating} />
                      </div>
                      <p style={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                        {review.review_text || "No written comment provided."}
                      </p>
                      <p style={{ color: muted, fontSize: 13, marginBottom: 0 }}>
                        {formatDate(review.created_at)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div style={{ marginBottom: 17 }}>
                <h2 style={headingStyle}>Review your guests</h2>
                <p style={{ color: muted, margin: 0, lineHeight: 1.6 }}>
                  Leave feedback for guests after their stays are marked as
                  completed.
                </p>
              </div>

              {bookings.length === 0 ? (
                <div style={cardStyle}>
                  <h3 style={{ marginTop: 0 }}>No completed stays to review</h3>
                  <p style={{ color: muted, lineHeight: 1.6 }}>
                    Once a booking is marked completed in your bookings table,
                    it will appear here if you have permission to view it.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 15 }}>
                  {bookings.map((booking) => {
                    const reviewed = alreadyReviewed(booking.id);

                    return (
                      <article key={booking.id} style={cardStyle}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: 16,
                          }}
                        >
                          <div>
                            <h3 style={{ margin: "0 0 8px" }}>
                              {propertyName(booking.property_id)}
                            </h3>
                            <p style={{ margin: "0 0 8px", color: muted }}>
                              Guest:{" "}
                              <strong style={{ color: textColour }}>
                                {guestName(booking.guest_id)}
                              </strong>
                            </p>
                            <p style={{ margin: 0, color: muted, fontSize: 14 }}>
                              {formatDate(booking.check_in)} –{" "}
                              {formatDate(booking.check_out)}
                            </p>
                          </div>

                          {reviewed ? (
                            <span
                              style={{
                                background: paleGreen,
                                color: darkGreen,
                                padding: "9px 12px",
                                borderRadius: 9,
                                fontWeight: 700,
                                fontSize: 13,
                              }}
                            >
                              ✓ Already reviewed
                            </span>
                          ) : booking.guest_id ? (
                            <button
                              style={buttonStyle}
                              onClick={() => {
                                setSelectedBooking(booking);
                                setRating(5);
                                setReviewText("");
                                setWouldHostAgain(true);
                                setNotice("");
                              }}
                            >
                              ★ Leave a Review
                            </button>
                          ) : (
                            <span style={{ color: muted, fontSize: 13 }}>
                              Guest account not linked
                            </span>
                          )}
                        </div>

                        {selectedBooking?.id === booking.id && (
                          <div
                            style={{
                              marginTop: 22,
                              paddingTop: 20,
                              borderTop: "1px solid #e2eee5",
                            }}
                          >
                            <h3 style={{ marginTop: 0 }}>
                              Review {guestName(booking.guest_id)}
                            </h3>

                            <label
                              htmlFor="guest-rating"
                              style={{
                                display: "block",
                                fontWeight: 700,
                                marginBottom: 8,
                              }}
                            >
                              Your rating
                            </label>

                            <div
                              id="guest-rating"
                              style={{ display: "flex", gap: 7, marginBottom: 18 }}
                            >
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  aria-label={`${value} stars`}
                                  onClick={() => setRating(value)}
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                    color: value <= rating ? "#e4a72e" : "#cbd5ce",
                                    fontSize: 32,
                                    cursor: "pointer",
                                    padding: 0,
                                  }}
                                >
                                  ★
                                </button>
                              ))}
                            </div>

                            <label
                              htmlFor="guest-review-text"
                              style={{
                                display: "block",
                                fontWeight: 700,
                                marginBottom: 8,
                              }}
                            >
                              Your comments
                            </label>

                            <textarea
                              id="guest-review-text"
                              value={reviewText}
                              onChange={(event) => setReviewText(event.target.value)}
                              placeholder="How was your experience hosting this guest?"
                              rows={5}
                              maxLength={3000}
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                border: "1px solid #cbdccf",
                                borderRadius: 10,
                                padding: 13,
                                font: "inherit",
                                resize: "vertical",
                                marginBottom: 15,
                              }}
                            />

                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                marginBottom: 20,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={wouldHostAgain}
                                onChange={(event) =>
                                  setWouldHostAgain(event.target.checked)
                                }
                              />
                              I would host this guest again
                            </label>

                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                style={buttonStyle}
                                disabled={saving}
                                onClick={submitReview}
                              >
                                {saving ? "Submitting…" : "Submit Guest Review"}
                              </button>

                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => setSelectedBooking(null)}
                                style={{
                                  background: "#ffffff",
                                  color: textColour,
                                  border: "1px solid #d7e4da",
                                  borderRadius: 9,
                                  padding: "12px 17px",
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        <footer
          style={{
            borderTop: "1px solid #e2eee5",
            marginTop: 40,
            paddingTop: 20,
            color: muted,
            fontSize: 13,
          }}
        >
          Static Holidays · Host Reviews
        </footer>
      </div>
    </main>
  );
}
