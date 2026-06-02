import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function HostDashboard() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    async function loadProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      setProperties(data || []);
    }

    loadProperties();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#14532d" }}>
        Host Dashboard
      </h1>

      <p>
        Manage your holiday properties, bookings and guests.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={card}>
          <h2>🏡 Properties</h2>

          <p>{properties.length} Properties Listed</p>

          <ul>
            {properties.map((property) => (
              <li key={property.id}>
                {property.title}
              </li>
            ))}
          </ul>
        </div>

        <div style={card}>
          <h2>📅 Bookings</h2>
          <p>0 Upcoming Bookings</p>
        </div>

        <div style={card}>
          <h2>💬 Messages</h2>
          <p>0 New Messages</p>
        </div>

        <div style={card}>
          <h2>🛡 Verification</h2>
          <p>Pending</p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <button
          style={btn}
          onClick={() => {
            window.history.pushState({}, "", "/add-property");
            window.dispatchEvent(
              new PopStateEvent("popstate")
            );
          }}
        >
          ➕ Add Property
        </button>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const btn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "14px 24px",
  borderRadius: "8px",
  cursor: "pointer",
};
