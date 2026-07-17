import { useParams, useNavigate } from "react-router-dom";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PropertyCalendar() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "40px auto",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <h1>📅 Property Calendar</h1>

      <p>
        <strong>Property ID:</strong> {propertyId}
      </p>

      <div
        style={{
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 12,
          marginTop: 20,
          marginBottom: 30,
        }}
      >
        <h2>2026 Calendar</h2>

        <p>
          Select dates to block, change prices and create special offers.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
        }}
      >
        {months.map((month) => (
          <div
            key={month}
            style={{
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              minHeight: 180,
            }}
          >
            <h3>{month}</h3>

            <div
              style={{
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
              }}
            >
              Calendar coming soon...
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/host-dashboard")}
        style={{
          marginTop: 40,
          background: "#14532d",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
