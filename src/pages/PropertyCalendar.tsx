import { useParams, useNavigate } from "react-router-dom";

export default function PropertyCalendar() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#14532d" }}>
        📅 Property Calendar
      </h1>

      <p>
        <strong>Property ID:</strong> {propertyId}
      </p>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h2>Calendar Management</h2>

        <p>
          This is where owners will:
        </p>

        <ul>
          <li>✅ Block dates</li>
          <li>✅ Set custom prices</li>
          <li>✅ Add special offers</li>
          <li>✅ Sync Airbnb calendars later</li>
          <li>✅ Sync Booking.com calendars later</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => navigate("/host-dashboard")}
          style={{
            background: "#14532d",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
