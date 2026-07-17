import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

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

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function PropertyCalendar() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState(new Date().getFullYear());

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
     <h2>Availability & Pricing</h2>

<p>
Manage your property's availability, seasonal pricing, blocked dates and special offers.
</p>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  }}
>
  <button
    style={greenBtn}
    onClick={() => setYear(year - 1)}
  >
    ← Previous Year
  </button>

  <h2>{year}</h2>

  <button
    style={greenBtn}
    onClick={() => setYear(year + 1)}
  >
    Next Year →
  </button>
</div>

        <div
          style={{
            display: "flex",
            gap: 15,
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          <button style={greenBtn}>🚫 Block Dates</button>

          <button style={greenBtn}>💷 Change Prices</button>

          <button style={greenBtn}>🔥 Special Offers</button>

          <button style={greenBtn}>📅 Sync Calendar</button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
        }}
      >
      {months.map((month, index) => {
  const days = getDaysInMonth(year, index);
  const firstDay = getFirstDayOfMonth(year, index);

  return (
    <div
      key={month}
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 15,
        background: "white",
      }}
    >
             {Array.from({ length: days }).map((_, day) => (
          <div
            key={day}
            style={{
              padding: 8,
              borderRadius: 6,
              background:"#f8faf8",
              cursor:"pointer",
            }}
          >
            {day + 1}
          </div>
        ))}

      </div>
    </div>
  );
})}

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


        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={"empty-"+i}></div>
        ))}


        {Array.from({ length: days }).map((_, day) => (
          <div
            key={day}
            style={{
              padding: 8,
              borderRadius: 6,
              background:"#f8faf8",
              cursor:"pointer",
            }}
          >
            {day + 1}
          </div>
        ))}

      </div>
    </div>
  );
})}
     <h3
  style={{
    textAlign: "center",
    marginBottom: 15,
    color: "#14532d",
  }}
>
  {month} {year}
</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gap: 4,
                marginTop: 10,
              }}
            >
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 32,
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "white",
                  }}
                >
                  {i + 1 <= 31 ? i + 1 : ""}
                </div>
              ))}
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

const greenBtn = {
  background: "#14532d",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: 8,
  cursor: "pointer",
};
