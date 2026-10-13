
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ReviewsList from "../components/ReviewsList";

type Property = {
  id: string;
  owner_id: string;
  title: string;
  location?: string | null;
  description?: string | null;
  nightly_price?: number | string | null;
  price_per_night?: number | string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sleeps?: number | null;
  pet_friendly?: boolean;
  family_friendly?: boolean;
  equine_friendly?: boolean;
  has_log_burner?: boolean;
  has_garden?: boolean;
  has_pool?: boolean;
  pool_type?: string | null;
  has_hot_tub?: boolean;
  wifi?: boolean;
  parking?: boolean;
  sea_view?: boolean;
  wheelchair_friendly?: boolean;
  holiday_types?: string[] | null;
  features?: string[] | null;
  equine_facilities?: string[] | null;
};

type PropertyImage = {
  id: string;
  public_url: string;
  is_cover: boolean;
  position: number;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const countNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00Z`).getTime();
  const end = new Date(`${checkOut}T00:00:00Z`).getTime();

  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

export default function PropertyDetail() {
  const { id } = useParams();
  const propertyId = id ?? "";

  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProperty() {
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (cancelled) return;

      if (error || !data) {
        console.error("Could not load property:", error);
        setProperty(null);
        setLoading(false);
        return;
      }

      setProperty(data as Property);

      const { data: imageRows, error: imageError } = await supabase
        .from("property_images")
        .select("id, public_url, is_cover, position")
        .eq("property_id", propertyId)
        .order("position", { ascending: true });

      if (cancelled) return;

      if (imageError) {
        console.error("Could not load property photos:", imageError);
        setImages([]);
      } else {
        const orderedImages = (imageRows ?? []) as PropertyImage[];
        orderedImages.sort(
          (a, b) => Number(b.is_cover) - Number(a.is_cover)
        );
        setImages(orderedImages);
      }

      setLoading(false);
    }

    loadProperty();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  useEffect(() => {
    if (!property) return;

    let cancelled = false;

    async function loadFavourite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        setSaved(false);
        return;
      }

      const { data, error } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", property!.id)
        .maybeSingle();

      if (!cancelled) {
        if (error) console.error("Could not check favourite:", error);
        setSaved(!!data);
      }
    }

    loadFavourite();

    return () => {
      cancelled = true;
    };
  }, [property]);

  async function toggleFavourite() {
    if (!property || savingFav) return;

    setSavingFav(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in first.");
        return;
      }

      const { data: existing, error: lookupError } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", property.id)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (existing) {
        const { error } = await supabase
          .from("favourites")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;
        setSaved(false);
      } else {
        const { error } = await supabase.from("favourites").insert({
          user_id: user.id,
          property_id: property.id,
        });

        if (error) throw error;
        setSaved(true);
      }
    } catch (error) {
      console.error("Could not update favourite:", error);
      alert(error instanceof Error ? error.message : "Could not update favourite.");
    } finally {
      setSavingFav(false);
    }
  }

  async function createBooking() {
    if (!property || bookingLoading) return;

    if (!startDate || !endDate) {
      alert("Please select your check-in and check-out dates.");
      return;
    }

    const nights = countNights(startDate, endDate);

    if (startDate < today() || nights <= 0) {
      alert("Please choose valid dates. Check-out must be after check-in.");
      return;
    }

    const price = Number(
      property.nightly_price ?? property.price_per_night ?? 0
    );

    if (!Number.isFinite(price) || price <= 0) {
      alert("This property does not have a valid nightly price yet.");
      return;
    }

    setBookingLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in before requesting a booking.");
        return;
      }

      if (user.id === property.owner_id) {
        alert("You cannot book your own property.");
        return;
      }

      const { error } = await supabase.from("bookings").insert({
        property_id: property.id,
        owner_id: property.owner_id,
        guest_id: user.id,
        check_in: startDate,
        check_out: endDate,
        total_price: nights * price,
        booking_status: "pending",
      });

      if (error) throw error;

      alert("Booking request sent!");
    } catch (error) {
      console.error("Could not create booking:", error);
      alert(error instanceof Error ? error.message : "Could not send booking request.");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return <h2 style={{ padding: 40 }}>Loading property...</h2>;
  }

  if (!property) {
    return <h2 style={{ padding: 40 }}>Property not found.</h2>;
  }

  const price = Number(
    property.nightly_price ?? property.price_per_night ?? 0
  );
  const nights = countNights(startDate, endDate);
  const totalPrice = nights > 0 && price > 0 ? nights * price : 0;

  const amenities = [
    property.family_friendly && "Family friendly",
    property.pet_friendly && "Pet friendly",
    property.equine_friendly && "Equine friendly",
    property.has_log_burner && "Log burner",
    property.has_garden && "Garden",
    property.has_hot_tub && "Hot tub",
    property.has_pool && `Swimming pool${property.pool_type && property.pool_type !== "none" ? ` (${property.pool_type})` : ""}`,
    property.wifi && "Wi-Fi",
    property.parking && "Parking",
    property.sea_view && "Sea view",
    property.wheelchair_friendly && "Wheelchair friendly",
  ].filter(Boolean) as string[];

  const allImages = images.length
    ? images
    : [{ id: "fallback", public_url: fallbackImage, is_cover: true, position: 0 }];

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 20px 48px",
        color: "#24312b",
      }}
    >
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 12,
          }}
        >
          {allImages.map((image, index) => (
            <img
              key={image.id}
              src={image.public_url}
              alt={`${property.title} photo ${index + 1}`}
              onError={(event) => {
                const target = event.currentTarget;
                if (target.src !== fallbackImage) {
                  target.src = fallbackImage;
                }
              }}
              style={{
                width: "100%",
                height: index === 0 ? 420 : 200,
                objectFit: "cover",
                borderRadius: 14,
                gridColumn: index === 0 && allImages.length > 1 ? "span 2" : undefined,
                background: "#f0f2ef",
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <h1 style={{ fontSize: 34, marginBottom: 8 }}>
            {property.title}
          </h1>

          {property.location && <p>📍 {property.location}</p>}

          <p style={{ color: "#526158" }}>
            {property.bedrooms != null && `${property.bedrooms} bedrooms`}
            {property.bathrooms != null && ` · ${property.bathrooms} bathrooms`}
            {property.sleeps != null && ` · Sleeps ${property.sleeps}`}
          </p>

          <h2 style={{ color: "#167348", margin: "18px 0" }}>
            {price > 0 ? `£${price.toLocaleString("en-GB")} / night` : "Price to be confirmed"}
          </h2>

          {property.description && (
            <p style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {property.description}
            </p>
          )}
        </div>

        {amenities.length > 0 && (
          <section style={{ marginTop: 28 }}>
            <h2>What this property offers</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 12,
              }}
            >
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  style={{
                    background: "#eef5ef",
                    border: "1px solid #d8e6da",
                    borderRadius: 20,
                    padding: "8px 13px",
                  }}
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </section>
        )}

        {property.holiday_types && property.holiday_types.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <h2>Holiday types</h2>
            <p>{property.holiday_types.join(" · ")}</p>
          </section>
        )}

        {property.equine_facilities && property.equine_facilities.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <h2>Equine facilities</h2>
            <p>{property.equine_facilities.join(" · ")}</p>
          </section>
        )}

        {property.features && property.features.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <h2>More features</h2>
            <p>{property.features.join(" · ")}</p>
          </section>
        )}
      </section>

      <button
        onClick={toggleFavourite}
        disabled={savingFav}
        style={{
          marginTop: 24,
          background: saved ? "#167348" : "#fff",
          color: saved ? "#fff" : "#24312b",
          border: "1px solid #cbd5ce",
          padding: "12px 18px",
          borderRadius: 9,
          cursor: savingFav ? "wait" : "pointer",
        }}
      >
        {savingFav ? "Saving..." : saved ? "♥ Saved to Favourites" : "♡ Add to Favourites"}
      </button>

      <section
        style={{
          marginTop: 36,
          padding: 24,
          borderRadius: 14,
          border: "1px solid #e0e7e1",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Select Dates</h2>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <label style={{ display: "grid", gap: 8 }}>
            Check-in
            <input
              type="date"
              value={startDate}
              min={today()}
              onChange={(event) => {
                setStartDate(event.target.value);
                if (endDate && event.target.value >= endDate) {
                  setEndDate("");
                }
              }}
              style={{ padding: 10, border: "1px solid #cbd5ce", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            Check-out
            <input
              type="date"
              value={endDate}
              min={startDate || today()}
              onChange={(event) => setEndDate(event.target.value)}
              style={{ padding: 10, border: "1px solid #cbd5ce", borderRadius: 8 }}
            />
          </label>
        </div>

        {nights > 0 && (
          <div style={{ marginTop: 20, lineHeight: 1.8 }}>
            <p>Check-in: <strong>{new Date(`${startDate}T00:00:00`).toLocaleDateString("en-GB")}</strong></p>
            <p>Check-out: <strong>{new Date(`${endDate}T00:00:00`).toLocaleDateString("en-GB")}</strong></p>
            <p>Nights: <strong>{nights}</strong></p>
            <p>Total: <strong>{price > 0 ? `£${totalPrice.toLocaleString("en-GB")}` : "Price to be confirmed"}</strong></p>

            <button
              onClick={createBooking}
              disabled={bookingLoading || price <= 0}
              style={{
                marginTop: 10,
                background: "#167348",
                color: "white",
                border: "none",
                padding: "13px 20px",
                borderRadius: 9,
                cursor: bookingLoading ? "wait" : "pointer",
              }}
            >
              {bookingLoading ? "Sending request..." : "Request Booking"}
            </button>
          </div>
        )}
      </section>

      <section style={{ marginTop: 36 }}>
        <h2>⭐ Reviews</h2>
        <ReviewsList propertyId={property.id} />
      </section>
    </main>
  );
}
