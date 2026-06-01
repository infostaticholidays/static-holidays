export default function HolidayOwners() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#14532d",
          fontSize: "42px",
          marginBottom: "20px",
        }}
      >
        Holiday Home Owners
      </h1>

      <p
        style={{
          fontSize: "20px",
          lineHeight: "1.8",
          color: "#4b5563",
          marginBottom: "40px",
        }}
      >
        Welcome to Static Holidays. We help holiday home owners advertise
        their caravans, lodges and holiday properties to thousands of
        holidaymakers looking for their next UK getaway.
      </p>

      <div
        style={{
          background: "#f0fdf4",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ color: "#14532d" }}>
          Why Advertise With Static Holidays?
        </h2>

        <ul
          style={{
            lineHeight: "2",
            fontSize: "18px",
            color: "#374151",
          }}
        >
          <li>Reach holidaymakers across the UK.</li>
          <li>Advertise caravans, lodges and holiday homes.</li>
          <li>Receive direct booking enquiries.</li>
          <li>Manage your availability calendar.</li>
          <li>Promote special offers and last-minute deals.</li>
          <li>Showcase your property with photos and descriptions.</li>
        </ul>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ color: "#14532d" }}>
          How To List Your Holiday Home
        </h2>

        <ol
          style={{
            lineHeight: "2",
            fontSize: "18px",
            color: "#374151",
          }}
        >
          <li>Create your Holiday Owner account.</li>
          <li>Add your caravan, lodge or holiday property.</li>
          <li>Upload photos and property details.</li>
          <li>Set your prices and availability.</li>
          <li>Start receiving enquiries and bookings.</li>
        </ol>
      </div>

      <div
        style={{
          background: "#14532d",
          color: "white",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>
          Ready To Advertise Your Holiday Home?
        </h2>

        <p
          style={{
            fontSize: "18px",
            marginBottom: "25px",
          }}
        >
          Join Static Holidays and start reaching more holidaymakers today.
        </p>

        <button
          style={{
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Become A Holiday Owner
        </button>
      </div>
    </div>
  );
}
