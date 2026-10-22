

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type BookingDetails = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  status: string;
  booking_status: string;
  properties: {
    title: string;
    location: string | null;
    nearby_information: string | null;
    check_in_time: string | null;
    check_out_time: string | null;
    check_in_timezone: string | null;
  } | null;
};

type GuestInfo = {
  house_rules: string | null;
  hot_tub_instructions: string | null;
};

type ArrivalInfo = {
  check_in_instructions: string | null;
  key_safe_location: string | null;
  key_safe_code: string | null;
  owner_contact_details: string | null;
  arrival_notes: string | null;
};

const colors = {
  cream: "#F6F4EE",
  sage: "#52765A",
  darkGreen: "#354C3C",
  text: "#59685A",
  border: "#E4E8DE",
  white: "#FFFFFF",
  paleGreen: "#EAF0E6",
  paleRed: "#FBEAE6",
  red: "#963F32",
};

const cardStyle = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 18,
  padding: 24,
  marginBottom: 20,
  boxShadow: "0 4px 16px rgba(53, 76, 60, 0.05)",
};

const headingStyle = {
  color: colors.darkGreen,
  fontSize: 21,
  lineHeight: 1.4,
  margin: "0 0 14px",
};

const subheadingStyle = {
  color: colors.darkGreen,
  fontSize: 16,
  margin: "22px 0 8px",
};

const textStyle = {
  color: colors.text,
  fontSize: 14,
  lineHeight: 1.8,
  whiteSpace: "pre-wrap" as const,
  overflowWrap: "anywhere" as const,
};

function localTimeToDate(
  dateValue: string,
  timeValue: string,
  timeZone: string
): Date {
  const [year, month, day] = dateValue.slice(0, 10).split("-").map(Number);
  const [hour, minute] = timeValue.slice(0, 5).split(":").map(Number);

  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let guess = targetAsUtc;

  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(guess));

    const get = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);

    const displayedAsUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute")
    );

    guess += targetAsUtc - displayedAsUtc;
  }

  return new Date(guess);
}

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

