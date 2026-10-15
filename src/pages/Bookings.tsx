```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Booking = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  booking_status: string | null;
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("bookings")
        .select("id, property_id, check_in, check_out, booking_status")
        .order("check_in", { ascending: true });

      if (error) {
        console.error("Could not load bookings:", error);
        setError(error.message);
      } else {
        setBookings((data ?? []) as Booking[]);
      }

      setLoading(false);
    }

    loadBookings();
  }, []);

  return (
    <main
      style={{
        padding: "40px 24px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1>My Bookings</h1>

      {loading && <p>Loading bookings...</p>}

      {error && (
        <p role="alert">
          Could not load bookings: {error}
        </p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p>No bookings were returned. This may be due to your account
          permissions or because there are no visible records.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: 12 }}>Property ID</th>
                <th style={{ padding: 12 }}>Check-in</th>
                <th style={{ padding: 12 }}>Check-out</th>
                <th style={{ padding: 12 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={{ padding: 12 }}>
                    {booking.property_id}
                  </td>
                  <td style={{ padding: 12 }}>
                    {booking.check_in}
                  </td>
                  <td style={{ padding: 12 }}>
                    {booking.check_out}
                  </td>
                  <td style={{ padding: 12 }}>
                    {booking.booking_status ?? "Unknown"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: 24 }}>
        <Link to="/">Back to Home</Link>
      </p>
    </main>
  );
}
```
