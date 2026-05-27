import { useGetBooking } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { format } from "date-fns";

export default function BookingDetail() {
  const { id } = useParams();
  const bookingId = parseInt(id || "0", 10);

  const { data: booking, isLoading } = useGetBooking(bookingId, {
    query: { enabled: !!bookingId },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Booking #{booking.id}</h1>

      <h2>{booking.propertyTitle}</h2>

      <p>{booking.propertyLocation}</p>

      <p>
        {format(new Date(booking.checkIn), "PPP")} -{" "}
        {format(new Date(booking.checkOut), "PPP")}
      </p>

      <p>Guests: {booking.guests}</p>

      <p>Total: £{booking.totalPrice}</p>
    </div>
  );
}