function formatTime(value: string | null | undefined) {
  if (!value) return "Not set";

  const [hour, minute] = value.slice(0, 5).split(":").map(Number);
  const suffix = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export default function GuestBookingDetail() {
  const { id } = useParams<{ id: string }>();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo | null>(null);
  const [arrivalReleased, setArrivalReleased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBooking() {
      setLoading(true);
      setErrorMessage("");
      setBooking(null);
      setGuestInfo(null);
      setArrivalInfo(null);
      setArrivalReleased(false);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          setErrorMessage("Please sign in to view your booking.");
          return;
        }

        if (!id) {
          setErrorMessage("No booking ID was provided.");
          return;
        }

        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id,
            property_id,
            check_in,
            check_out,
            status,
            booking_status,
            properties (
              title,
              location,
              nearby_information,
              check_in_time,
              check_out_time,
              check_in_timezone
            )
          `)
          .eq("id", id)
          .eq("guest_id", user.id)
          .eq("status", "confirmed")
          .eq("booking_status", "confirmed")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setErrorMessage(
            "This booking could not be found, is not confirmed, or is not available to your account."
          );
          return;
        }

        if (cancelled) return;

        const currentBooking = data as unknown as BookingDetails;
        setBooking(currentBooking);

        const { data: info, error: infoError } = await supabase
          .from("property_guest_information")
          .select("house_rules, hot_tub_instructions")
          .eq("property_id", currentBooking.property_id)
          .maybeSingle();

        if (infoError) {
          console.error("Could not load guest information:", infoError);
        } else if (!cancelled) {
          setGuestInfo(info);
        }

        const property = currentBooking.properties;
        const timeZone = property?.check_in_timezone || "Europe/London";
        const checkInTime = property?.check_in_time || "15:00";

        const checkInDateTime = localTimeToDate(
          currentBooking.check_in,
          checkInTime,
          timeZone
        );

        const releaseTime = new Date(
          checkInDateTime.getTime() - 24 * 60 * 60 * 1000
        );

        const checkoutTime = property?.check_out_time;

        const checkoutDateTime = localTimeToDate(
          currentBooking.check_out,
          checkoutTime || "23:59",
          timeZone
        );

        const now = new Date();
        const released =
          now >= releaseTime && now < checkoutDateTime;

        if (!cancelled) setArrivalReleased(released);

        if (released) {
          const { data: arrival, error: arrivalError } = await supabase
            .from("property_arrival_details")
            .select(`
              check_in_instructions,
              key_safe_location,
              key_safe_code,
              owner_contact_details,
              arrival_notes
            `)
            .eq("property_id", currentBooking.property_id)
            .maybeSingle();

          if (arrivalError) {
            console.error(
              "Could not load arrival information:",
              arrivalError
            );
          } else if (!cancelled) {
            setArrivalInfo(arrival);
          }
        }
      } catch (error) {
        console.error("Could not load guest booking:", error);

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load your booking."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadBooking();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: colors.cream,
          padding: "60px 20px",
          color: colors.darkGreen,
          textAlign: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <p>Loading your booking…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.cream,
        padding: "30px 18px 60px",
        color: colors.darkGreen,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <Link
            to="/account"
            style={{
              display: "inline-block",
              marginBottom: 26,
              color: colors.sage,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ← Back to your account
          </Link>

          <p
            style={{
              color: colors.sage,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            STATIC HOLIDAYS
          </p>

          <h1
            style={{
              fontSize: 34,
              lineHeight: 1.2,
              letterSpacing: "-0.8px",
              margin: "0 0 12px",
              color: colors.darkGreen,
            }}
          >
            Your booking
          </h1>

          <p style={{ ...textStyle, marginTop: 0 }}>
            Your booking information and everything you need for your stay.
          </p>
        </header>

        {errorMessage && (
          <section
            role="alert"
            style={{
              ...cardStyle,
              background: colors.paleRed,
              borderColor: "#EBCBC3",
              color: colors.red,
            }}
          >
            <strong>We couldn’t load your booking</strong>
            <p style={{ ...textStyle, color: colors.red, marginBottom: 0 }}>
              {errorMessage}
            </p>
          </section>
        )}

        {booking && (
          <>
            <section style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div>
                  <p
                    style={{
                      color: colors.sage,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      margin: "0 0 8px",
                    }}
                  >
                    YOUR HOLIDAY
                  </p>

                  <h2 style={{ ...headingStyle, fontSize: 25, margin: 0 }}>
                    {booking.properties?.title || "Your holiday property"}
                  </h2>
                </div>

                <span
                  style={{
                    display: "inline-block",
                    background: colors.paleGreen,
                    color: colors.darkGreen,
                    borderRadius: 30,
                    padding: "8px 13px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ✓ Confirmed
                </span>
              </div>

              {booking.properties?.location && (
                <p style={{ ...textStyle, marginTop: 0 }}>
                  {booking.properties.location}
                </p>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: 12,
                  marginTop: 22,
                }}
              >
                <div
                  style={{
                    background: "#F6F7F1",
                    borderRadius: 14,
                    padding: 18,
                  }}
                >
                  <p
                    style={{
                      color: colors.sage,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1,
                      margin: "0 0 8px",
                    }}
                  >
                    CHECK-IN
                  </p>

                  <p
                    style={{
                      color: colors.darkGreen,
                      fontSize: 20,
                      fontWeight: 700,
                      margin: "0 0 6px",
                    }}
                  >
                    {formatTime(booking.properties?.check_in_time)}
                  </p>

                  <p style={{ ...textStyle, margin: 0 }}>
                    {formatDate(booking.check_in)}
                  </p>
                </div>

                <div
                  style={{
                    background: "#F6F7F1",
                    borderRadius: 14,
                    padding: 18,
                  }}
                >
                  <p
                    style={{
                      color: colors.sage,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1,
                      margin: "0 0 8px",
                    }}
                  >
                    CHECK-OUT
                  </p>

                  <p
                    style={{
                      color: colors.darkGreen,
                      fontSize: 20,
                      fontWeight: 700,
                      margin: "0 0 6px",
                    }}
                  >
                    {formatTime(booking.properties?.check_out_time)}
                  </p>

                  <p style={{ ...textStyle, margin: 0 }}>
                    {formatDate(booking.check_out)}
                  </p>
                </div>
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={headingStyle}>Local area</h2>
              <p style={{ ...textStyle, marginBottom: 0 }}>
                {booking.properties?.nearby_information?.trim() ||
                  "Local information has not been added for this property yet."}
              </p>
            </section>

            <section style={cardStyle}>
              <h2 style={headingStyle}>House rules and facilities</h2>

              <h3 style={subheadingStyle}>House rules</h3>
              <p style={textStyle}>
                {guestInfo?.house_rules?.trim() ||
                  "House rules have not been added yet."}
              </p>

              <div
                style={{
                  height: 1,
                  background: colors.border,
                  margin: "20px 0",
                }}
              />

              <h3 style={subheadingStyle}>Hot tub and facility instructions</h3>
              <p style={textStyle}>
                {guestInfo?.hot_tub_instructions?.trim() ||
                  "Facility instructions have not been added yet."}
              </p>
            </section>

            <section style={cardStyle}>
              <h2 style={headingStyle}>
                Arrival instructions and key-safe details
              </h2>

              {!arrivalReleased && (
                <div
                  style={{
                    background: "#F6F7F1",
                    borderRadius: 14,
                    padding: 18,
                  }}
                >
                  <p style={{ ...textStyle, margin: 0 }}>
                    We’re looking forward to welcoming you! Your arrival
                    instructions and key-safe details will become available
                    24 hours before your scheduled check-in time. Please
                    return to this booking page then to view them.
                  </p>
                </div>
              )}

              {arrivalReleased && !arrivalInfo && (
                <p style={textStyle}>
                  Your arrival details are within their release window, but
                  could not be loaded. Please refresh this page or contact
                  your host.
                </p>
              )}

              {arrivalReleased && arrivalInfo && (
                <div
                  style={{
                    background: "#F6F7F1",
                    borderRadius: 14,
                    padding: 18,
                  }}
                >
                  <h3 style={subheadingStyle}>Check-in instructions</h3>
                  <p style={textStyle}>
                    {arrivalInfo.check_in_instructions || "Not provided"}
                  </p>

                  <h3 style={subheadingStyle}>Key-safe location</h3>
                  <p style={textStyle}>
                    {arrivalInfo.key_safe_location || "Not provided"}
                  </p>

                  <h3 style={subheadingStyle}>Key-safe code</h3>
                  <p
                    style={{
                      ...textStyle,
                      color: colors.darkGreen,
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    {arrivalInfo.key_safe_code || "Not provided"}
                  </p>

                  <h3 style={subheadingStyle}>Host contact details</h3>
                  <p style={textStyle}>
                    {arrivalInfo.owner_contact_details || "Not provided"}
                  </p>

                  <h3 style={subheadingStyle}>Additional arrival notes</h3>
                  <p style={textStyle}>
                    {arrivalInfo.arrival_notes || "Not provided"}
                  </p>
                </div>
              )}
            </section>

            <p
              style={{
                textAlign: "center",
                color: colors.text,
                fontSize: 12,
                lineHeight: 1.7,
                marginTop: 30,
              }}
            >
              STATIC HOLIDAYS
              <br />
              We hope you have a wonderful stay.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
