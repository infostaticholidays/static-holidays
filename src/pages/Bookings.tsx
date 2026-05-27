import { useListBookings } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Bookings() {
  const { data: bookings, isLoading } = useListBookings({ role: "guest" });

  if (isLoading) return <div>Loading bookings...</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Bookings</h1>

      {!bookings?.length ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            style={{
              padding: "20px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>{b.propertyTitle}</h3>

            <p>{b.propertyLocation}</p>

            <p>
              {format(new Date(b.checkIn), "MMM d")} -{" "}
              {format(new Date(b.checkOut), "MMM d")}
            </p>

            <p>£{b.totalPrice}</p>

            <Link href={`/bookings/${b.id}`}>View Details</Link>
          </div>
        ))
      )}
    </div>
  );
}
