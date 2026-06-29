import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ReviewsList from "../components/ReviewsList";

export default function PropertyDetail() {
  const { id } = useParams();
  const propertyId = id ?? "";

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [saved, setSaved] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // -----------------------------
  // LOAD PROPERTY
  // -----------------------------
  useEffect(() => {
    if (propertyId) fetchProperty();
  }, [propertyId]);

  async function fetchProperty() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (error) {
      console.error(error);
      setProperty(null);
      setLoading(false);
      return;
    }

    setProperty(data);
    setLoading(false);
  }

  // -----------------------------
  // CHECK IF FAVOURITED
  // -----------------------------
  useEffect(() => {
    if (property) checkFavourite();
  }, [property]);

  async function checkFavourite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !property) return;

    const { data } = await supabase
      .from("favourites")
      .select("*")
      .eq("user_id", user.id)
      .eq("property_id", property.id)
      .maybeSingle();

    setSaved(!!data);
  }

  // -----------------------------
  // TOGGLE FAVOURITE
  // -----------------------------
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

    const { data: existing } = await supabase
      .from("favourites")
      .select("*")
      .eq("user_id", user.id)
      .eq("property_id", property.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("id", existing.id);

      if (error) {
        alert(error.message);
        setSavingFav(false);
        return;
      }

      setSaved(false);
      setSavingFav(false);
      return;
    }

    const { error } = await supabase.from("favourites").insert([
      {
        user_id: user.id,
        property_id: property.id,
      },
    ]);

    if (error) {
      alert(error.message);
      setSavingFav(false);
      return;
    }

    setSaved(true);
    setSavingFav(false);
  }

  // -----------------------------
  // CREATE BOOKING
  // -----------------------------
  async function createBooking() {
    if (!property) return;

    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      alert("Invalid date range");
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

    const totalPrice = nights * property.price_per_night;

    const { error } = await supabase.from("bookings").insert([
      {
        property_id: property.id,
        owner_id: property.owner_id,
        guest_id: user.id,
        check_in: start.toISOString(),
        check_out: end.toISOString(),
        total_price: totalPrice,
        booking_status: "pending",
      },
    ]);

    setBookingLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Booking request sent!");
  }

  // -----------------------------
  // LOADING STATES
  // -----------------------------
  if (loading) return <h2 style={{ padding: 40 }}>Loading...</h2>;
  if (!property) return <h2 style={{ padding: 40 }}>Property not found</h2>;

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const nights =
    start && end
      ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const totalPrice = nights * property.price_per_night;

  const imageUrl = Array.isArray(property.images)
    ? property.images[0]
    : property.images;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <img
        src={
          imageUrl ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        }
        style={{
          width: "100%",
          height: 420,
          objectFit: "cover",
          borderRadius: 12,
        }}
      />

      <h1 style={{ marginTop: 20 }}>{property.title}</h1>
      <p>📍 {property.location}</p>

      <h2 style={{ color: "#16a34a" }}>
        £{property.price_per_night}/night
      </h2>

      <p>{property.description}</p>

      {/* FAVOURITE */}
      <button
        onClick={toggleFavourite}
        disabled={savingFav}
        style={{
          marginTop: 20,
          background: saved ? "#16a34a" : "#dc2626",
          color: "white",
          border: "none",
          padding: "12px 18px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {savingFav ? "Loading..." : saved ? "❤️ Saved" : "🤍 Add to Favourites"}
      </button>

      {/* DATE PICKER (NO LIBRARY) */}
      <div
        style={{
          marginTop: 40,
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Select Dates</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div>
            <p>Check-in</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <p>Check-out</p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {startDate && endDate && (
          <div style={{ marginTop: 20 }}>
            <p>Check-in: {new Date(startDate).toLocaleDateString("en-GB")}</p>
            <p>Check-out: {new Date(endDate).toLocaleDateString("en-GB")}</p>

            <p>
              Nights: <b>{nights}</b>
            </p>

            <p>
              Total: <b>£{totalPrice}</b>
            </p>
<ReviewsList />
            <button
              onClick={createBooking}
              disabled={bookingLoading}
              style={{
                marginTop: 10,
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "12px 18px",
                borderRadius: 8,
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
