
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PropertyForm = {
  title: string;
  location: string;
  description: string;
  property_type: string;
  holiday_park: string;
  bedrooms: number;
  bathrooms: number;
  sleeps: number;
  nightly_price: string;
  pet_friendly: boolean;
  family_friendly: boolean;
  equine_friendly: boolean;
  has_log_burner: boolean;
  has_garden: boolean;
  has_pool: boolean;
  pool_type: string;
  has_hot_tub: boolean;
  wifi: boolean;
  parking: boolean;
  sea_view: boolean;
  wheelchair_friendly: boolean;
  holiday_types: string[];
  features: string[];
  equine_facilities: string[];
};

const initialForm: PropertyForm = {
  title: "",
  location: "",
  description: "",
  property_type: "",
  holiday_park: "",
  bedrooms: 1,
  bathrooms: 1,
  sleeps: 2,
  nightly_price: "",
  pet_friendly: false,
  family_friendly: false,
  equine_friendly: false,
  has_log_burner: false,
  has_garden: false,
  has_pool: false,
  pool_type: "none",
  has_hot_tub: false,
  wifi: false,
  parking: false,
  sea_view: false,
  wheelchair_friendly: false,
  holiday_types: [],
  features: [],
  equine_facilities: [],
};

const holidayOptions = [
  "Family holiday",
  "Pet-friendly holiday",
  "Equestrian holiday",
  "Romantic break",
  "Walking holiday",
  "Countryside escape",
  "Coastal holiday",
  "Accessible holiday",
];

const featureOptions = [
  "Log burner",
  "Garden",
  "Hot tub",
  "Swimming pool",
  "Wi-Fi",
  "Parking",
  "Sea view",
  "Wheelchair accessible",
  "BBQ",
  "Games room",
  "Washing machine",
  "Dishwasher",
];

const equineOptions = [
  "Horse stabling",
  "Turnout paddock",
  "Secure horse grazing",
  "Horse trailer parking",
  "Wash-down area",
  "On-site riding arena",
  "Direct access to bridleways",
  "Hay and feed storage",
];

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "11px 12px",
  border: "1px solid #d6ded8",
  borderRadius: 8,
  fontSize: 15,
  background: "#fff",
  color: "#203128",
};

