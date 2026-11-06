
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  total_price: number | string;
  deposit_amount: number | string | null;
  status: string;
  booking_status: string;
  properties: {
    title: string;
    location: string | null;
  } | null;
};

type BookingExtra = {
  id: string;
  extra_name: string;
  unit_price: number | string;
  quantity: number;
  line_total: number | string;
  payment_timing: "deposit" | "balance";
};

type BookingPayment = {
  id: string;
  payment_type: string;
  amount: number | string;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
};

const colors = {
  background: "#f6f8f5",
  green: "#176b50",
  dark: "#203128",
  text: "#536258",
  muted: "#758078",
  border: "#e3eae3",
  paleGreen: "#eaf3eb",
  white: "#ffffff",
  paleOrange: "#fff4e5",
  orange: "#8a5b19",
};

const cardStyle = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  padding: 24,
  marginBottom: 18,
  boxShadow: "0 3px 12px rgba(32,49,40,0.04)",
};

const headingStyle = {
  color: colors.dark,
  fontSize: 20,
  margin: "0 0 18px",
};

const textStyle = {
  color: colors.text,
  fontSize: 14,
  lineHeight: 1.7,
};

function money(value: number | string | null | undefined) {
  return Number(value || 0).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
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

function paymentTypeLabel(value: string) {
  switch (value) {
    case "deposit":
      return "Booking deposit";
    case "balance":
      return "Remaining balance";
    case "full":
      return "Full payment";
    case "custom":
      return "Additional payment";
    default:
      return "Payment";
  }
}

export default function GuestHolidayPayments() {
  const { id } = useParams<{ id: string }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [extras, setExtras] = useState<BookingExtra[]>([]);
  const [payments, setPayments] = useState<BookingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [payingBalance, setPayingBalance] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [payingCustom, setPayingCustom] = useState(false);
  async function handlePayBalance() {
  if (!booking || payingBalance) return;

  setPayingBalance(true);
  setErrorMessage("");

  try {
    const { data, error } = await supabase.functions.invoke(
      "create-checkout-session",
      {
        body: {
          booking_id: booking.id,
          payment_choice: "balance",
        },
      }
    );

    if (error) throw error;
if (!data?.checkout_url) {
      throw new Error("Stripe did not return a checkout link.");
    }
window.location.href = data.checkout_url;
  } catch (error) {
    console.error("Could not start balance payment:", error);
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "We couldn't start your balance payment. Please try again."
    );
    setPayingBalance(false);
  }
}

  useEffect(() => {
    let cancelled = false;

    async function loadHoliday() {
      setLoading(true);
      setErrorMessage("");
      setBooking(null);
      setExtras([]);
      setPayments([]);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          setErrorMessage("Please sign in to view your holiday payments.");
          return;
        }

        if (!id) {
          setErrorMessage("No booking ID was provided.");
          return;
        }

        const { data: bookingData, error: bookingError } =
          await supabase
            .from("bookings")
            .select(`
              id,
              property_id,
              check_in,
              check_out,
              total_price,
              deposit_amount,
              status,
              booking_status,
              properties (
                title,
                location
              )
            `)
            .eq("id", id)
            .eq("guest_id", user.id)
            .maybeSingle();

        if (bookingError) throw bookingError;

        if (!bookingData) {
          setErrorMessage(
            "We couldn't find this booking for your account."
          );
          return;
        }

        if (cancelled) return;

        const currentBooking = bookingData as unknown as Booking;
        setBooking(currentBooking);

        const [
          { data: extrasData, error: extrasError },
          { data: paymentsData, error: paymentsError },
        ] = await Promise.all([
          supabase
            .from("booking_extras")
            .select(
              "id, extra_name, unit_price, quantity, line_total, payment_timing"
            )
            .eq("booking_id", currentBooking.id),

          supabase
            .from("booking_payments")
            .select(
              "id, payment_type, amount, currency, status, paid_at, created_at"
            )
            .eq("booking_id", currentBooking.id)
            .order("created_at", { ascending: false }),
        ]);

        if (extrasError) throw extrasError;
        if (paymentsError) throw paymentsError;

        if (!cancelled) {
          setExtras((extrasData ?? []) as BookingExtra[]);
          setPayments((paymentsData ?? []) as BookingPayment[]);
        }
      } catch (error) {
        console.error("Could not load holiday payments:", error);

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "We couldn't load your holiday payments."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

  

    void loadHoliday();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main style={{
        minHeight: "100vh",
        background: colors.background,
        padding: 40,
        textAlign: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        color: colors.dark,
      }}>
        Loading your holiday payments…
      </main>
    );
  }

  if (errorMessage || !booking) {
    return (
      <main style={{
        minHeight: "100vh",
        background: colors.background,
        padding: "50px 20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", ...cardStyle }}>
          <h1 style={headingStyle}>Your holiday payments</h1>
          <p style={textStyle}>
            {errorMessage || "Your booking could not be loaded."}
          </p>
          <Link to="/account" style={{ color: colors.green }}>
            Back to your account
          </Link>
        </div>
      </main>
    );
  }

  const total = Number(booking.total_price || 0);
const balanceDueDate = new Date(
  `${booking.check_in.slice(0, 10)}T12:00:00`
);
balanceDueDate.setDate(balanceDueDate.getDate() - 30);

const balanceDueDateLabel = balanceDueDate.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
  // Only confirmed, paid payment records count as money received.
  const paidPayments = payments.filter(
    (payment) => payment.status === "paid"
  );

  const paidTotal = paidPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  // Do not subtract extras separately here.
  // The booking total already includes the selected extras.
  const remaining = Math.max(0, total - paidTotal);

  const fullyPaid = remaining < 0.01 && total > 0;
  const partiallyPaid = paidTotal > 0 && !fullyPaid;

  const statusLabel = fullyPaid
    ? "Fully paid"
    : partiallyPaid
      ? "Deposit / part payment received"
      : "Payment outstanding";

  const statusBackground = fullyPaid
    ? colors.paleGreen
    : colors.paleOrange;

  const statusColor = fullyPaid
    ? colors.green
    : colors.orange;

  return (
    <main style={{
      minHeight: "100vh",
      background: colors.background,
      padding: "30px 18px 60px",
      color: colors.dark,
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        <Link
          to="/account"
          style={{
            display: "inline-block",
            marginBottom: 24,
            color: colors.green,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ← Back to your account
        </Link>

        <header style={{ marginBottom: 26 }}>
          <p style={{
            color: colors.green,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
          }}>
            STATIC HOLIDAYS
          </p>

          <h1 style={{
            fontSize: 32,
            lineHeight: 1.2,
            color: colors.dark,
            margin: "0 0 10px",
          }}>
            My Holiday & Payments
          </h1>

          <p style={textStyle}>
            Your holiday details, payment breakdown and outstanding balance.
          </p>
        </header>

        <section style={cardStyle}>
          <p style={{
            color: colors.green,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
            margin: "0 0 8px",
          }}>
            YOUR HOLIDAY
          </p>

          <h2 style={{ ...headingStyle, fontSize: 25 }}>
            {booking.properties?.title || "Your holiday"}
          </h2>

          {booking.properties?.location && (
            <p style={textStyle}>
              {booking.properties.location}
            </p>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 20,
          }}>
            <div style={{
              background: "#f3f7f2",
              borderRadius: 12,
              padding: 16,
            }}>
              <p style={{ ...textStyle, margin: "0 0 6px" }}>
                CHECK-IN
              </p>
              <strong>{formatDate(booking.check_in)}</strong>
            </div>

            <div style={{
              background: "#f3f7f2",
              borderRadius: 12,
              padding: 16,
            }}>
              <p style={{ ...textStyle, margin: "0 0 6px" }}>
                CHECK-OUT
              </p>
              <strong>{formatDate(booking.check_out)}</strong>
            </div>
          </div>

          <div style={{
            display: "inline-block",
            marginTop: 18,
            padding: "8px 14px",
            borderRadius: 30,
            background: colors.paleGreen,
            color: colors.green,
            fontSize: 13,
            fontWeight: 700,
          }}>
            {booking.booking_status === "confirmed"
              ? "✓ Booking confirmed"
              : booking.booking_status}
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={headingStyle}>Your payment summary</h2>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 15,
          }}>
            <span style={textStyle}>Total holiday cost</span>
            <strong>{money(total)}</strong>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 15,
          }}>
            <span style={textStyle}>Payments received</span>
            <strong style={{ color: colors.green }}>
              {money(paidTotal)}
            </strong>
          </div>

          <div style={{
            height: 1,
            background: colors.border,
            margin: "18px 0",
          }} />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}>
            <strong style={{ color: colors.dark }}>
              Remaining balance
            </strong>
            <strong style={{
              fontSize: 25,
              color: remaining > 0 ? colors.dark : colors.green,
            }}>
              {money(remaining)}
            </strong>
          </div>

          <div style={{
            display: "inline-block",
            marginTop: 18,
            background: statusBackground,
            color: statusColor,
            borderRadius: 30,
            padding: "9px 14px",
            fontSize: 12,
            fontWeight: 700,
          }}>
            {statusLabel}
          </div>

          {partiallyPaid && (
            <p style={textStyle}>
              Thank you. Your deposit or part payment has been received.
              Your holiday is not yet fully paid, and the remaining balance
              is shown above.
            </p>
          )}

          {fullyPaid && (
            <p style={textStyle}>
              Thank you. We have recorded payment of your full holiday cost.
            </p>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={headingStyle}>Your holiday price breakdown</h2>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 15,
          }}>
            <span style={textStyle}>Holiday accommodation and booking</span>
            <strong>
              {money(
                total -
                extras.reduce(
                  (sum, extra) => sum + Number(extra.line_total || 0),
                  0
                )
              )}
            </strong>
          </div>

          {extras.length === 0 ? (
            <p style={textStyle}>No extras were selected.</p>
          ) : (
            extras.map((extra) => (
              <div
                key={extra.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: 13,
                  marginTop: 13,
                }}
              >
                <div>
                  <strong style={{ color: colors.dark }}>
                    {extra.extra_name}
                  </strong>
                  <p style={{ ...textStyle, margin: "4px 0 0" }}>
                    Quantity: {extra.quantity}
                    {" · "}
                    {extra.payment_timing === "deposit"
                      ? "Pay with deposit"
                      : "Pay with balance"}
                  </p>
                </div>

                <strong>{money(extra.line_total)}</strong>
              </div>
            ))
          )}

          <div style={{
            borderTop: `1px solid ${colors.border}`,
            marginTop: 18,
            paddingTop: 16,
            display: "flex",
            justifyContent: "space-between",
          }}>
            <strong>Total</strong>
            <strong>{money(total)}</strong>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={headingStyle}>Your payment history</h2>

          {payments.length === 0 ? (
            <p style={textStyle}>
              No payment records are available yet.
            </p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                style={{
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: 14,
                  marginTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong style={{ color: colors.dark }}>
                    {paymentTypeLabel(payment.payment_type)}
                  </strong>

                  <p style={{ ...textStyle, margin: "4px 0" }}>
                    {payment.paid_at
                      ? `Paid ${new Date(payment.paid_at).toLocaleDateString("en-GB")}`
                      : `Created ${new Date(payment.created_at).toLocaleDateString("en-GB")}`}
                  </p>

                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: payment.status === "paid"
                      ? colors.green
                      : colors.orange,
                  }}>
                    {payment.status === "paid"
                      ? "Payment received"
                      : payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                  </span>
                </div>

                <strong>{money(payment.amount)}</strong>
              </div>
            ))
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={headingStyle}>Your remaining balance</h2>

          {fullyPaid ? (
            <p style={textStyle}>
              Your holiday is fully paid. Thank you!
            </p>
          ) : (
            <>

<p style={textStyle}>
  Your remaining balance is {money(remaining)}. You can pay the outstanding amount securely by card using Stripe.
</p>

<p style={{
  ...textStyle,
  fontWeight: 700,
  color: colors.dark,
}}>
  Balance payment due by: {balanceDueDateLabel}
</p>

<p style={{
  ...textStyle,
  color: colors.orange,
  background: colors.paleOrange,
  padding: 12,
  borderRadius: 10,
}}>
  Important: Your remaining balance must be paid by the due date.
  If payment is not received by then, your holiday booking may be
  cancelled in accordance with our cancellation terms.
</p>

<div style={{ marginTop: 16 }}>
  <label
    htmlFor="custom-payment-amount"
    style={{
      display: "block",
      marginBottom: 8,
      color: colors.text,
      fontWeight: 600,
    }}
  >
    Or enter an amount to pay (£)
  </label>

  <input
    id="custom-payment-amount"
    type="number"
    min="1"
    max={remaining.toFixed(2)}
    step="0.01"
    value={customAmount}
    onChange={(event) => setCustomAmount(event.target.value)}
    placeholder="Enter amount"
    style={{
      width: "100%",
      boxSizing: "border-box",
      padding: "13px",
      border: `1px solid ${colors.border}`,
      borderRadius: 10,
      fontSize: 16,
    }}
  />
</div>

<button
  type="button"
  onClick={handlePayCustom}
  disabled={
    payingCustom ||
    payingBalance ||
    remaining <= 0 ||
    !customAmount.trim() ||
    Number(customAmount) < 1 ||
    Number(customAmount) > remaining
  }
  style={{
    width: "100%",
    marginTop: 12,
    padding: "14px 20px",
    border: `1px solid ${colors.green}`,
    borderRadius: 10,
    background: colors.white,
    color: colors.green,
    fontSize: 15,
    fontWeight: 700,
    cursor: payingCustom ? "wait" : "pointer",
    opacity: payingCustom ? 0.7 : 1,
  }}
>
  {payingCustom ? "Connecting to secure payment…" : "Pay custom amount"}
</button>

<button
  type="button"
  onClick={handlePayBalance}
  disabled={payingBalance || payingCustom || remaining <= 0}
  style={{
    width: "100%",
    marginTop: 16,
    padding: "14px 20px",
    border: "none",
    borderRadius: 10,
    background: colors.green,
    color: colors.white,
    fontSize: 15,
    fontWeight: 700,
    cursor: payingBalance ? "wait" : "pointer",
    opacity: payingBalance ? 0.7 : 1,
  }}
>
  {payingBalance
    ? "Connecting to secure payment…"
    : `Pay remaining balance — ${money(remaining)}`}
</button>

              <div style={{
                background: "#f3f7f2",
                borderRadius: 12,
                padding: 16,
                color: colors.text,
                fontSize: 13,
                lineHeight: 1.7,
              }}>
                Your balance payment will be processed securely through
                Stripe. No additional payment will be taken from this page
                until the balance checkout is ready.
              </div>
            </>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={headingStyle}>Managing your extras</h2>
          <p style={textStyle}>
            Your selected extras and their payment timings are shown in
            your price breakdown. We are preparing the option to request
            changes or cancellations to eligible extras here.
          </p>
        </section>

        <p style={{
          textAlign: "center",
          color: colors.muted,
          fontSize: 12,
          marginTop: 30,
        }}>
          © 2026 Static Holidays
        </p>
      </div>
    </main>
  );
}
