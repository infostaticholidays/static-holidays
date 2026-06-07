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
    if (!date) {
      alert("Please select a date");
      return;
    }

    const { error } = await supabase
      .from("property_calendar")
      .insert([
        {
          property_id: propertyId,
          date: date,
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

    alert("Calendar updated successfully!");

    setDate("");
    setPriceOverride("");
    setIsBlocked(false);
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
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
        <h2>Manage Availability</h2>

        <label>Select Date</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        />

        <label>Custom Price (£)</label>

        <input
          type="number"
          placeholder="Leave empty for normal price"
          value={priceOverride}
          onChange={(e) => setPriceOverride(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        />

        <label>
          <input
            type="checkbox"
            checked={isBlocked}
            onChange={() => setIsBlocked(!isBlocked)}
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

      <div style={{ marginTop: "30px" }}>
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
