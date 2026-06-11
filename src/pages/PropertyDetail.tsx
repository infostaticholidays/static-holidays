import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Property = {
  id: string;
  title: string;
  location: string;
  description: string;
  images: string;
  price_per_night: number;
  owner_id: string;
};

export default function PropertyDetail() {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [saved, setSaved] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  async function fetchProperty() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProperty(data);
    setLoading(false);
  }

  // ✅ TOGGLE FAVORITE (prevents duplicates)
  async function toggleFavourite() {
    if (!property) return;

    setSavingFav(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first");
      setSavingFav(false);
      return;
    }

    // check if already exists
    const { data: existing } = await supabase
      .from("favourites")
      .select("*")
      .eq("user_id", user.id)
      .eq("property_id", property.id)
      .maybeSingle();

    if (existing) {
      // remove favourite
      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("id", existing.id);

      if (error) {
        console.error(error);
        alert(error.message);
        setSavingFav(false);
        return;
      }

      setSaved(false);
      setSavingFav(false);
      return;
    }

    // add favourite
    const { error } = await supabase.from("favourites").insert([
      {
        user_id: user.id,
        property_id: property.id,
      },
    ]);

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingFav(false);
      return;
    }

    setSaved(true);
    setSavingFav(false);
  }

  async function createBooking() {
    if (!property) return;

    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }

    setBookingLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first");
      setBookingLoading(false);
      return;
    }

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = nights * property.price_per_night;

    const { error } = await supabase.from("bookings").insert([
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

    setBookingLoading(false);

    if (error) {
      console.error(error);
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

  const nights =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalPrice = nights * property.price_per_night;

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      {/* IMAGE */}
      <img
        src={
          property.images ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        }
        style={{
          width: "100%",
          height: "420px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      {/* TITLE */}
      <h1 style={{ marginTop: "20px" }}>{property.title}</h1>
      <p>📍 {property.location}</p>

      <h2 style={{ color: "#16a34a" }}>
        £{property.price_per_night}/night
      </h2>

      <p style={{ marginTop: "10px" }}>{property.description}</p>

      {/* FAVOURITE BUTTON */}
      <button
        onClick={toggleFavourite}
        disabled={savingFav}
        style={{
          marginTop: "20px",
          background: saved ? "#16a34a" : "#dc2626",
          color: "white",
          border: "none",
          padding: "12px 18px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {savingFav
          ? "Loading..."
          : saved
          ? "❤️ Saved"
          : "🤍 Add to Favourites"}
      </button>

      {/* DATE PICKER */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "#fff",
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
              Nights: {nights}
            </p>

            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              Total Price: £{totalPrice}
            </p>

            {/* BOOK BUTTON */}
            <button
              onClick={createBooking}
              disabled={bookingLoading}
              style={{
                marginTop: "10px",
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "12px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {bookingLoading ? "Booking..." : "Request Booking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
