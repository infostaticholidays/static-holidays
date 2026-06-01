export default function HolidayOwners() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "50px 20px", fontFamily: "Arial" }}>

      {/* TITLE */}
      <h1 style={{ fontSize: "40px", color: "#14532d", marginBottom: "10px" }}>
        Holiday Home Owners
      </h1>

      <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "30px" }}>
        List your caravan, lodge or holiday home on Static Holidays and reach thousands of guests across the UK.
      </p>

      {/* PRICING TABLE */}
      <div style={{ overflowX: "auto", marginBottom: "40px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>

          <thead>
            <tr style={{ background: "#14532d", color: "white" }}>
              <th style={th}>Plan</th>
              <th style={th}>Monthly Price</th>
              <th style={th}>Commission</th>
              <th style={th}>Features</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={td}><b>🔑 Host (Free)</b></td>
              <td style={td}>£0</td>
              <td style={td}>12%</td>
              <td style={td}>Basic listing, bookings, messaging</td>
            </tr>

            <tr style={{ background: "#f9fafb" }}>
              <td style={td}><b>🏖️ Super Host</b></td>
              <td style={td}>£19.99</td>
              <td style={td}>5%</td>
              <td style={td}>Higher ranking, featured boost, visibility</td>
            </tr>

            <tr>
              <td style={td}><b>👑 Elite Host</b></td>
              <td style={td}>£39.99</td>
              <td style={td}>1%</td>
              <td style={td}>Homepage feature, ads, blog, priority support</td>
            </tr>
          </tbody>

        </table>
      </div>

      {/* BENEFITS */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#14532d" }}>Why Join Us?</h2>

        <ul style={{ lineHeight: "2", fontSize: "16px", color: "#374151" }}>
          <li>✔ Reach thousands of UK holidaymakers</li>
          <li>✔ Get direct bookings instantly</li>
          <li>✔ Promote your caravan or lodge easily</li>
          <li>✔ Upgrade anytime for more visibility</li>
        </ul>
      </div>

      {/* CTA BUTTON */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => window.location.href = "/login"}
          style={{
            background: "#16a34a",
            color: "white",
            padding: "15px 30px",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Login / Add Property
        </button>

        <button
          onClick={() => window.location.href = "/signup"}
          style={{
            background: "#14532d",
            color: "white",
            padding: "15px 30px",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          Become a Host
        </button>
      </div>

    </div>
  );
}

const th = {
  padding: "14px",
  textAlign: "left",
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};
