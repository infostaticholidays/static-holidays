```tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string;
  guest_id: string;
  owner_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  booking_status: string;
  payment_status: string | null;
};

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBooking() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) {
          setError("Please sign in to view this booking.");
          setLoading(false);
        }
        return;
      }

      if (!id || id === "bookings") {
        if (active) {
          setError("No booking ID was provided.");
          setLoading(false);
        }
        return;
      }

      const { data, error: queryError } = await supabase
        .from("bookings")
        .select(
          "id, property_id, guest_id, owner_id, check_in, check_out, total_price, booking_status, payment_status"
        )
        .eq("id", id)
        .eq("guest_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
      } else if (!data) {
        setError("Booking not found, or you don't have permission to view it.");
      } else {
        setBooking(data as Booking);
      }

      setLoading(false);
    }

    void loadBooking();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <main style={{ padding: 40 }}>Loading your booking…</main>;
  }

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Booking details</h1>
        <p>{error}</p>
        <Link to="/bookings">Back to bookings</Link>
      </main>
    );
  }

  if (!booking) return null;

  return (
    <main style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>Booking details</h1>

      <p>
        <strong>Booking reference:</strong> {booking.id}
      </p>
      <p>
        <strong>Check-in:</strong> {booking.check_in}
      </p>
      <p>
        <strong>Check-out:</strong> {booking.check_out}
      </p>
      <p>
        <strong>Total price:</strong>{" "}
        {Number(booking.total_price).toLocaleString("en-GB", {
          style: "currency",
          currency: "GBP",
        })}
      </p>
      <p>
        <strong>Booking status:</strong> {booking.booking_status}
      </p>
      <p>
        <strong>Payment status:</strong> {booking.payment_status || "Not recorded"}
      </p>

      <p>
        <Link to="/bookings">Back to bookings</Link>
      </p>
    </main>
  );
}
```
