import GuestReviewForm from "../components/GuestReviewForm";

export default function BookingDetail() {
  const path = window.location.pathname;
  const id = path.split("/").pop();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Booking #{id}</h1>

      <p>This is a demo booking detail page.</p>

      <GuestReviewForm
        bookingId=""
        propertyId=""
        reviewerId=""
        reviewedUserId=""
      />

      <br />

      <a href="/bookings">← Back to Bookings</a>
    </div>
  );
}
