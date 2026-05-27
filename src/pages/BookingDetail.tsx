import { useParams } from "wouter";

export default function BookingDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Booking #{id}</h1>
      <p>This is a demo booking page.</p>
    </div>
  );
}
