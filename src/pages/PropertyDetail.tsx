
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f6f8f5",
  color: "#203128",
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  padding: "30px 18px 64px",
};

const cardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e3eae3",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 3px 12px rgba(31, 54, 39, 0.035)",
};

const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "#176b50",
  color: "#fff",
  border: "1px solid #176b50",
  borderRadius: 10,
  padding: "13px 18px",
  fontSize: 13,
  fontWeight: 750,
  textDecoration: "none",
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "#fff",
  color: "#176b50",
  border: "1px solid #d7e1d8",
  borderRadius: 10,
  padding: "12px 16px",
  fontSize: 13,
  fontWeight: 700,
  textDecoration: "none",
  cursor: "pointer",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 21,
  letterSpacing: "-0.5px",
  margin: "0 0 8px",
  color: "#203128",
};

function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function countNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00Z`).getTime();
  const end = new Date(`${checkOut}T00:00:00Z`).getTime();

  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const propertyId = id ?? "";

  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProperty() {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .maybeSingle();

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
      } catch (error) {
        console.error("Could not load property:", error);
        if (!cancelled) {
          setProperty(null);
          setLoading(false);
        }
      }
    }

    void loadProperty();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  useEffect(() => {
    let cancelled = false;

    async function loadUserAndFavourite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      setCurrentUserId(user?.id ?? null);

      if (!user || !property) {
        setSaved(false);
        return;
      }

      const { data, error } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", property.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Could not check favourite:", error);
      }

      setSaved(!!data);
    }

    void loadUserAndFavourite();

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
        navigate("/login");
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
      alert(
        error instanceof Error
          ? error.message
          : "Could not update your favourites."
      );
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

    if (!Number.isFinite(price) || price <= 0) {
      alert("The owner has not set a valid nightly price yet.");
      return;
    }

    setBookingLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in before requesting a booking.");
        navigate("/login");
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
      navigate("/bookings");
    } catch (error) {
      console.error("Could not create booking:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not send your booking request."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  function scrollToCalendar() {
    document.getElementById("availability-calendar")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: 1100, margin: "60px auto", ...cardStyle }}>
          Loading property details…
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: 800, margin: "50px auto", ...cardStyle }}>
          <h1 style={sectionTitleStyle}>Property not found</h1>
          <p style={{ color: "#738077", lineHeight: 1.7 }}>
            This property may have been removed, or it may not be available.
          </p>
          <button
            type="button"
            onClick={() => navigate("/properties")}
            style={primaryButtonStyle}
          >
            Browse properties
          </button>
        </div>
      </main>
    );
  }

  const rawPrice = property.nightly_price ?? property.price_per_night;
  const price =
    rawPrice !== null &&
    rawPrice !== undefined &&
    String(rawPrice).trim() !== ""
      ? Number(rawPrice)
      : 0;

  const validPrice = Number.isFinite(price) && price > 0;
  const nights = countNights(startDate, endDate);
  const totalPrice = nights > 0 && validPrice ? nights * price : 0;
  const isOwner = currentUserId === property.owner_id;

  const amenities = [
    property.family_friendly && "Family friendly",
    property.pet_friendly && "Pet friendly",
    property.equine_friendly && "Equine friendly",
    property.has_log_burner && "Log burner",
    property.has_garden && "Garden",
    property.has_hot_tub && "Hot tub",
    property.has_pool &&
      `Swimming pool${
        property.pool_type && property.pool_type !== "none"
          ? ` (${property.pool_type})`
          : ""
      }`,
    property.wifi && "Wi-Fi",
    property.parking && "Parking",
    property.sea_view && "Sea view",
    property.wheelchair_friendly && "Wheelchair friendly",
  ].filter(Boolean) as string[];

  const allImages: PropertyImage[] = images.length
    ? images
    : [
        {
          id: "fallback",
          public_url: fallbackImage,
          is_cover: true,
          position: 0,
        },
      ];

  const mainImage = allImages[
    Math.min(activeImage, allImages.length - 1)
  ] ?? allImages[0];

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 22,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/properties")}
            style={{
              ...secondaryButtonStyle,
              background: "transparent",
            }}
          >
            ← Browse properties
          </button>

          {isOwner && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => navigate(`/edit-property/${property.id}`)}
                style={secondaryButtonStyle}
              >
                Edit listing
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(`/property-calendar/${property.id}`)
                }
                style={primaryButtonStyle}
              >
                Manage property calendar
              </button>
            </div>
          )}
        </div>

        <header style={{ marginBottom: 22 }}>
          <p
            style={{
              color: "#176b50",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.5,
              margin: "0 0 9px",
              textTransform: "uppercase",
            }}
          >
            STATIC HOLIDAYS / PROPERTY
          </p>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              margin: "0 0 10px",
              overflowWrap: "anywhere",
            }}
          >
            {property.title}
          </h1>

          {property.location && (
            <p style={{ color: "#718077", margin: 0, fontSize: 14 }}>
              <span aria-hidden="true">⌖ </span>
              {property.location}
            </p>
          )}
        </header>

        <section
          aria-label="Property photos"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.7fr) minmax(0, 1fr)",
            gap: 12,
            marginBottom: 26,
          }}
        >
          <img
            src={mainImage.public_url}
            alt={`${property.title} main photo`}
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
            style={{
              width: "100%",
              height: "clamp(260px, 42vw, 440px)",
              objectFit: "cover",
              borderRadius: 16,
              background: "#eaf0e9",
              display: "block",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gridTemplateRows: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              minWidth: 0,
            }}
          >
            {allImages.slice(1, 5).map((image, index) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setActiveImage(index + 1)}
                aria-label={`View property photo ${index + 2}`}
                style={{
                  padding: 0,
                  border: activeImage === index + 1
                    ? "3px solid #176b50"
                    : "1px solid #e3eae3",
                  borderRadius: 13,
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "#eaf0e9",
                  minWidth: 0,
                }}
              >
                <img
                  src={image.public_url}
                  alt={`${property.title} photo ${index + 2}`}
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 100,
                    maxHeight: 212,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
            ))}

            {allImages.length <= 1 && (
              <div
                style={{
                  gridColumn: "span 2",
                  gridRow: "span 2",
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  padding: 20,
                  background: "#eaf3eb",
                  borderRadius: 14,
                  color: "#53705b",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                More property photos will appear here when available.
              </div>
            )}
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 350px)",
            alignItems: "start",
            gap: 22,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <section style={{ ...cardStyle, marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 22,
                  paddingBottom: 20,
                  borderBottom: "1px solid #edf0ed",
                  color: "#526158",
                  fontSize: 13,
                }}
              >
                {property.bedrooms != null && (
                  <span>🛏 {property.bedrooms} bedrooms</span>
                )}
                {property.bathrooms != null && (
                  <span>♧ {property.bathrooms} bathrooms</span>
                )}
                {property.sleeps != null && (
                  <span>Guests: {property.sleeps}</span>
                )}
              </div>

              <h2 style={{ ...sectionTitleStyle, marginTop: 23 }}>
                About this property
              </h2>

              <p
                style={{
                  color: "#536258",
                  fontSize: 14,
                  lineHeight: 1.85,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {property.description ||
                  "The host has not added a description yet."}
              </p>
            </section>

            {amenities.length > 0 && (
              <section style={{ ...cardStyle, marginBottom: 18 }}>
                <h2 style={sectionTitleStyle}>Facilities & amenities</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                    gap: 10,
                    marginTop: 18,
                  }}
                >
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        background: "#f6f9f5",
                        border: "1px solid #e5ece4",
                        borderRadius: 10,
                        padding: 13,
                        fontSize: 13,
                        color: "#405448",
                      }}
                    >
                      <span style={{ color: "#176b50", fontWeight: 800 }}>
                        ✓
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {property.holiday_types &&
              property.holiday_types.length > 0 && (
                <section style={{ ...cardStyle, marginBottom: 18 }}>
                  <h2 style={sectionTitleStyle}>Perfect for</h2>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 9,
                      marginTop: 14,
                    }}
                  >
                    {property.holiday_types.map((item) => (
                      <span
                        key={item}
                        style={{
                          borderRadius: 30,
                          padding: "8px 12px",
                          background: "#eaf3eb",
                          color: "#315640",
                          fontSize: 12,
                          fontWeight: 650,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

            {property.features && property.features.length > 0 && (
              <section style={{ ...cardStyle, marginBottom: 18 }}>
                <h2 style={sectionTitleStyle}>More features</h2>
                <p style={{ color: "#536258", lineHeight: 1.8, fontSize: 14 }}>
                  {property.features.join(" · ")}
                </p>
              </section>
            )}

            {property.equine_facilities &&
              property.equine_facilities.length > 0 && (
                <section style={{ ...cardStyle, marginBottom: 18 }}>
                  <h2 style={sectionTitleStyle}>Equine facilities</h2>
                  <p style={{ color: "#536258", lineHeight: 1.8, fontSize: 14 }}>
                    {property.equine_facilities.join(" · ")}
                  </p>
                </section>
              )}

            <section style={cardStyle}>
              <h2 style={sectionTitleStyle}>Guest reviews</h2>
              <p
                style={{
                  color: "#758078",
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                See feedback from guests about their stays.
              </p>
              <ReviewsList propertyId={property.id} />
            </section>
          </div>

          <aside style={{ minWidth: 0 }}>
            <section
              style={{
                ...cardStyle,
                position: "sticky",
                top: 20,
                marginBottom: 18,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1.3,
                  color: "#176b50",
                  textTransform: "uppercase",
                }}
              >
                Your stay
              </p>

              <div style={{ marginBottom: 19 }}>
                <span
                  style={{
                    fontSize: 27,
                    fontWeight: 800,
                    letterSpacing: "-0.7px",
                    color: "#203128",
                  }}
                >
                  {validPrice ? formatPrice(price) : "Price to be confirmed"}
                </span>

                {validPrice && (
                  <span style={{ color: "#758078", fontSize: 12 }}>
                    {" "}/ night
                  </span>
                )}
              </div>

              {!validPrice && (
                <p
                  style={{
                    margin: "0 0 18px",
                    background: "#f6f8f5",
                    borderRadius: 9,
                    padding: 12,
                    color: "#69766c",
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  The host has not set a bookable nightly price yet.
                </p>
              )}

              <button
                type="button"
                onClick={scrollToCalendar}
                style={{ ...primaryButtonStyle, width: "100%" }}
              >
                View availability calendar
              </button>

              <button
                type="button"
                onClick={toggleFavourite}
                disabled={savingFav}
                style={{
                  ...secondaryButtonStyle,
                  width: "100%",
                  marginTop: 10,
                  opacity: savingFav ? 0.65 : 1,
                }}
              >
                {savingFav
                  ? "Saving…"
                  : saved
                    ? "♥ Saved to favourites"
                    : "♡ Add to favourites"}
              </button>

              <div
                style={{
                  borderTop: "1px solid #edf0ed",
                  marginTop: 20,
                  paddingTop: 17,
                  color: "#758078",
                  fontSize: 12,
                  lineHeight: 1.7,
                }}
              >
                Choose your dates to calculate the stay total before requesting a booking.
              </div>
            </section>

            <section
              id="availability-calendar"
              style={{ ...cardStyle, scrollMarginTop: 20 }}
            >
              <h2 style={sectionTitleStyle}>Check your dates</h2>
              <p
                style={{
                  color: "#758078",
                  fontSize: 12,
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                Select your arrival and departure dates.
              </p>

              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#405448",
                  marginBottom: 16,
                }}
              >
                Check-in
                <input
                  type="date"
                  value={startDate}
                  min={today()}
                  onChange={(event) => {
                    const nextStart = event.target.value;
                    setStartDate(nextStart);

                    if (endDate && nextStart >= endDate) {
                      setEndDate("");
                    }
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: 7,
                    padding: 12,
                    border: "1px solid #dce4dc",
                    borderRadius: 9,
                    fontSize: 13,
                    color: "#203128",
                    background: "#fff",
                  }}
                />
              </label>

              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#405448",
                }}
              >
                Check-out
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today()}
                  onChange={(event) => setEndDate(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: 7,
                    padding: 12,
                    border: "1px solid #dce4dc",
                    borderRadius: 9,
                    fontSize: 13,
                    color: "#203128",
                    background: "#fff",
                  }}
                />
              </label>

              {nights > 0 && (
                <div
                  style={{
                    background: "#f3f7f2",
                    border: "1px solid #e1ebe0",
                    borderRadius: 12,
                    padding: 15,
                    marginTop: 19,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 13,
                      fontWeight: 750,
                      color: "#315640",
                    }}
                  >
                    Your stay summary
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      fontSize: 12,
                      color: "#617064",
                      marginBottom: 9,
                    }}
                  >
                    <span>{nights} {nights === 1 ? "night" : "nights"}</span>
                    <span>
                      {validPrice ? `${formatPrice(price)} / night` : "Price TBC"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      borderTop: "1px solid #dce7dc",
                      paddingTop: 12,
                      marginTop: 5,
                    }}
                  >
                    <strong style={{ fontSize: 13 }}>Estimated total</strong>
                    <strong style={{ fontSize: 18, color: "#176b50" }}>
                      {validPrice ? formatPrice(totalPrice) : "To be confirmed"}
                    </strong>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => void createBooking()}
                disabled={bookingLoading || !validPrice || nights <= 0}
                style={{
                  ...primaryButtonStyle,
                  width: "100%",
                  marginTop: 17,
                  opacity:
                    bookingLoading || !validPrice || nights <= 0 ? 0.55 : 1,
                  cursor:
                    bookingLoading || !validPrice || nights <= 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {bookingLoading ? "Sending request…" : "Request booking"}
              </button>

              <p
                style={{
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: "#839087",
                  margin: "12px 0 0",
                  textAlign: "center",
                }}
              >
                Your booking request will be sent to the property host.
              </p>
            </section>

            {isOwner && (
              <section
                style={{
                  ...cardStyle,
                  background: "#eaf3eb",
                  borderColor: "#d8e6da",
                }}
              >
                <h3 style={{ fontSize: 15, margin: "0 0 8px", color: "#315640" }}>
                  Hosting this property?
                </h3>

                <p
                  style={{
                    color: "#536e5a",
                    fontSize: 12,
                    lineHeight: 1.7,
                    margin: "0 0 15px",
                  }}
                >
                  Update your listing or manage your property's calendar from the host centre.
                </p>

                <button
                  type="button"
                  onClick={() => navigate(`/property-calendar/${property.id}`)}
                  style={{ ...secondaryButtonStyle, width: "100%" }}
                >
                  Manage calendar →
                </button>
              </section>
            )}
          </aside>
        </div>

        <footer
          style={{
            borderTop: "1px solid #e2e8e2",
            marginTop: 35,
            paddingTop: 22,
            color: "#89938b",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          © 2026 Static Holidays
        </footer>
      </div>
    </main>
  );
}
