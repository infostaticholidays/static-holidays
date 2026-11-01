import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string;
    guest_id: string | null;
  owner_id?: string | null;
  check_in: string;
  check_out: string;
  status: string | null;
  booking_status: string | null;
  created_at: string;
  response_deadline: string | null;
};

type Property = {
  id: string;
  owner_id: string;
  title?: string;
};
type GuestProfile = {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

type GuestReview = {
  id: string;
  rating: number | null;
  review_text: string | null;
  created_at: string | null;
  would_host_again: boolean | null;
};


function formatDate(value: string | null | undefined): string {
  if (!value) return "Not set";

  const date = new Date(value.slice(0, 10) + "T12:00:00");

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTimeRemaining(deadline: string | null): string {
  if (!deadline) return "Deadline unavailable";

  const remaining = new Date(deadline).getTime() - Date.now();

  if (remaining <= 0) return "Response deadline passed";

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);

  return hours + " hours " + minutes + " minutes remaining";
}

export default function BookingDetail() {
  const { id } = useParams();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [guestProfile, setGuestProfile] = useState<GuestProfile | null>(null);
const [guestReviews, setGuestReviews] = useState<GuestReview[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBooking() {
    setLoading(true);
    setError("");

    if (!id) {
      setError("Booking reference is missing.");
      setLoading(false);
      return;
    }

    try {
      const result = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (result.error || !result.data) {
        setError(result.error?.message || "Booking not found.");
        setBooking(null);
        setProperty(null);
        setLoading(false);
        return;
      }

      const currentBooking = result.data as Booking;
      setBooking(currentBooking);

      if (!currentBooking.property_id) {
        setProperty(null);
        setError("This booking has no linked property.");
        setLoading(false);
        return;
      }

      const propertyResult = await supabase
        .from("properties")
        .select("id, owner_id, title")
        .eq("id", currentBooking.property_id)
        .maybeSingle();

      if (propertyResult.error || !propertyResult.data) {
        setProperty(null);
        setError(
          propertyResult.error?.message ||
            "The property for this booking could not be found."
        );
      } else {
        setProperty(propertyResult.data as Property);
      }
if (currentBooking.guest_id) {
  const profileResult = await supabase
    .from("profiles")
   .select("id, full_name, first_name, last_name, email")
    .eq("id", currentBooking.guest_id)
    .maybeSingle();

  if (profileResult.error) throw profileResult.error;

  setGuestProfile(profileResult.data as GuestProfile | null);
  console.log("Guest profile lookup:", profileResult);

  const reviewsResult = await supabase
    .from("reviews")
    .select("id, rating, review_text, created_at, would_host_again")
    .eq("reviewed_user_id", currentBooking.guest_id)
    .eq("review_type", "owner_to_guest")
  
 .order("created_at", { ascending: false });

  if (reviewsResult.error) throw reviewsResult.error;

  setGuestReviews((reviewsResult.data ?? []) as GuestReview[]);
} else {
  setGuestProfile(null);
  setGuestReviews([]);
}
      
    } catch {
      setError("Unable to load the booking. Please try again.");
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadBooking();
  }, [id]);


  async function updateStatus(nextStatus: "confirmed" | "declined") {
    if (!booking || !property || saving) return;

    setError("");
    setMessage("");

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError("Please sign in as the property owner.");
        return;
      }

      if (property.owner_id !== userData.user.id) {
        setError("Only the property owner can manage this booking.");
        return;
      }

      if (
        booking.status !== "pending" ||
        booking.booking_status !== "pending"
      ) {
        setError("This booking is no longer pending. Please refresh the page.");
        return;
      }

      if (
        !booking.response_deadline ||
        new Date(booking.response_deadline).getTime() <= Date.now()
      ) {
        setError("The response deadline has passed or is missing.");
        return;
      }

      setSaving(true);

      const { data, error: functionError } =
        await supabase.functions.invoke("owner-respond-booking", {
          body: {
            bookingId: booking.id,
            action: nextStatus === "confirmed" ? "accept" : "decline",
          },
        });

      if (functionError) {
        throw new Error(
          functionError.message ||
            "The booking response function could not be reached."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.error || "The booking could not be updated."
        );
      }

      setMessage(
        data.message ||
          (nextStatus === "confirmed"
            ? "Booking accepted and payment captured."
            : "Booking declined and authorisation cancelled.")
      );

      await loadBooking();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

   if (loading) {
    return (
      <main style={{ padding: 40 }}>
        Loading booking details...
      </main>
    );
  }

  if (!booking) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Booking not found</h1>
        <p>{error}</p>
        <Link to="/host-bookings">Back to bookings</Link>
      </main>
    );
  }

  const status = (
    booking.booking_status ||
    booking.status ||
    "Not specified"
  ).trim();

  const isPending = status.toLowerCase() === "pending";
  const deadlinePassed =
    !booking.response_deadline ||
    new Date(booking.response_deadline).getTime() <= Date.now();

  const ratedReviews = guestReviews.filter(
    (review) => review.rating !== null
  );

  const averageGuestRating =
    ratedReviews.length > 0
      ? ratedReviews.reduce(
          (total, review) => total + (review.rating ?? 0),
          0
        ) / ratedReviews.length
      : null;

  const wouldHostAgainReviews = guestReviews.filter(
    (review) => review.would_host_again !== null
  );

  const wouldHostAgainPercentage =
    wouldHostAgainReviews.length > 0
      ? Math.round(
          (wouldHostAgainReviews.filter(
            (review) => review.would_host_again === true
          ).length /
            wouldHostAgainReviews.length) *
            100
        )
      : null;

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
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <Link
          to="/host-bookings"
          style={{ color: "#52647a", textDecoration: "none" }}
        >
          Back to bookings
        </Link>

        <header style={{ margin: "28px 0" }}>
          <p
            style={{
              color: "#64748b",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            HOST MANAGEMENT
          </p>

          <h1 style={{ fontSize: 32, marginBottom: 8 }}>
            Booking details
          </h1>

          <p style={{ color: "#64748b", overflowWrap: "anywhere" }}>
            Reference: {booking.id}
          </p>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: 16,
              borderRadius: 10,
              marginBottom: 18,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: 16,
              borderRadius: 10,
              marginBottom: 18,
            }}
          >
            {message}
          </div>
        )}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e7ebf0",
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <p style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>
            PROPERTY
          </p>

          <h2 style={{ marginTop: 0 }}>
            {property?.title || "Your holiday property"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 16,
            }}
          >
            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 10 }}>
              <p style={{ color: "#64748b", fontSize: 12 }}>CHECK-IN</p>
              <strong>{formatDate(booking.check_in)}</strong>
            </div>

            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 10 }}>
              <p style={{ color: "#64748b", fontSize: 12 }}>CHECK-OUT</p>
              <strong>{formatDate(booking.check_out)}</strong>
            </div>
          </div>

          <p style={{ marginTop: 22 }}>
            <strong>Current status: </strong>
            <span
              style={{
                display: "inline-block",
                background: isPending ? "#fef3c7" : "#e5e7eb",
                color: isPending ? "#92400e" : "#374151",
                borderRadius: 20,
                padding: "6px 12px",
                fontWeight: 700,
              }}
            >
              {status}
            </span>
          </p>

          {isPending && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 12,
                padding: 16,
                marginTop: 20,
              }}
            >
              <strong>Owner response deadline</strong>
              <p style={{ marginBottom: 0 }}>
                {getTimeRemaining(booking.response_deadline)}
              </p>
            </div>
          )}
        </section>
