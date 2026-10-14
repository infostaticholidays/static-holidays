
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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

type DateStatus = "available" | "blocked" | "booked" | "offer" | "season";

type CalendarDate = {
  calendar_date: string;
  status: DateStatus;
  price: number | string | null;
};

type BookingRecord = {
  check_in: string;
  check_out: string;
  booking_status: string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

const green = "#176b50";

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
  background: green,
  color: "#fff",
  border: `1px solid ${green}`,
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
  color: green,
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

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function today() {
  return localDateKey(new Date());
}

function countNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00Z`).getTime();
  const end = new Date(`${checkOut}T00:00:00Z`).getTime();

  return Math.round((end - start) / 86400000);
}

function getStayDates(checkIn: string, checkOut: string) {
  const dates: string[] = [];
  if (!checkIn || !checkOut || checkOut <= checkIn) return dates;

  const cursor = new Date(`${checkIn}T12:00:00Z`);
  const end = new Date(`${checkOut}T12:00:00Z`);

  while (cursor < end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getPositivePrice(value: unknown): number | null {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const propertyId = id ?? "";

  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);

  const [calendarDates, setCalendarDates] = useState<
    Record<string, CalendarDate>
  >({});
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [saved, setSaved] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // NEW: track which month the guest is viewing.
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const bookingMonthLabel = calendarMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const currentMonth = new Date();
  const isCurrentMonth =
    calendarMonth.getFullYear() === currentMonth.getFullYear() &&
    calendarMonth.getMonth() === currentMonth.getMonth();

  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingMessageType, setBookingMessageType] = useState<
    "success" | "error"
  >("error");

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
      } catch (error) {
        console.error("Could not load property:", error);
        if (!cancelled) setProperty(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProperty();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  useEffect(() => {
    let cancelled = false;

    async function loadCalendar() {
      if (!propertyId) {
        setCalendarLoading(false);
        return;
      }

      setCalendarLoading(true);
      setCalendarError("");

      const { data, error } = await supabase
        .from("property_calendar_dates")
        .select("calendar_date, status, price")
        .eq("property_id", propertyId);

      if (cancelled) return;

      if (error) {
        console.error("Could not load property calendar:", error);
        setCalendarDates({});
        setCalendarError(
          "We couldn't load availability. Please try again shortly."
        );
      } else {
        const dates: Record<string, CalendarDate> = {};

        for (const row of data ?? []) {
          dates[row.calendar_date] = row as CalendarDate;
        }

        setCalendarDates(dates);
      }

      setCalendarLoading(false);
    }

    void loadCalendar();

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

  const basePrice = getPositivePrice(property?.nightly_price);

  const stayDates = useMemo(
    () => getStayDates(startDate, endDate),
    [startDate, endDate]
  );

  const stayPriceInfo = useMemo(() => {
    if (stayDates.length === 0) {
      return {
        total: 0,
        valid: false,
        unavailable: [] as string[],
        unpriced: [] as string[],
        nightlyPrices: [] as number[],
      };
    }

    const unavailable: string[] = [];
    const unpriced: string[] = [];
    const nightlyPrices: number[] = [];

    for (const date of stayDates) {
      const entry = calendarDates[date];

      if (!entry || entry.status !== "available") {
        unavailable.push(date);
        continue;
      }

      const datePrice = getPositivePrice(entry.price);
      const effectivePrice = datePrice ?? basePrice;

      if (effectivePrice === null) {
        unpriced.push(date);
        continue;
      }

      nightlyPrices.push(effectivePrice);
    }

    const valid =
      unavailable.length === 0 &&
      unpriced.length === 0 &&
      nightlyPrices.length === stayDates.length;

    return {
      total: valid ? nightlyPrices.reduce((sum, price) => sum + price, 0) : 0,
      valid,
      unavailable,
      unpriced,
      nightlyPrices,
    };
  }, [stayDates, calendarDates, basePrice]);

  const displayPrice = useMemo(() => {
    if (basePrice !== null) return basePrice;

    const availablePrices = Object.values(calendarDates)
      .filter((entry) => entry.status === "available")
      .map((entry) => getPositivePrice(entry.price))
      .filter((price): price is number => price !== null);

    return availablePrices.length > 0 ? Math.min(...availablePrices) : null;
  }, [basePrice, calendarDates]);

  const isOwner = !!property && currentUserId === property.owner_id;

  async function toggleFavourite() {
    if (!property || savingFav) return;

    setSavingFav(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
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

    setBookingMessage("");

    if (!startDate || !endDate) {
      setBookingMessage("Please select check-in and check-out dates.");
      setBookingMessageType("error");
      return;
    }

    const nights = countNights(startDate, endDate);

    if (startDate < today() || nights <= 0) {
      setBookingMessage(
        "Please choose valid dates. Check-out must be after check-in."
      );
      setBookingMessageType("error");
      return;
    }

    if (isOwner) {
      setBookingMessage("You cannot book your own property.");
      setBookingMessageType("error");
      return;
    }

    if (calendarLoading || calendarError) {
      setBookingMessage(
        "Availability has not been verified. Please reload the page and try again."
      );
      setBookingMessageType("error");
      return;
    }

    if (stayPriceInfo.unavailable.length > 0) {
      setBookingMessage(
        `These dates are unavailable: ${stayPriceInfo.unavailable
          .map(formatDate)
          .join(", ")}. Please choose different dates.`
      );
      setBookingMessageType("error");
      return;
    }

    if (stayPriceInfo.unpriced.length > 0) {
      setBookingMessage(
        "The host hasn't set a price for every night of this stay."
      );
      setBookingMessageType("error");
      return;
    }

    if (!stayPriceInfo.valid || stayPriceInfo.total <= 0) {
      setBookingMessage("A valid price is not available for this stay.");
      setBookingMessageType("error");
      return;
    }

    setBookingLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      if (user.id === property.owner_id) {
        setBookingMessage("You cannot book your own property.");
        setBookingMessageType("error");
        return;
      }

      const { data: freshCalendar, error: calendarCheckError } =
        await supabase
          .from("property_calendar_dates")
          .select("calendar_date, status, price")
          .eq("property_id", property.id)
          .gte("calendar_date", startDate)
          .lt("calendar_date", endDate);

      if (calendarCheckError) throw calendarCheckError;

      const freshByDate = new Map(
        (freshCalendar ?? []).map((entry) => [
          entry.calendar_date,
          entry as CalendarDate,
        ])
      );

      const nowUnavailable = stayDates.filter(
        (date) => freshByDate.get(date)?.status !== "available"
      );

      if (nowUnavailable.length > 0) {
        setBookingMessage(
          `Availability has changed for ${nowUnavailable
            .map(formatDate)
            .join(", ")}. Please choose different dates.`
        );
        setBookingMessageType("error");
        return;
      }

      let freshTotal = 0;

      for (const date of stayDates) {
        const entry = freshByDate.get(date);
        const datePrice = getPositivePrice(entry?.price);
        const effectivePrice = datePrice ?? basePrice;

        if (effectivePrice === null) {
          setBookingMessage(
            `The host hasn't set a price for ${formatDate(date)}.`
          );
          setBookingMessageType("error");
          return;
        }

        freshTotal += effectivePrice;
      }

      const { data: overlaps, error: overlapError } = await supabase
        .from("bookings")
        .select("check_in, check_out, booking_status")
        .eq("property_id", property.id)
        .lt("check_in", endDate)
        .gt("check_out", startDate);

      if (overlapError) throw overlapError;

      const conflict = ((overlaps ?? []) as BookingRecord[]).some(
        (booking) =>
          !["cancelled", "rejected"].includes(
            String(booking.booking_status).toLowerCase()
          )
      );

      if (conflict) {
        setBookingMessage(
          "These dates overlap an existing booking request. Please select different dates."
        );
        setBookingMessageType("error");
        return;
      }

      const { error: insertError } = await supabase.from("bookings").insert({
        property_id: property.id,
        owner_id: property.owner_id,
        guest_id: user.id,
        check_in: startDate,
        check_out: endDate,
        total_price: Number(freshTotal.toFixed(2)),
        booking_status: "pending",
      });

      if (insertError) throw insertError;

      setBookingMessage("Your booking request has been sent to the host.");
      setBookingMessageType("success");
      navigate("/bookings");
    } catch (error) {
      console.error("Could not create booking:", error);
      setBookingMessage(
        error instanceof Error
          ? error.message
          : "Could not send your booking request. Please try again."
      );
      setBookingMessageType("error");
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

  const amenities = property
    ? [
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
      ].filter(Boolean) as string[]
    : [];

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

  const mainImage =
    allImages[Math.min(activeImage, allImages.length - 1)] ?? allImages[0];

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

  const mapQuery = property.location?.trim() ?? "";
  const mapUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : "";
  const mapEmbedUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : "";

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
            style={{ ...secondaryButtonStyle, background: "transparent" }}
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
                onClick={() => navigate(`/property-calendar/${property.id}`)}
                style={primaryButtonStyle}
              >
                Manage calendar
              </button>
            </div>
          )}
        </div>

        <header style={{ marginBottom: 22 }}>
          <p
            style={{
              color: green,
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
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
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
              gridAutoRows: "minmax(100px, 1fr)",
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
                  border:
                    activeImage === index + 1
                      ? `3px solid ${green}`
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
         gridTemplateColumns: "minmax(0, 1fr)",
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
                      <span style={{ color: green, fontWeight: 800 }}>✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {property.holiday_types && property.holiday_types.length > 0 && (
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
                  <p
                    style={{
                      color: "#536258",
                      lineHeight: 1.8,
                      fontSize: 14,
                    }}
                  >
                    {property.equine_facilities.join(" · ")}
                  </p>
                </section>
              )}

            {mapQuery && (
              <section style={{ ...cardStyle, marginBottom: 18 }}>
                <h2 style={sectionTitleStyle}>Location</h2>
                <p
                  style={{
                    color: "#536258",
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: "8px 0 16px",
                  }}
                >
                  {property.location}
                </p>
                <iframe
                  title={`Map showing ${property.title}`}
                  src={mapEmbedUrl}
                  width="100%"
                  height="320"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{
                    display: "block",
                    width: "100%",
                    border: 0,
                    borderRadius: 12,
                    background: "#eef2ed",
                  }}
                />
                <p style={{ margin: "14px 0 0" }}>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: green,
                      fontSize: 13,
                      fontWeight: 750,
                      textDecoration: "none",
                    }}
                  >
                    Open in Google Maps ↗
                  </a>
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
                  color: green,
                  textTransform: "uppercase",
                }}
              >
                Your stay
              </p>

              <div style={{ marginBottom: 19 }}>
                <span
                  style={{
                    fontSize: 25,
                    fontWeight: 800,
                    letterSpacing: "-0.7px",
                    color: "#203128",
                  }}
                >
                  {displayPrice !== null
                    ? formatPrice(displayPrice)
                    : "Price to be confirmed"}
                </span>
                {displayPrice !== null && (
                  <span style={{ color: "#758078", fontSize: 12 }}>
                    {" "}
                    / night
                  </span>
                )}
              </div>

              {displayPrice === null && (
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
                  The host has not set a nightly price yet.
                </p>
              )}

              <button
                type="button"
                onClick={scrollToCalendar}
                style={{ ...primaryButtonStyle, width: "100%" }}
              >
                View availability
              </button>

              <button
                type="button"
                onClick={() => void toggleFavourite()}
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
                Choose your dates to check availability and calculate your
                stay total.
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
                  marginBottom: 16,
                }}
              >
                Choose dates the host has marked as available.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  fontSize: 11,
                  marginBottom: 17,
                }}
              >
                <span style={{ background: "#dcfce7", padding: "5px 8px", borderRadius: 6 }}>
                  Available
                </span>
                <span style={{ background: "#fee2e2", padding: "5px 8px", borderRadius: 6 }}>
                  Blocked
                </span>
                <span style={{ background: "#ffedd5", padding: "5px 8px", borderRadius: 6 }}>
                  Booked
                </span>
                <span style={{ background: "#f3f4f6", padding: "5px 8px", borderRadius: 6 }}>
                  Not set
                </span>
              </div>

              {calendarLoading && (
                <p style={{ color: "#758078", fontSize: 13 }}>
                  Loading availability…
                </p>
              )}

              {!calendarLoading && calendarError && (
                <p
                  role="alert"
                  style={{
                    color: "#991b1b",
                    background: "#fee2e2",
                    borderRadius: 9,
                    padding: 12,
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {calendarError}
                </p>
              )}

              {!calendarLoading && !calendarError && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                    gap: 4,
                    marginBottom: 20,
                  }}
                >
                  {/* NEW: month navigation */}
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <button
                      type="button"
                      aria-label="Previous month"
                      disabled={isCurrentMonth}
                      onClick={() =>
                        setCalendarMonth(
                          (current) =>
                            new Date(
                              current.getFullYear(),
                              current.getMonth() - 1,
                              1
                            )
                        )
                      }
                      style={{
                        ...secondaryButtonStyle,
                        padding: "8px 11px",
                        minWidth: 42,
                        opacity: isCurrentMonth ? 0.4 : 1,
                        cursor: isCurrentMonth ? "not-allowed" : "pointer",
                      }}
                    >
                      ←
                    </button>

                    <strong
                      aria-live="polite"
                      style={{
                        fontSize: 14,
                        color: "#203128",
                        textAlign: "center",
                      }}
                    >
                      {bookingMonthLabel}
                    </strong>

                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setCalendarMonth(
                          (current) =>
                            new Date(
                              current.getFullYear(),
                              current.getMonth() + 1,
                              1
                            )
                        )
                      }
                      style={{
                        ...secondaryButtonStyle,
                        padding: "8px 11px",
                        minWidth: 42,
                      }}
                    >
                      →
                    </button>
                  </div>

                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div
                      key={`${day}-${index}`}
                      style={{
                        textAlign: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#758078",
                        padding: "5px 0",
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {(() => {
                    // Use the month selected by the guest.
                    const start = new Date(calendarMonth);
                    start.setDate(1);
                    start.setHours(12, 0, 0, 0);

                    const daysInMonth = new Date(
                      start.getFullYear(),
                      start.getMonth() + 1,
                      0
                    ).getDate();

                    const offset = (start.getDay() + 6) % 7;
                    const cells = [];

                    for (let i = 0; i < offset; i++) {
                      cells.push(
                        <div key={`blank-${i}`} aria-hidden="true" />
                      );
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = localDateKey(
                        new Date(
                          start.getFullYear(),
                          start.getMonth(),
                          day,
                          12
                        )
                      );

                      const entry = calendarDates[date];
                      const status = entry?.status;
                      const available = status === "available";
                      const blocked = status === "blocked";
                      const booked = status === "booked";
                      const selected = date === startDate || date === endDate;
                      const between =
                        !!startDate &&
                        !!endDate &&
                        date > startDate &&
                        date < endDate;

                      const bg = selected
                        ? "#176b50"
                        : available
                          ? "#dcfce7"
                          : blocked
                            ? "#fee2e2"
                            : booked
                              ? "#ffedd5"
                              : "#f3f4f6";

                      const fg = selected
                        ? "#ffffff"
                        : blocked
                          ? "#991b1b"
                          : booked
                            ? "#9a3412"
                            : "#203128";

                  
                      const datePrice =
                        getPositivePrice(entry?.price) ?? basePrice;

                      cells.push(
                        <button
                          key={date}
                          type="button"
                          disabled={date < today() || !available}
                          title={`${formatDate(date)} — ${
                            status ?? "not set"
                          }${
                            datePrice !== null
                              ? ` — ${formatPrice(datePrice)} per night`
                              : ""
                          }`}
                          onClick={() => {
                            setBookingMessage("");

                            if (!startDate || endDate || date <= startDate) {
                              setStartDate(date);
                              setEndDate("");
                            } else {
                              setEndDate(date);
                            }
                          }}
                          style={{
                            minWidth: 0,
                            minHeight: 54,
                            padding: "5px 1px",
                            border: selected
                              ? "2px solid #14532d"
                              : between
                                ? "2px solid #86b99a"
                                : "1px solid #e5e7eb",
                            borderRadius: 7,
                            background: between ? "#bbf7d0" : bg,
                            color: fg,
                            cursor:
                              date < today() || !available
                                ? "not-allowed"
                                : "pointer",
                            opacity: date < today() ? 0.45 : 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 800 }}>
                            {day}
                          </span>

                          {datePrice !== null && (
                            <span
                              style={{
                             fontSize: 11,
                                lineHeight: 1.2,
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                color: selected ? "#ffffff" : fg,
                              }}
                            >
                              {formatPrice(datePrice)}
                            </span>
                          )}
                        </button>
                      );

                    }

                    return cells;
                  })()}
                </div>
              )}

              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#405448",
                  marginBottom: 15,
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
                    setEndDate("");
                    setBookingMessage("");
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
                  min={
                    startDate
                      ? localDateKey(
                          new Date(
                            new Date(`${startDate}T12:00:00Z`).getTime() +
                              86400000
                          )
                        )
                      : today()
                  }
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setBookingMessage("");
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

              {startDate && (
                <p
                  style={{
                    color: "#617064",
                    fontSize: 12,
                    lineHeight: 1.6,
                    margin: "12px 0 0",
                  }}
                >
                  Check-in: {formatDate(startDate)}
                  {endDate ? ` · Check-out: ${formatDate(endDate)}` : ""}
                </p>
              )}

              {endDate && countNights(startDate, endDate) > 0 && (
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
                    <span>
                      {countNights(startDate, endDate)}{" "}
                      {countNights(startDate, endDate) === 1 ? "night" : "nights"}
                    </span>
                    <span>
                      {stayPriceInfo.valid
                        ? "Prices confirmed"
                        : "Checking prices"}
                    </span>
                  </div>

                  {stayPriceInfo.unavailable.length > 0 && (
                    <p
                      style={{
                        color: "#991b1b",
                        fontSize: 12,
                        lineHeight: 1.6,
                      }}
                    >
                      Some nights are unavailable or have not been opened by
                      the host. Please select different dates.
                    </p>
                  )}

                  {stayPriceInfo.unpriced.length > 0 &&
                    stayPriceInfo.unavailable.length === 0 && (
                      <p
                        style={{
                          color: "#92400e",
                          fontSize: 12,
                          lineHeight: 1.6,
                        }}
                      >
                        The host has not set a price for every night.
                      </p>
                    )}

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
                    <strong style={{ fontSize: 18, color: green }}>
                      {stayPriceInfo.valid
                        ? formatPrice(stayPriceInfo.total)
                        : "Not available"}
                    </strong>
                  </div>

                  {stayPriceInfo.valid && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "#758078",
                        lineHeight: 1.6,
                        margin: "10px 0 0",
                      }}
                    >
                      The total uses each night's saved price, or the property's
                      current nightly price where no date-specific price is set.
                    </p>
                  )}
                </div>
              )}

              {bookingMessage && (
                <p
                  role="status"
                  style={{
                    background:
                      bookingMessageType === "success" ? "#dcfce7" : "#fee2e2",
                    color:
                      bookingMessageType === "success" ? "#166534" : "#991b1b",
                    borderRadius: 9,
                    padding: 12,
                    fontSize: 12,
                    lineHeight: 1.6,
                    overflowWrap: "anywhere",
                    marginTop: 16,
                  }}
                >
                  {bookingMessage}
                </p>
              )}

              <button
                type="button"
                onClick={() => void createBooking()}
                disabled={
                  bookingLoading ||
                  calendarLoading ||
                  !!calendarError ||
                  !stayPriceInfo.valid ||
                  isOwner
                }
                style={{
                  ...primaryButtonStyle,
                  width: "100%",
                  marginTop: 17,
                  opacity:
                    bookingLoading ||
                    calendarLoading ||
                    !!calendarError ||
                    !stayPriceInfo.valid ||
                    isOwner
                      ? 0.55
                      : 1,
                  cursor:
                    bookingLoading ||
                    calendarLoading ||
                    !!calendarError ||
                    !stayPriceInfo.valid ||
                    isOwner
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {bookingLoading
                  ? "Sending request…"
                  : isOwner
                    ? "Your property"
                    : "Request booking"}
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
