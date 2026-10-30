
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

type DateStatus = "available" | "blocked" | "booked" | "offer" | "season";

type DateInfo = {
  status: DateStatus;
  price?: number;
};

const green = "#14532d";

const buttonStyle: React.CSSProperties = {
  background: green,
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getRangeDates(first: string, last: string) {
  const start = first <= last ? first : last;
  const end = first <= last ? last : first;
  const dates: string[] = [];

  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);

  const current = new Date(sy, sm - 1, sd);
  const finalDate = new Date(ey, em - 1, ed);

  while (current <= finalDate) {
    dates.push(localDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export default function PropertyCalendar() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();

  const [year, setYear] = useState(new Date().getFullYear());
  const [calendarDates, setCalendarDates] =
    useState<Record<string, DateInfo>>({});
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [nightlyPrice, setNightlyPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [ownerId, setOwnerId] = useState<string | null>(null);

  const loadCalendar = useCallback(async () => {
    if (!propertyId) {
      setMessage("The property ID is missing from the address.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select("id, owner_id")
        .eq("id", propertyId)
        .maybeSingle();

      if (propertyError) throw propertyError;

      if (!property || property.owner_id !== user.id) {
        setMessage("This property was not found or you do not have permission to manage its calendar.");
        setMessageType("error");
        return;
      }

      setOwnerId(user.id);
      const { data, error } = await supabase
        .from("property_calendar_dates")
        .select("calendar_date, status, price")
        .eq("property_id", propertyId);

      if (error) throw error;

      const { data: bookingRows, error: bookingError } = await supabase
        .from("bookings")
        .select("check_in, check_out, status, booking_status, payment_status")
        .eq("property_id", propertyId);

      if (bookingError) throw bookingError;

      const saved: Record<string, DateInfo> = {};

      // Load the saved calendar dates and prices first.
      for (const row of data ?? []) {
        saved[row.calendar_date] = {
          status: row.status as DateStatus,
          ...(row.price !== null && row.price !== undefined
            ? { price: Number(row.price) }
            : {}),
        };
      }

      // Overlay confirmed or paid bookings as booked dates.
      for (const booking of bookingRows ?? []) {
        const bookingStatus = (booking.booking_status || "").toLowerCase().trim();
        const status = (booking.status || "").toLowerCase().trim();
        const paymentStatus = (booking.payment_status || "").toLowerCase().trim();

        const cancelledStatuses = [
          "cancelled",
          "canceled",
          "declined",
          "rejected",
          "expired",
        ];

        const isCancelled =
          cancelledStatuses.includes(bookingStatus) ||
          cancelledStatuses.includes(status);

        const isConfirmed =
          ["confirmed", "accepted"].includes(bookingStatus) ||
          ["confirmed", "accepted"].includes(status);

        const isPaid = [
          "paid",
          "deposit_paid",
          "partially_paid",
        ].includes(paymentStatus);

        if (
          isCancelled ||
          (!isConfirmed && !isPaid) ||
          !booking.check_in ||
          !booking.check_out
        ) {
          continue;
        }

        const current = new Date(`${booking.check_in.slice(0, 10)}T12:00:00`);
        const checkout = new Date(`${booking.check_out.slice(0, 10)}T12:00:00`);

        // Mark occupied nights only. The checkout date stays available.
        while (current < checkout) {
          const date = localDateKey(current);
          const existing = saved[date] ?? { status: "available" as const };

          saved[date] = {
            ...existing,
            status: "booked",
          };

          current.setDate(current.getDate() + 1);
        }
      }

      setCalendarDates(saved);
    
    } catch (error) {
      console.error("LOAD CALENDAR ERROR:", error);
      setMessage(
        error instanceof Error ? error.message : "Could not load the calendar."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [propertyId, navigate]);

  useEffect(() => {
    void loadCalendar();
  }, [loadCalendar]);

  function handleDateClick(date: string) {
    setMessage("");

    if (!rangeStart || rangeEnd) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      setRangeEnd(date);
    }
  }

  async function saveDates(
    dates: string[],
    updates: (date: string) => Partial<DateInfo>
  ) {
    if (!propertyId || !ownerId || dates.length === 0) {
      setMessage("Select a date or date range first.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const rows = dates.map((date) => {
        const oldInfo = calendarDates[date] ?? { status: "available" as const };
        const changed = updates(date);

        return {
          property_id: propertyId,
          owner_id: ownerId,
          calendar_date: date,
          status: changed.status ?? oldInfo.status,
          price:
            changed.price !== undefined
              ? changed.price
              : oldInfo.price ?? null,
          updated_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase
        .from("property_calendar_dates")
        .upsert(rows, { onConflict: "property_id,calendar_date" });

      if (error) throw error;

      setCalendarDates((current) => {
        const updated = { ...current };

        for (const row of rows) {
          updated[row.calendar_date] = {
            status: row.status as DateStatus,
            ...(row.price !== null ? { price: Number(row.price) } : {}),
          };
        }

        return updated;
      });

      setMessage(`Successfully saved ${dates.length} date${dates.length === 1 ? "" : "s"}.`);
      setMessageType("success");
    } catch (error) {
      console.error("SAVE CALENDAR ERROR:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save your changes. Please try again."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function updateDateStatus(status: DateStatus) {
    if (!rangeStart || !rangeEnd) return;

    const dates = getRangeDates(rangeStart, rangeEnd);

    await saveDates(dates, () => ({ status }));
  }

  async function updatePrice() {
    if (!rangeStart || !rangeEnd) {
      setMessage("Select a start and end date before saving a price.");
      setMessageType("error");
      return;
    }

    if (nightlyPrice.trim() === "" || !Number.isFinite(Number(nightlyPrice)) || Number(nightlyPrice) < 0) {
      setMessage("Enter a valid nightly price of £0 or more.");
      setMessageType("error");
      return;
    }

    const dates = getRangeDates(rangeStart, rangeEnd);
    const price = Number(Number(nightlyPrice).toFixed(2));

    await saveDates(dates, () => ({ price }));
  }

  return (
    <main style={{
      maxWidth: 1400,
      margin: "0 auto",
      padding: "28px 16px 50px",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937",
    }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: green }}>📅 Property Calendar</h1>
        <p><strong>Property ID:</strong> {propertyId}</p>
        <p style={{ color: "#6b7280" }}>
          Select dates, manage availability and save nightly prices.
          Your saved changes will be loaded when you return.
        </p>
      </div>

      {message && (
        <div
          role="status"
          style={{
            padding: 14,
            borderRadius: 8,
            marginBottom: 20,
            overflowWrap: "anywhere",
            background: messageType === "success" ? "#dcfce7" : "#fee2e2",
            color: messageType === "success" ? "#166534" : "#991b1b",
            border: `1px solid ${messageType === "success" ? "#86efac" : "#fca5a5"}`,
          }}
        >
          {message}
        </div>
      )}

      <section style={{
        background: "#f5f7f5",
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
      }}>
        <h2>Availability &amp; Pricing</h2>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}>
          <button style={buttonStyle} onClick={() => setYear((value) => value - 1)}>
            ← Previous Year
          </button>

          <h2>{year}</h2>

          <button style={buttonStyle} onClick={() => setYear((value) => value + 1)}>
            Next Year →
          </button>
        </div>

        <div style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 16,
          fontSize: 13,
        }}>
          <span>🟩 Available</span>
          <span>🟥 Blocked</span>
          <span>🟧 Booked</span>
          <span>🟨 Offer</span>
          <span>🟦 Season</span>
        </div>
      </section>

      {loading ? (
        <p>Loading your saved dates and prices...</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18,
        }}>
          {months.map((month, monthIndex) => {
            const days = getDaysInMonth(year, monthIndex);
            const firstDay = new Date(year, monthIndex, 1).getDay();
            const mondayOffset = (firstDay + 6) % 7;

            return (
              <section
                key={month}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 14,
                  background: "#ffffff",
                }}
              >
                <h3 style={{ textAlign: "center", color: green }}>
                  {month} {year}
                </h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: 4,
                  textAlign: "center",
                  marginBottom: 6,
                  fontSize: 11,
                  color: "#6b7280",
                }}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: 4,
                }}>
                  {Array.from({ length: mondayOffset }).map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}

                  {Array.from({ length: days }, (_, dayIndex) => {
                    const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayIndex + 1).padStart(2, "0")}`;
                    const info = calendarDates[date];
                    const selected = Boolean(
                      rangeStart &&
                      rangeEnd &&
                      date >= (rangeStart < rangeEnd ? rangeStart : rangeEnd) &&
                      date <= (rangeStart > rangeEnd ? rangeStart : rangeEnd)
                    );
                    const isStart = rangeStart === date;
                    const background: Record<DateStatus, string> = {
                      available: "#dcfce7",
                      blocked: "#dc2626",
                      booked: "#f97316",
                      offer: "#facc15",
                      season: "#2563eb",
                    };

                    return (
                      <button
                        key={date}
                        type="button"
                        title={`${formatDate(date)}${info?.price !== undefined ? ` — £${info.price} per night` : ""}${info ? ` — ${info.status}` : ""}`}
                        onClick={() => handleDateClick(date)}
                        style={{
                          minWidth: 0,
                          minHeight: 46,
                          padding: "4px 1px",
                          border: isStart || selected ? "2px solid #14532d" : "1px solid #e5e7eb",
                          borderRadius: 6,
                          cursor: "pointer",
                          background: info ? background[info.status] : selected ? "#bbf7d0" : "#f9fafb",
                          color: info && ["blocked", "booked", "season"].includes(info.status) ? "#ffffff" : "#1f2937",
                          fontSize: 12,
                          fontWeight: selected || isStart ? 700 : 400,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span>{dayIndex + 1}</span>
                        {info?.price !== undefined && (
                          <span style={{ fontSize: 9, marginTop: 2 }}>
                            £{info.price}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {rangeStart && (
        <section style={{
          marginTop: 28,
          padding: 20,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
        }}>
          <h2>Selected Dates</h2>
          <p><strong>First selected:</strong> {formatDate(rangeStart)}</p>

          {rangeEnd ? (
            <>
              <p><strong>Last selected:</strong> {formatDate(rangeEnd)}</p>
              <p style={{ color: "#6b7280", fontSize: 14 }}>
                {getRangeDates(rangeStart, rangeEnd).length} calendar date(s) selected, including both endpoints.
              </p>

              <h3>Set availability</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button disabled={saving} style={{ ...buttonStyle, background: "#16a34a", opacity: saving ? 0.6 : 1 }} onClick={() => void updateDateStatus("available")}>
                  🟩 Available
                </button>
                <button disabled={saving} style={{ ...buttonStyle, background: "#dc2626", opacity: saving ? 0.6 : 1 }} onClick={() => void updateDateStatus("blocked")}>
                  🟥 Block Dates
                </button>
                <button disabled={saving} style={{ ...buttonStyle, background: "#f97316", opacity: saving ? 0.6 : 1 }} onClick={() => void updateDateStatus("booked")}>
                  🟧 Booked
                </button>
              </div>

              <h3 style={{ marginTop: 24 }}>Nightly Price</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="£ per night"
                  value={nightlyPrice}
                  onChange={(event) => setNightlyPrice(event.target.value)}
                  style={{
                    padding: 11,
                    borderRadius: 7,
                    border: "1px solid #d1d5db",
                    fontSize: 16,
                    maxWidth: 220,
                  }}
                />
                <button
                  disabled={saving}
                  style={{ ...buttonStyle, opacity: saving ? 0.6 : 1 }}
                  onClick={() => void updatePrice()}
                >
                  {saving ? "Saving..." : "💷 Save Price"}
                </button>
              </div>

              {saving && <p>Saving your changes to the database...</p>}
            </>
          ) : (
            <p style={{ color: "#6b7280" }}>
              Select another date to complete your date range.
            </p>
          )}
        </section>
      )}

      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        marginTop: 28,
      }}>
        <button
          onClick={() => navigate("/host-dashboard")}
          style={buttonStyle}
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={() => void loadCalendar()}
          disabled={loading || saving}
          style={{ ...buttonStyle, background: "#4b5563" }}
        >
          ↻ Reload Saved Calendar
        </button>
      </div>
    </main>
  );
}
