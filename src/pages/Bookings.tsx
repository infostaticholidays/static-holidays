export default function BookingDetail() {
  const path = window.location.pathname;
  const id = path.split("/").pop();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Booking #{id}</h1>
      <p>This is a demo booking page.</p>

      <a href="/bookings">Back to bookings</a>
    </div>
  );
}
