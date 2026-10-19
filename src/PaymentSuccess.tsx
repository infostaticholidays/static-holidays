import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const payment = searchParams.get("payment");

  const paymentCancelled = payment === "cancelled";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f2",
        padding: "60px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#203128",
      }}
    >
      <div
        style={{
          maxWidth: 620,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 18,
          padding: "36px 28px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: paymentCancelled ? "#fef3c7" : "#dcfce7",
              color: paymentCancelled ? "#92400e" : "#166534",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            {paymentCancelled ? "!" : "✓"}
          </div>

          <h1 style={{ fontSize: 30, margin: "0 0 14px" }}>
            {paymentCancelled
              ? "Payment not completed"
              : "Thank you for choosing Static Holidays!"}
          </h1>

          <p style={{ color: "#647568", lineHeight: 1.7, margin: 0 }}>
            {paymentCancelled
              ? "Your checkout was cancelled or not completed. You have not received a payment confirmation."
              : "Thank you for your payment. We're looking forward to welcoming you for your stay."}
          </p>
        </div>

        {!paymentCancelled && (
          <div
            style={{
              background: "#f3f7f2",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
              lineHeight: 1.7,
            }}
          >
            <h2 style={{ fontSize: 18, marginTop: 0 }}>
              What happens next?
            </h2>

            <p>
              Your payment is being checked. Your booking and payment
              confirmation will be available once payment has been verified.
            </p>

            <p>
              If a balance remains, we'll let you know the amount and when
              it needs to be paid.
            </p>

            <p style={{ marginBottom: 0 }}>
              If you've paid in full, no further payment will be due for
              this booking.
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Link
            to="/booking"
            style={{
              background: "#315640",
              color: "#ffffff",
              padding: "12px 18px",
              borderRadius: 9,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            View my booking
          </Link>

          <Link
            to="/"
            style={{
              border: "1px solid #d6e0d5",
              color: "#315640",
              padding: "12px 18px",
              borderRadius: 9,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Return home
          </Link>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#849087",
            fontSize: 12,
            marginTop: 28,
            marginBottom: 0,
          }}
        >
          Static Holidays · Thank you for booking with us
        </p>
      </div>
    </main>
  );
}
