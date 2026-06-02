import { useState } from "react";

export default function AddProperty() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [petFriendly, setPetFriendly] = useState(false);
  const [pool, setPool] = useState("none");
  const [hotTub, setHotTub] = useState(false);

  function submit() {
    console.log({
      name,
      location,
      petFriendly,
      pool,
      hotTub,
    });

    alert("Property saved (demo)");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Add Property</h1>

     <h1>Add Property</h1>

<input
  placeholder="Property Name"
  onChange={(e) => setName(e.target.value)}
/>

<br /><br />

<input
  placeholder="Location"
  onChange={(e) => setLocation(e.target.value)}
/>

<br /><br />

<input placeholder="Price Per Night (£)" />

<br /><br />

<input placeholder="Bedrooms" />

<br /><br />

<input placeholder="Bathrooms" />

<br /><br />

<input placeholder="Max Guests" />

<br /><br />

<textarea
  placeholder="Property Description"
  rows={5}
  style={{ width: "100%", maxWidth: "500px" }}
/>

<br /><br />

<h3>Property Photos</h3>
      <h3>Amenities</h3>

<label>
  <input type="checkbox" />
  WiFi
</label>

<br />

<label>
  <input type="checkbox" />
  Parking
</label>

<br />

<label>
  <input type="checkbox" />
  Sea View
</label>

<br />

<label>
  <input type="checkbox" />
  Disabled Access
</label>

<br /><br />

<h3>Verification Documents</h3>

<p>Upload ID</p>
<input type="file" />

<br /><br />

<p>Upload Insurance Certificate</p>
<input type="file" />

<br /><br />

<input type="file" multiple />

<br /><br />

      <h3>Filters</h3>

      <label>
        <input type="checkbox" onChange={() => setPetFriendly(!petFriendly)} />
        Pet Friendly
      </label>

      <br />

      <select onChange={(e) => setPool(e.target.value)}>
        <option value="none">No Pool</option>
        <option value="shared">Shared Pool</option>
        <option value="private">Private Pool</option>
      </select>

      <br />

      <label>
        <input type="checkbox" onChange={() => setHotTub(!hotTub)} />
        Hot Tub
      </label>

      <br /><br />

      <button onClick={submit}>Save Property</button>
    </div>
  );
}
