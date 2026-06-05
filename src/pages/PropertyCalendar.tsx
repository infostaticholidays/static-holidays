import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PropertyCalendar() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [priceOverride, setPriceOverride] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  async function saveDate() {
    const { error } = await supabase
      .from("property_calendar")
      .insert([
        {
          property_id: propertyId,
          date,
          is_blocked: isBlocked,
          price_override:
            priceOverride === ""
              ? null
              : Number(priceOverride),
        },
      ]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Calendar updated");
    setDate("");
    setPriceOverride("");
    setIsBlocked(false);
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial",
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
        <h2>Block Dates / Set Prices</h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "10px",
            display: "block",
          }}
        />

        <input
          type="number"
          placeholder="Custom price (£)"
          value={priceOverride}
          onChange={(e) =>
            setPriceOverride(e.target.value)
          }
          style={{
            padding: "10px",
            marginBottom: "10px",
            display: "block",
          }}
        />

        <label>
          <input
            type="checkbox"
            checked={isBlocked}
            onChange={() =>
              setIsBlocked(!isBlocked)
            }
          />
          {" "}Block this date
        </label>

        <br />
        <br />

        <button
          onClick={saveDate}
          style={{
            background: "#14532d",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Save Calendar Entry
        </button>
      </div>

      <br />

      <button
        onClick={() =>
          navigate("/host-dashboard")
        }
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
  );
}
