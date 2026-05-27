import { Link } from "wouter";

export default function Bookings() {
  const bookings = [
    {
      id: 1,
      propertyTitle: "Luxury Caravan Retreat",
      propertyLocation: "Cornwall",
      checkIn: "2025-08-01",
      checkOut: "2025-08-07",
      totalPrice: 650,
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Bookings</h1>

      {bookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{b.propertyTitle}</h3>
          <p>{b.propertyLocation}</p>
          <p>
            {b.checkIn} → {b.checkOut}
          </p>
          <p>£{b.totalPrice}</p>

          <Link href={`/bookings/${b.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
