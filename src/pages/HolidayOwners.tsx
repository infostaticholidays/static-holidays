export default function HolidayOwners() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#14532d",
          marginBottom: "20px",
        }}
      >
        Why List With Static Holidays?
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "18px",
          marginBottom: "50px",
        }}
      >
        More visibility. More control. Lower fees.
      </p>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        Choose Your Host Plan
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "25px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🔑 Host</h2>
          <h3>£0 per month</h3>

          <p>Up to 2 properties</p>
          <p>Direct booking enquiries</p>
          <p>Availability calendar</p>
          <p>Commission: 12%</p>
        </div>

        <div
          style={{
            background: "#dcfce7",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🏖️ Super Host</h2>
          <h3>£19.99 per month</h3>

          <p>Up to 4 properties</p>
          <p>Higher search rankings</p>
          <p>Featured in searches</p>
          <p>Commission: 6%</p>
        </div>

        <div
          style={{
            background: "#fef3c7",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2>👑 Elite Host</h2>
          <h3>£39.99 per month</h3>

          <p>Unlimited properties</p>
          <p>Homepage promotion</p>
          <p>Newsletter promotion</p>
          <p>Airbnb calendar sync</p>
          <p>Booking.com calendar sync</p>
          <p>Commission: 2%</p>
        </div>
      </div>
    </div>
  );
}
