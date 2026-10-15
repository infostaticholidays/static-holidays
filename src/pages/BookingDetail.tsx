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
      setError("Please sign in as the property owner to manage this booking.");
      return;
    }

    if (property.owner_id !== user.id) {
      setError("Only the owner of this property can manage this booking.");
      return;
    }

    const currentStatus = (
      booking.booking_status || booking.status || ""
    ).trim().toLowerCase();

    if (
      currentStatus !== "pending" ||
      (booking.status &&
        booking.status.toLowerCase() !== "pending") ||
      (booking.booking_status &&
        booking.booking_status.toLowerCase() !== "pending")
    ) {
      setError("This booking is no longer pending and cannot be changed here.");
      return;
    }

    if (
      !booking.response_deadline ||
      new Date(booking.response_deadline).getTime() <= Date.now()
    ) {
      setError(
        "The 48-hour response deadline has passed. This request can no longer be accepted or declined here."
      );
      return;
    }

    setSaving(true);

    try {
      let query = supabase
        .from("bookings")
        .update({
          status: nextStatus,
          booking_status: nextStatus,
        })
        .eq("id", booking.id)
        .eq("owner_id", user.id);

      if (booking.status === "pending") {
        query = query.eq("status", "pending");
      }

      if (booking.booking_status === "pending") {
        query = query.eq("booking_status", "pending");
      }

      const { data, error: updateError } = await query
        .select("*")
        .maybeSingle();

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (!data) {
        setError(
          "The booking may have changed or your account does not have permission to update it. Refresh the page and try again."
        );
        await loadBooking();
        return;
      }

      setBooking(data as Booking);

      setMessage(
        nextStatus === "confirmed"
          ? "Booking accepted. The guest payment step still needs to be connected before the guest can pay."
          : "Booking declined. No payment has been initiated by this action."
      );
    } catch {
      setError("Something went wrong while updating the booking.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main style={{ padding: 40 }}>Loading booking details…</main>;
  }

  if (!booking) {
    return (
      <main style={{
