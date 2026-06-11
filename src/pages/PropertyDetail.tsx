import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PropertyDetail() {
  const { id } = useParams();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
 const [saved, setSaved] = useState(false);
  useEffect(() => {
    fetchProperty();
  }, []);

  async function fetchProperty() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProperty(data);
    setLoading(false);
  }

  async function createBooking() {
    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first");
      return;
    }

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const totalPrice = nights * property.price_per_night;

    const { error } = await supabase
      .from("bookings")
      .insert([
        {
          property_id: property.id,
          owner_id: property.owner_id,
          guest_id: user.id,

          check_in: startDate.toISOString(),
          check_out: endDate.toISOString(),

          total_price: totalPrice,
          booking_status: "pending",
        },
      ]);

    if (error) {
      console.error("BOOKING ERROR:", error);
      alert(error.message);
      return;
    }

    alert("Booking request sent!");
  }

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  if (!property) {
    return <h2 style={{ padding: "40px" }}>Property not found</h2>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <img
        src={
          property.images ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        }
        alt={property.title}
        style={{
          width: "100%",
          height: "450px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      <h1 style={{ marginTop: "20px" }}>{property.title}</h1>

      <p>📍 {property.location}</p>

      <h2 style={{ color: "#16a34a" }}>
        £{property.price_per_night}/night
      </h2>

      <p style={{ marginTop: "20px" }}>{property.description}</p>

      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Select Your Dates</h2>

        <DatePicker
          selected={startDate}
          onChange={(dates) => {
            const [start, end] = dates as [Date | null, Date | null];
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          minDate={new Date()}
          inline
        />

        {startDate && endDate && (
          <div style={{ marginTop: "20px" }}>
            <p>
              Check In: {startDate.toLocaleDateString("en-GB")}
            </p>

            <p>
              Check Out: {endDate.toLocaleDateString("en-GB")}
            </p>

            <p style={{ fontWeight: "bold", color: "#16a34a" }}>
              Nights:{" "}
              {Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </p>

            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              Total Price: £
              {Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              ) * property.price_per_night}
            </p>
async function saveFavourite() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please log in first");
    return;
  }

  const { error } = await supabase
    .from("favourites")
    .insert([
      {
        user_id: user.id,
        property_id: property.id,
      },
    ]);

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  setSaved(true);
  alert("❤️ Property added to favourites!");
}
            <button
              onClick={createBooking}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Request Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
