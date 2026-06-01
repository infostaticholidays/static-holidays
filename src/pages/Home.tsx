import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ padding: "40px" }}>

      {/* SEARCH */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>Find Your Perfect Holiday</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destination..."
          style={{
            padding: "12px",
            width: "60%",
            marginTop: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* DEALS */}
      <h2>☀️ Summer & Half Term Deals</h2>

      <div style={{ display: "grid", gap: "15px" }}>
        <div>Beach Escape - Cornwall - £89/night</div>
        <div>Family Break - Devon - £120/night</div>
        <div>Luxury Lodge - Lake District - £150/night</div>
      </div>

      {/* RECOMMENDATIONS */}
      <h2 style={{ marginTop: "40px" }}>⭐ Recommendations</h2>
      <ul>
        <li>Top Rated Coastal Stays</li>
        <li>Best Family Parks</li>
        <li>Romantic Getaways</li>
      </ul>

      {/* BEST REVIEWED */}
      <h2 style={{ marginTop: "40px" }}>🏆 Best Reviewed Holidays</h2>

      <div style={{ background: "#f3f3f3", padding: "15px" }}>
        <p>★★★★★ Cornwall Caravan Park</p>
        <p>★★★★★ Devon Beach Resort</p>
        <p>★★★★★ Lake District Lodge</p>
      </div>

    </div>
  );
}
