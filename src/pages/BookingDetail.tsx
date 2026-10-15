```tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string;
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

function formatDate(value: string) {
  if (!value) return "Not set";

  const dateValue = value.slice(0, 10) + "T12:00:00";

  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTimeRemaining(deadline: string | null) {
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

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (bookingError || !bookingData) {
      setError(bookingError?.message || "Booking not found.");
      setLoading(false);
      return;
    }

    const currentBooking = bookingData as Booking;
    setBooking(currentBooking);

    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .select("id, owner_id, title")
      .eq("id", currentBooking.property_id)
      .maybeSingle();

    if (propertyError) {
      setError(propertyError.message);
      setProperty(null);
    } else if (propertyData) {
      setProperty(propertyData as Property);
    } else {
      setProperty(null);
      setError("The property for this booking could not be found.");
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Please sign in as the property owner.");
      return;
    }

    if (property.owner_id !== user.id) {
      setError("Only the property owner can manage this booking.");
      return;
    }

    if (
      booking.status !== "pending" ||
      booking.booking_status !== "pending"
    ) {
      setError(
        "Both booking status fields must be pending before this request can be changed. Refresh the page or check the booking record."
      );
      return;
    }

    if (
      !booking.response_deadline ||
      new Date(booking.response_deadline).getTime() <= Date.now()
    ) {
      setError(
        "The 48-hour response deadline has passed. This request can no longer be changed here."
      );
      return;
    }

    setSaving(true);

    try {
      const { data, error: updateError } = await supabase
        .from("bookings")
        .update({
          status: nextStatus,
          booking_status: nextStatus,
        })
        .eq("id", booking.id)
        .eq("owner_id", user.id)
        .eq("status", "pending")
        .eq("booking_status", "pending")
        .select("*")
        .maybeSingle();

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (!data) {
        setError(
          "The booking could not be updated. It may have changed, or you may not have permission. Refresh and try again."
        );
        await loadBooking();
        return;
      }

      setBooking(data as Booking);

      if (nextStatus === "confirmed") {
        setMessage(
          "Booking accepted. Stripe payment authorisation and capture still need to be connected."
        );
      } else {
        setMessage(
          "Booking declined. The Stripe authorisation cancellation flow still needs to be connected."
        );
      }
    } catch {
      setError("Something went wrong while updating the booking.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main style={{ padding: 40 }}>Loading booking details...</main>;
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
            <div
              style={{
                background: "#f8fafc",
                padding: 16,
                borderRadius: 10,
              }}
            >
              <p style={{ color: "#64748b", fontSize: 12 }}>CHECK-IN</p>
              <strong>{formatDate(booking.check_in)}</strong>
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: 16,
                borderRadius: 10,
              }}
            >
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
              Review the requested dates before making your decision.
              Accepting does not yet capture a payment.
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
            The response deadline has passed. Automatic expiry still needs
            to be configured.
          </p>
        )}
      </div>
    </main>
  );
}
