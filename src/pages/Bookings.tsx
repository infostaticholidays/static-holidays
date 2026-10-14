```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  booking_status: string;
  payment_status: string | null;
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) {
          setError("Please sign in to view your bookings.");
          setLoading(false);
        }
        return;
      }

      const { data, error: queryError } = await supabase
        .from("bookings")
        .select(
          "id, property_id, check_in, check_out, total_price, booking_status, payment_status"
        )
        .eq("guest_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
      } else {
        setBookings((data || []) as Booking[]);
      }

      setLoading(false);
    }

    void loadBookings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1>My Bookings</h1>

      {loading && <p>Loading your bookings…</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p>You don't have any bookings yet.</p>
      )}

      {!loading &&
        !error &&
        bookings.map((booking) => (
          <article
            key={booking.id}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 12,
              padding: 20,
              marginTop: 16,
            }}
          >
            <h2 style={{ fontSize: 18 }}>
              Booking #{booking.id}
            </h2>

            <p>Check-in: {booking.check_in}</p>
            <p>Check-out: {booking.check_out}</p>

            <p>
              Total:{" "}
              {Number(booking.total_price).toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
              })}
            </p>

            <p>Booking status: {booking.booking_status}</p>
            <p>
              Payment status: {booking.payment_status || "Not recorded"}
            </p>

           <Link to={"/booking/" + booking.id}>
              View booking details
            </Link>
          </article>
        ))}
    </main>
  );
}
```
