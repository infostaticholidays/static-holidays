import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  status: string;
  created_at?: string;
};

type Property = {
  id: string;
  title?: string;
  name?: string;
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please sign in to view your bookings.");
        setLoading(false);
        return;
      }

      const { data: ownedProperties, error: propertiesError } =
        await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", user.id);

      if (propertiesError) {
        setError(propertiesError.message);
        setLoading(false);
        return;
      }

      const propertyList = (ownedProperties ?? []) as Property[];
      setProperties(propertyList);

      if (propertyList.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const propertyIds = propertyList.map((property) => property.id);

      const { data: bookingData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .in("property_id", propertyIds)
        .order("created_at", { ascending: false });

      if (bookingsError) {
        setError(bookingsError.message);
      } else {
        setBookings((bookingData ?? []) as Booking[]);
      }

      setLoading(false);
    }

    loadBookings();
  }, []);

  function propertyName(propertyId: string) {
    const property = properties.find((item) => item.id === propertyId);
    return property?.title || property?.name || "Your property";
  }

  return (
    <main style={{ padding: "40px 24px", maxWidth: 900, margin: "0 auto" }}>
      <h1>Bookings for My Properties</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p role="alert">Could not load bookings: {error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings were found for your properties.</p>
      ) : (
        <div>
          {bookings.map((booking) => (
            <article
              key={booking.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <h2>{propertyName(booking.property_id)}</h2>
              <p>
                <strong>Check-in:</strong> {booking.check_in}
              </p>
              <p>
                <strong>Check-out:</strong> {booking.check_out}
              </p>
              <p>
                <strong>Status:</strong> {booking.status || "Not specified"}
              </p>
              <p>
                <Link to={`/booking/${booking.id}`}>View booking</Link>
              </p>
            </article>
          ))}
        </div>
      )}

      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </main>
  );
}
