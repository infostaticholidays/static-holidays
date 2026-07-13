import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AddProperty() {
  const navigate = useNavigate();
const [name, setName] = useState("");
const [location, setLocation] = useState("");

const [propertyType, setPropertyType] = useState("");
const [holidayPark, setHolidayPark] = useState("");
const [bedrooms, setBedrooms] = useState(1);
const [bathrooms, setBathrooms] = useState(1);
const [sleeps, setSleeps] = useState(2);
const [description, setDescription] = useState("");

const [petFriendly, setPetFriendly] = useState(false);
const [pool, setPool] = useState("none");
const [hotTub, setHotTub] = useState(false);
const [wifi, setWifi] = useState(false);
const [parking, setParking] = useState(false);
const [seaView, setSeaView] = useState(false);
const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
  async function submit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

   const { data, error } = await supabase
  .from("properties")
  .insert([
    {
      owner_id: user.id,
      title: name,
      location: location,

      pet_friendly: petFriendly,
      has_pool: pool !== "none",
      has_hot_tub: hotTub,

      wifi,
      parking,
      sea_view: seaView,
      wheelchair_friendly: wheelchairFriendly,
    },
  ])
  .select()
  .single();
    
    if (error) {
      console.error("SUPABASE ERROR:", error);
      alert(error.message);
      return;
    }
navigate(`/property-calendar/${data.id}`);

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
    <div style={{ padding: 40 }}>
      <h1>Add Property</h1>

  <input
  placeholder="Location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
/>

<br /><br />

<input
  placeholder="Property Type"
  value={propertyType}
  onChange={(e) => setPropertyType(e.target.value)}
/>

<br /><br />

<input
  placeholder="Holiday Park"
  value={holidayPark}
  onChange={(e) => setHolidayPark(e.target.value)}
/>

<br /><br />

<input
  type="number"
  placeholder="Bedrooms"
  value={bedrooms}
  onChange={(e) => setBedrooms(Number(e.target.value))}
/>

<br /><br />

<input
  type="number"
  placeholder="Bathrooms"
  value={bathrooms}
  onChange={(e) => setBathrooms(Number(e.target.value))}
/>

<br /><br />

<input
  type="number"
  placeholder="Sleeps"
  value={sleeps}
  onChange={(e) => setSleeps(Number(e.target.value))}
/>

<br /><br />

<textarea
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={5}
/>

<br /><br />

<button onClick={submit}>
  Save Property
</button>
    </div>
  );
}