<section
  style={{
    background: "#fff",
    border: "1px solid #e7ebf0",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  }}
>
  <h2 style={{ marginTop: 0 }}>Guest information</h2>

   <p>
    <strong>Guest name: </strong>
    {guestProfile?.full_name?.trim() ||
      [guestProfile?.first_name, guestProfile?.last_name]
        .filter((name) => name?.trim())
        .join(" ") ||
      guestProfile?.email ||
      "Guest"}
  </p>

  <h3>Previous host reviews</h3>
  <div
    style={{
      background: "#f8fafc",
      borderRadius: 12,
      padding: 18,
      marginTop: 18,
      marginBottom: 20,
    }}
  >
    <h3 style={{ marginTop: 0 }}>Guest rating</h3>

    <p style={{ fontSize: 28, fontWeight: 700, margin: "8px 0" }}>
      {averageGuestRating !== null
        ? `${averageGuestRating.toFixed(1)} / 5`
        : "No rating yet"}
    </p>

    <p style={{ color: "#e4a72e", fontSize: 22, margin: "4px 0" }}>
      {averageGuestRating !== null
        ? "★".repeat(Math.round(averageGuestRating)) +
          "☆".repeat(5 - Math.round(averageGuestRating))
        : "☆☆☆☆☆"}
    </p>

    <p style={{ color: "#64748b", marginBottom: 8 }}>
      Based on {ratedReviews.length} rated reviews
    </p>

    <p style={{ color: "#64748b", marginBottom: 0 }}>
      Would host again:{" "}
      <strong>
        {wouldHostAgainPercentage !== null
          ? `${wouldHostAgainPercentage}%`
          : "No data yet"}
      </strong>
    </p>
  </div>
  {guestReviews.length === 0 ? (
    <p style={{ color: "#64748b" }}>
      This guest has no previous host reviews.
    </p>
  ) : (
       (showAllReviews ? guestReviews : guestReviews.slice(0, 5)).map((review) => (
      <article
        key={review.id}
        style={{
          borderTop: "1px solid #e7ebf0",
          paddingTop: 14,
          marginTop: 14,
        }}
      >
        <p style={{ color: "#e4a72e", fontSize: 20 }}>
          {"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating ?? 0))))}
          {"☆".repeat(5 - Math.max(0, Math.min(5, Math.round(review.rating ?? 0))))}
          <span style={{ color: "#64748b", fontSize: 13, marginLeft: 8 }}>
            {review.rating ?? "No rating"} / 5
          </span>
        </p>

        <p style={{ lineHeight: 1.6 }}>
          {review.review_text || "No written comment."}
        </p>

        {review.would_host_again !== null && (
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {review.would_host_again
              ? "✓ Previous host would host this guest again"
              : "Previous host would not host this guest again"}
          </p>
        )}

        <p style={{ color: "#64748b", fontSize: 13 }}>
          {review.created_at
            ? new Date(review.created_at).toLocaleDateString("en-GB")
            : ""}
        </p>
      </article>
    ))
  )}
    {guestReviews.length > 5 && (
    <button
      type="button"
      onClick={() => setShowAllReviews(!showAllReviews)}
      style={{
        background: "transparent",
        color: "#2563eb",
        border: "1px solid #2563eb",
        borderRadius: 8,
        padding: "10px 16px",
        fontWeight: 700,
        cursor: "pointer",
        marginTop: 16,
      }}
    >
      {showAllReviews ? "Show fewer reviews" : "Show all reviews"}
    </button>
  )}
</section>



        
        {property && isPending && !deadlinePassed && (
          <section
            style={{
              background: "#fff",
              border: "1px solid #e7ebf0",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Your decision</h2>

           <p style={{ color: "#64748b" }}>
  Review the requested dates before deciding. Accepting will ask
  Stripe to capture the authorised payment. Declining will ask
  Stripe to cancel the authorisation.
</p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                disabled={saving}
                onClick={() => void updateStatus("confirmed")}
                style={{
                  background: "#166534",
                  color: "#fff",
                  border: 0,
                  borderRadius: 9,
                  padding: "13px 20px",
                  fontWeight: 700,
                  cursor: saving ? "wait" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Accept booking"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => void updateStatus("declined")}
                style={{
                  background: "#991b1b",
                  color: "#fff",
                  border: 0,
                  borderRadius: 9,
                  padding: "13px 20px",
                  fontWeight: 700,
                  cursor: saving ? "wait" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Decline booking"}
              </button>
            </div>
          </section>
        )}

        {isPending && deadlinePassed && (
          <p>
            The response deadline has passed or is missing. Automatic expiry
            still needs to be configured.
          </p>
        )}
      </div>
    </main>
  );
}
