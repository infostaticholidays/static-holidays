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

      wifi: wifi,
      parking: parking,
      sea_view: seaView,
      wheelchair_friendly: wheelchairFriendly,
    },
  ]);

  if (error) {
    console.error("SUPABASE ERROR:", error);
    alert(`Error: ${error.message}`);
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
export default function AddProperty() {
  return <div>Add Property Page</div>;
}
