export default function BookingDetail() {
  const path = window.location.pathname;
  const id = path.split("/").pop();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Booking #{id}</h1>
      <GuestReviewForm
  bookingId={booking.id}
  propertyId={booking.property_id}
  reviewerId={user.id}
  reviewedUserId={booking.owner_id}
/>

      <p>This is a demo booking detail page.</p>

      <a href="/bookings">← Back to Bookings</a>
    </div>
  );
}
