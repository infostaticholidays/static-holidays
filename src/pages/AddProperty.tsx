import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AddProperty() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [petFriendly, setPetFriendly] = useState(false);
  const [pool, setPool] = useState("none");
  const [hotTub, setHotTub] = useState(false);

  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [seaView, setSeaView] = useState(false);
  const [wheelchairFriendly, setWheelchairFriendly] = useState(false);

  async function submit() {
    const { error } = await supabase
      .from("properties")
      .insert([
        {
          title: name,
          location: location,

          pet_friendly: petFriendly,
          has_pool: pool !== "none",
          has_hot_tub: hotTub,

          wifi: wifi,
          parking: parking,
          sea_view: seaView,
          wheelchair_friendly: wheelchairFriendly,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Error saving property");
      return;
    }

    alert("Property saved successfully!");

    setName("");
    setLocation("");
    setPetFriendly(false);
    setPool("none");
    setHotTub(false);
    setWifi(false);
    setParking(false);
    setSeaView(false);
    setWheelchairFriendly(false);
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Add Property</h1>

      <input
        placeholder="Property Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={input}
      />

      <input
        placeholder="Price Per Night (£)"
        style={input}
      />

      <input
        placeholder="Bedrooms"
        style={input}
      />

      <input
        placeholder="Bathrooms"
        style={input}
      />

      <input
        placeholder="Max Guests"
        style={input}
      />

      <textarea
        placeholder="Property Description"
        rows={5}
        style={{
          ...input,
          minHeight: "120px",
        }}
      />

      <h3>Property Photos</h3>

      <input type="file" multiple />

      <br />
      <br />

      <h3>Amenities</h3>

      <label>
        <input
          type="checkbox"
          checked={wifi}
          onChange={() => setWifi(!wifi)}
        />
        {" "}WiFi
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={parking}
          onChange={() => setParking(!parking)}
        />
        {" "}Parking
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={seaView}
          onChange={() => setSeaView(!seaView)}
        />
        {" "}Sea View
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={wheelchairFriendly}
          onChange={() => setWheelchairFriendly(!wheelchairFriendly)}
        />
        {" "}Disabled Access
      </label>

      <br />
      <br />

      <h3>Verification Documents</h3>

      <p>Upload ID</p>
      <input type="file" />

      <br />
      <br />

      <p>Upload Insurance Certificate</p>
      <input type="file" />

      <br />
      <br />

      <h3>Filters</h3>

      <label>
        <input
          type="checkbox"
          checked={petFriendly}
          onChange={() => setPetFriendly(!petFriendly)}
        />
        {" "}Pet Friendly
      </label>

      <br />
      <br />

      <select
        value={pool}
        onChange={(e) => setPool(e.target.value)}
        style={input}
      >
        <option value="none">No Pool</option>
        <option value="shared">Shared Pool</option>
        <option value="private">Private Pool</option>
      </select>

      <br />
      <br />

      <label>
        <input
          type="checkbox"
          checked={hotTub}
          onChange={() => setHotTub(!hotTub)}
        />
        {" "}Hot Tub
      </label>

      <br />
      <br />

      <button onClick={submit} style={btn}>
        Save Property
      </button>
    </div>
  );
}

const input = {
  display: "block",
  width: "100%",
  maxWidth: "600px",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const btn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "14px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};
