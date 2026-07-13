import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase.from("properties").insert([
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
    ]);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      alert(error.message);
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
    <div style={{ padding: 40 }}>
      <h1>Add Property</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <button onClick={submit}>
        Save Property
      </button>
    </div>
  );
}