const sectionStyle = {
  background: "#fff",
  border: "1px solid #e0e7e1",
  borderRadius: 14,
  padding: 22,
  marginBottom: 18,
};

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<PropertyForm>(initialForm);
  const [ownerId, setOwnerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [photos, setPhotos] = useState<
    { id: string; public_url: string; storage_path: string; is_cover: boolean }[]
  >([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setErrorMessage("No property ID was provided.");
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .eq("owner_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setErrorMessage(
            "This property could not be found, or you do not have permission to edit it."
          );
          return;
        }

        if (cancelled) return;

        setOwnerId(user.id);
        setForm({
          ...initialForm,
          title: data.title ?? "",
          location: data.location ?? "",
          description: data.description ?? "",
          property_type: data.property_type ?? "",
          holiday_park: data.holiday_park ?? "",
          bedrooms: Number(data.bedrooms ?? 1),
          bathrooms: Number(data.bathrooms ?? 1),
          sleeps: Number(data.sleeps ?? 2),
          nightly_price:
            data.nightly_price != null
              ? String(data.nightly_price)
              : data.price_per_night != null
                ? String(data.price_per_night)
                : "",
          pet_friendly: Boolean(data.pet_friendly),
          family_friendly: Boolean(data.family_friendly),
          equine_friendly: Boolean(data.equine_friendly),
          has_log_burner: Boolean(data.has_log_burner),
          has_garden: Boolean(data.has_garden),
          has_pool: Boolean(data.has_pool),
          pool_type: data.pool_type ?? (data.has_pool ? "outdoor" : "none"),
          has_hot_tub: Boolean(data.has_hot_tub),
          wifi: Boolean(data.wifi),
          parking: Boolean(data.parking),
          sea_view: Boolean(data.sea_view),
          wheelchair_friendly: Boolean(data.wheelchair_friendly),
          holiday_types: Array.isArray(data.holiday_types)
            ? data.holiday_types
            : [],
          features: Array.isArray(data.features) ? data.features : [],
          equine_facilities: Array.isArray(data.equine_facilities)
            ? data.equine_facilities
            : [],
        });

        const { data: imageRows, error: imageError } = await supabase
          .from("property_images")
          .select("id, public_url, storage_path, is_cover")
          .eq("property_id", id)
          .order("position", { ascending: true });

        if (cancelled) return;

        if (imageError) {
          console.error("Could not load property photos:", imageError);
        } else {
          setPhotos(imageRows ?? []);
          const cover = (imageRows ?? []).find((photo: any) => photo.is_cover);
          setCoverPhotoId(cover?.id ?? imageRows?.[0]?.id ?? "");
        }
      } catch (error) {
        console.error("Could not load property for editing:", error);
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Could not load property."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  function update<K extends keyof PropertyForm>(
    key: K,
    value: PropertyForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleOption(
    key: "holiday_types" | "features" | "equine_facilities",
    option: string
  ) {
    setForm((current) => {
      const currentValues = current[key];
      return {
        ...current,
        [key]: currentValues.includes(option)
          ? currentValues.filter((item) => item !== option)
          : [...currentValues, option],
      };
    });
  }

  function toggleBoolean(
    key:
      | "pet_friendly"
      | "family_friendly"
      | "equine_friendly"
      | "has_log_burner"
      | "has_garden"
      | "has_pool"
      | "has_hot_tub"
      | "wifi"
      | "parking"
      | "sea_view"
      | "wheelchair_friendly",
    checked: boolean
  ) {
    update(key, checked);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || saving) return;

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user || user.id !== ownerId) {
        throw new Error("Please log in as the owner of this property.");
      }

      if (!form.title.trim()) {
        throw new Error("Please enter a property name.");
      }

      const price =
        form.nightly_price.trim() === ""
          ? null
          : Number(form.nightly_price);

      if (
        price !== null &&
        (!Number.isFinite(price) || price < 0)
      ) {
        throw new Error("Enter a valid nightly price.");
      }

      const propertyUpdate = {
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        property_type: form.property_type,
        holiday_park: form.holiday_park.trim(),
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        sleeps: form.sleeps,
        nightly_price: price,
        pet_friendly: form.pet_friendly,
        family_friendly: form.family_friendly,
        equine_friendly: form.equine_friendly,
        has_log_burner: form.has_log_burner,
        has_garden: form.has_garden,
        has_pool: form.has_pool,
        pool_type: form.has_pool ? form.pool_type : "none",
        has_hot_tub: form.has_hot_tub,
        wifi: form.wifi,
        parking: form.parking,
        sea_view: form.sea_view,
        wheelchair_friendly: form.wheelchair_friendly,
        holiday_types: form.holiday_types,
        features: form.features,
        equine_facilities: form.equine_facilities,
      };

      const { error: updateError } = await supabase
        .from("properties")
        .update(propertyUpdate)
        .eq("id", id)
        .eq("owner_id", user.id);

      if (updateError) throw updateError;

      for (let index = 0; index < newPhotos.length; index++) {
        const file = newPhotos[index];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `${user.id}/${id}/${Date.now()}-${index}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(storagePath, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("property-images")
          .getPublicUrl(storagePath);

        const { error: imageInsertError } = await supabase
          .from("property_images")
          .insert({
            property_id: id,
            owner_id: user.id,
            storage_path: storagePath,
            public_url: publicData.publicUrl,
            is_cover: photos.length === 0 && index === 0,
            position: photos.length + index,
          });

        if (imageInsertError) throw imageInsertError;
      }

      if (coverPhotoId) {
        const { error: unsetError } = await supabase
          .from("property_images")
          .update({ is_cover: false })
          .eq("property_id", id)
          .eq("owner_id", user.id);

        if (unsetError) throw unsetError;

        const { error: coverError } = await supabase
          .from("property_images")
          .update({ is_cover: true })
          .eq("id", coverPhotoId)
          .eq("property_id", id)
          .eq("owner_id", user.id);

        if (coverError) throw coverError;
      }

      setSuccessMessage("Your property details have been saved.");
      setNewPhotos([]);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Could not save property:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Could not save your changes."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePhoto(photo: (typeof photos)[number]) {
    if (!id || !ownerId) return;

    const confirmed = window.confirm(
      "Delete this photo from the property listing? This cannot be undone."
    );
    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error: rowError } = await supabase
        .from("property_images")
        .delete()
        .eq("id", photo.id)
        .eq("property_id", id)
        .eq("owner_id", ownerId);

      if (rowError) throw rowError;

      if (photo.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("property-images")
          .remove([photo.storage_path]);

        if (storageError) {
          console.error("Photo record deleted, but storage cleanup failed:", storageError);
        }
      }

      setPhotos((current) => current.filter((item) => item.id !== photo.id));

      if (coverPhotoId === photo.id) {
        const nextPhoto = photos.find((item) => item.id !== photo.id);
        setCoverPhotoId(nextPhoto?.id ?? "");
      }

      setSuccessMessage("Photo deleted.");
    } catch (error) {
      console.error("Could not delete photo:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Could not delete photo."
      );
    }
  }

  if (loading) {
    return <p style={{ padding: 32 }}>Loading property details…</p>;
  }

  if (errorMessage && !ownerId) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
        <h1>Unable to edit property</h1>
        <p role="alert">{errorMessage}</p>
        <button type="button" onClick={() => navigate("/host-dashboard")}>
          Back to owner dashboard
        </button>
      </main>
    );
  }

  const checkboxes = (
    options: string[],
    key: "holiday_types" | "features" | "equine_facilities"
  ) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}
    >
      {options.map((option) => (
        <label key={option} style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={form[key].includes(option)}
            onChange={() => toggleOption(key, option)}
          />
          {option}
        </label>
      ))}
    </div>
  );

  const booleanFields: {
    key:
      | "family_friendly"
      | "pet_friendly"
      | "equine_friendly"
      | "has_log_burner"
      | "has_garden"
      | "has_hot_tub"
      | "wifi"
      | "parking"
      | "sea_view"
      | "wheelchair_friendly";
    label: string;
  }[] = [
    { key: "family_friendly", label: "Family friendly" },
    { key: "pet_friendly", label: "Pets welcome" },
    { key: "equine_friendly", label: "Equine friendly" },
    { key: "has_log_burner", label: "Log burner" },
    { key: "has_garden", label: "Garden" },
    { key: "has_hot_tub", label: "Hot tub" },
    { key: "wifi", label: "Wi-Fi" },
    { key: "parking", label: "Parking" },
    { key: "sea_view", label: "Sea view" },
    { key: "wheelchair_friendly", label: "Wheelchair friendly" },
  ];

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "30px 18px 60px",
        color: "#203128",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/host-dashboard")}
        style={{
          border: 0,
          background: "transparent",
          color: "#176b50",
          padding: "8px 0",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        ← Back to owner dashboard
      </button>

      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Edit your property</h1>
      <p style={{ color: "#68756e", lineHeight: 1.6, marginTop: 0 }}>
        Update your listing below. Your changes apply to this property.
      </p>

      {errorMessage && (
        <div
          role="alert"
          style={{
            ...sectionStyle,
            background: "#fff5f4",
            borderColor: "#e9c2bd",
            color: "#9b3024",
          }}
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          style={{
            ...sectionStyle,
            background: "#eef8f0",
            borderColor: "#b9d9c0",
            color: "#176b50",
          }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={save}>
        <section style={sectionStyle}>
          <h2>Property details</h2>
          <div style={{ display: "grid", gap: 16 }}>
            <label>
              Property name *
              <input
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                style={fieldStyle}
              />
            </label>

            <label>
              Location or postcode
              <input
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                style={fieldStyle}
              />
            </label>

            <label>
              Property type
              <select
                value={form.property_type}
                onChange={(e) => update("property_type", e.target.value)}
                style={fieldStyle}
              >
                <option value="">Select property type</option>
                <option value="cottage">Cottage</option>
                <option value="holiday_home">Holiday home</option>
                <option value="static_caravan">Static caravan</option>
                <option value="lodge">Lodge</option>
                <option value="apartment">Apartment</option>
                <option value="farmhouse">Farmhouse</option>
                <option value="cabin">Cabin</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Holiday park (if applicable)
              <input
                value={form.holiday_park}
                onChange={(e) => update("holiday_park", e.target.value)}
                style={fieldStyle}
              />
            </label>

            <label>
              Description
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                style={{ ...fieldStyle, resize: "vertical" }}
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 14,
              }}
            >
              <label>
                Bedrooms
                <input
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", Number(e.target.value))}
                  style={fieldStyle}
                />
              </label>
              <label>
                Bathrooms
                <input
                  type="number"
                  min="0"
                  value={form.bathrooms}
                  onChange={(e) => update("bathrooms", Number(e.target.value))}
                  style={fieldStyle}
                />
              </label>
              <label>
                Sleeps
                <input
                  type="number"
                  min="1"
                  value={form.sleeps}
                  onChange={(e) => update("sleeps", Number(e.target.value))}
                  style={fieldStyle}
                />
              </label>
              <label>
                Nightly price (£)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.nightly_price}
                  onChange={(e) => update("nightly_price", e.target.value)}
                  style={fieldStyle}
                />
              </label>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>Facilities and suitability</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {booleanFields.map(({ key, label }) => (
              <label key={key} style={{ display: "flex", gap: 9, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => toggleBoolean(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>

          <label style={{ display: "block", marginTop: 20 }}>
            Swimming pool type
            <select
              value={form.pool_type}
              onChange={(e) => {
                update("pool_type", e.target.value);
                update("has_pool", e.target.value !== "none");
              }}
              style={fieldStyle}
            >
              <option value="none">No pool</option>
              <option value="outdoor">Outdoor pool</option>
              <option value="indoor">Indoor pool</option>
              <option value="shared">Shared pool</option>
              <option value="private">Private pool</option>
            </select>
          </label>
        </section>

        <section style={sectionStyle}>
          <h2>Holiday types</h2>
          {checkboxes(holidayOptions, "holiday_types")}
        </section>

        <section style={sectionStyle}>
          <h2>More property features</h2>
          {checkboxes(featureOptions, "features")}
        </section>

        <section style={sectionStyle}>
          <h2>Equine facilities</h2>
          <p style={{ color: "#68756e", lineHeight: 1.6 }}>
            Select only facilities that are actually available to guests and their horses.
          </p>
          {checkboxes(equineOptions, "equine_facilities")}
        </section>

        <section style={sectionStyle}>
          <h2>Property photos</h2>
          <p style={{ color: "#68756e", lineHeight: 1.6 }}>
            Choose a cover photo and add more images to your existing listing.
          </p>

          {photos.length === 0 && (
            <p style={{ color: "#68756e" }}>
              No saved photos were found for this property.
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
            }}
          >
            {photos.map((photo) => (
              <div key={photo.id} style={{ border: "1px solid #e0e7e1", borderRadius: 10, padding: 8 }}>
                <img
                  src={photo.public_url}
                  alt="Property"
                  style={{ width: "100%", height: 125, objectFit: "cover", borderRadius: 7 }}
                />
                <label style={{ display: "flex", gap: 7, alignItems: "center", fontSize: 13, margin: "10px 0" }}>
                  <input
                    type="radio"
                    name="cover-photo"
                    checked={coverPhotoId === photo.id}
                    onChange={() => setCoverPhotoId(photo.id)}
                  />
                  Cover photo
                </label>
                <button
                  type="button"
                  onClick={() => void deletePhoto(photo)}
                  style={{ border: "1px solid #d8b9b5", background: "#fff", color: "#a33427", padding: "7px 9px", borderRadius: 7, cursor: "pointer" }}
                >
                  Delete photo
                </button>
              </div>
            ))}
          </div>

          <label style={{ display: "block", marginTop: 20 }}>
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setNewPhotos(files);
              }}
              style={{ ...fieldStyle, marginTop: 8 }}
            />
          </label>

          {newPhotos.length > 0 && (
            <p style={{ color: "#176b50" }}>
              {newPhotos.length} new photo(s) selected. They will upload when you save.
            </p>
          )}
        </section>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              border: 0,
              borderRadius: 9,
              padding: "13px 20px",
              background: "#176b50",
              color: "#fff",
              fontWeight: 800,
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? "Saving changes…" : "Save property changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/property-calendar/${id}`)}
            style={{
              border: "1px solid #176b50",
              borderRadius: 9,
              padding: "13px 20px",
              background: "#fff",
              color: "#176b50",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Open calendar
          </button>
        </div>
      </form>
    </main>
  );
}
