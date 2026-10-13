
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const green = "#14532d";

const featureOptions = [
  "Log burner",
  "Hot tub",
  "Swimming pool",
  "Garden",
  "Parking",
  "Wi-Fi",
  "Sea view",
  "Wheelchair accessible",
  "BBQ",
  "Fire pit",
  "Dishwasher",
  "Washing machine",
  "Cot and highchair",
  "Enclosed garden",
  "Private outdoor space",
  "Games room",
  "EV charging",
  "Rural location",
];

const holidayOptions = [
  "Family holidays",
  "Pet-friendly holidays",
  "Equestrian holidays",
  "Romantic breaks",
  "Accessible holidays",
  "Countryside escapes",
  "Coastal holidays",
  "Group holidays",
];

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 15,
  background: "#ffffff",
  color: "#1f2937",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  fontSize: 14,
  marginBottom: 7,
  color: "#374151",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 24,
        marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.025)",
      }}
    >
      <h2 style={{ fontSize: 20, color: green, margin: "0 0 6px" }}>
        {title}
      </h2>
      {description && (
        <p style={{ color: "#6b7280", margin: "0 0 20px", fontSize: 14 }}>
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

export default function AddProperty() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Cottage");
  const [holidayPark, setHolidayPark] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [sleeps, setSleeps] = useState(2);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [holidayTypes, setHolidayTypes] = useState<string[]>([
    "Family holidays",
  ]);
  const [features, setFeatures] = useState<string[]>([]);
  const [poolType, setPoolType] = useState("none");
  const [equineFacilities, setEquineFacilities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      // Clean up preview URLs when this page is closed.
      photos.forEach((photo) => {
        const url = URL.createObjectURL(photo);
        URL.revokeObjectURL(url);
      });
    };
  }, [photos]);

  function toggleItem(
    item: string,
    values: string[],
    setter: (values: string[]) => void
  ) {
    setter(
      values.includes(item)
        ? values.filter((value) => value !== item)
        : [...values, item]
    );
  }

  function handlePhotos(files: FileList | null) {
    if (!files) return;

    const selected = Array.from(files);
    const valid = selected.filter((file) => {
      if (!file.type.startsWith("image/")) return false;

      if (file.size > 10 * 1024 * 1024) {
        setMessage(`${file.name} is larger than 10 MB and was not added.`);
        return false;
      }

      return true;
    });

    setPhotos((current) => {
      const combined = [...current, ...valid].slice(0, 20);
      if (current.length + valid.length > 20) {
        setMessage("You can upload a maximum of 20 photos.");
      }
      return combined;
    });
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      const updated = current.filter((_, i) => i !== index);
      if (index === coverIndex) setCoverIndex(0);
      else if (index < coverIndex) setCoverIndex((value) => value - 1);
      return updated;
    });
  }

  async function submit() {
    setMessage("");

    if (!name.trim() || !location.trim() || !description.trim()) {
      setMessage("Please enter a property name, location and description.");
      return;
    }

    if (bedrooms < 1 || bathrooms < 1 || sleeps < 1) {
      setMessage("Bedrooms, bathrooms and guest capacity must be at least 1.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setMessage("Please log in before adding a property.");
        navigate("/login");
        return;
      }

      const poolSelected = poolType !== "none";

      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          owner_id: user.id,
          title: name.trim(),
          description: description.trim(),
          property_type: propertyType,
          holiday_park: holidayPark.trim() || null,
          location: location.trim(),
          bedrooms,
          bathrooms,
          sleeps,
          pet_friendly: holidayTypes.includes("Pet-friendly holidays"),
          family_friendly: holidayTypes.includes("Family holidays"),
          equine_friendly: holidayTypes.includes("Equestrian holidays"),
          has_pool: poolSelected,
          pool_type: poolType,
          has_hot_tub: features.includes("Hot tub"),
          has_log_burner: features.includes("Log burner"),
          has_garden: features.includes("Garden"),
          wifi: features.includes("Wi-Fi"),
          parking: features.includes("Parking"),
          sea_view: features.includes("Sea view"),
          wheelchair_friendly: features.includes("Wheelchair accessible"),
          holiday_types: holidayTypes,
          features,
          equine_facilities: equineFacilities,
          nightly_price: price.trim() ? Number(price) : null,
          status: "draft",
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Upload selected photos to the property-images bucket.
      // Each image is linked to the new property in property_images.
      if (photos.length > 0) {
        const orderedPhotos = [...photos];
        const coverPhoto = orderedPhotos.splice(coverIndex, 1)[0];
        const uploadOrder = coverPhoto
          ? [coverPhoto, ...orderedPhotos]
          : photos;

        const photoRows = [];

        for (let i = 0; i < uploadOrder.length; i++) {
          const file = uploadOrder[i];
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${user.id}/${property.id}/${Date.now()}-${i}-${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(path, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            });

          if (uploadError) {
            throw new Error(
              `Property was saved, but photo "${file.name}" could not upload: ${uploadError.message}`
            );
          }

          const { data: urlData } = supabase.storage
            .from("property-images")
            .getPublicUrl(path);

          photoRows.push({
            property_id: property.id,
            owner_id: user.id,
            storage_path: path,
            public_url: urlData.publicUrl,
            is_cover: i === 0,
            position: i,
          });
        }

        const { error: photoError } = await supabase
          .from("property_images")
          .insert(photoRows);

        if (photoError) {
          throw new Error(
            `Property was saved, but its photo records could not be saved: ${photoError.message}`
          );
        }
      }

      navigate(`/property-calendar/${property.id}`);
    } catch (error) {
      console.error("ADD PROPERTY ERROR:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your property."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ background: "#f7f9f7", minHeight: "100vh", padding: "32px 16px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: green, fontWeight: 700, marginBottom: 8 }}>
            STATIC HOLIDAYS · OWNER AREA
          </p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 38px)", color: green, margin: "0 0 10px" }}>
            Add your holiday property
          </h1>
          <p style={{ color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            Tell guests what makes your property special. You can save the
            listing as a draft before making it available to guests.
          </p>
        </div>

        {message && (
          <div
            role="alert"
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#9a3412",
              padding: 14,
              borderRadius: 8,
              marginBottom: 20,
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </div>
        )}

        <Section
          title="1. Property details"
          description="Give your holiday accommodation a name and introduce it to guests."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            <div>
              <label style={labelStyle}>Property name *</label>
              <input
                style={inputStyle}
                placeholder="e.g. Willow Cottage"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Property type *</label>
              <select
                style={inputStyle}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                {[
                  "Cottage",
                  "Holiday lodge",
                  "Static caravan",
                  "Farmhouse",
                  "Barn conversion",
                  "Apartment",
                  "Holiday home",
                  "Cabin",
                  "Glamping",
                  "Other",
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Holiday park (if applicable)</label>
              <input
                style={inputStyle}
                placeholder="Holiday park name"
                value={holidayPark}
                onChange={(e) => setHolidayPark(e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Price per night (£)</label>
              <input
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 95"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={labelStyle}>Property description *</label>
            <textarea
              style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
              placeholder="Describe the accommodation, surrounding area, nearby attractions and what guests will love about staying here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginTop: 20 }}>
            {[
              { label: "Bedrooms", value: bedrooms, set: setBedrooms },
              { label: "Bathrooms", value: bathrooms, set: setBathrooms },
              { label: "Sleeps", value: sleeps, set: setSleeps },
            ].map((item) => (
              <div key={item.label}>
                <label style={labelStyle}>{item.label} *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  max="100"
                  value={item.value}
                  onChange={(e) => item.set(Math.max(1, Number(e.target.value)))}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="2. Who is your property suitable for?"
          description="Select all the types of holidays you welcome."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {holidayOptions.map((item) => {
              const checked = holidayTypes.includes(item);
              return (
                <label
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 13,
                    borderRadius: 9,
                    border: `1px solid ${checked ? "#39834b" : "#e5e7eb"}`,
                    background: checked ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(item, holidayTypes, setHolidayTypes)}
                  />
                  <span style={{ fontSize: 14 }}>{item}</span>
                </label>
              );
            })}
          </div>
        </Section>

        <Section
          title="3. Facilities and features"
          description="Help guests find the features that matter most to them."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
            {featureOptions.map((item) => {
              const checked = features.includes(item);
              return (
                <label
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 12,
                    border: `1px solid ${checked ? "#39834b" : "#e5e7eb"}`,
                    borderRadius: 8,
                    background: checked ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(item, features, setFeatures)}
                  />
                  <span style={{ fontSize: 14 }}>{item}</span>
                </label>
              );
            })}
          </div>

          <div style={{ marginTop: 22 }}>
            <label style={labelStyle}>Swimming pool</label>
            <select
              style={inputStyle}
              value={poolType}
              onChange={(e) => setPoolType(e.target.value)}
            >
              <option value="none">No swimming pool</option>
              <option value="private">Private swimming pool</option>
              <option value="shared">Shared swimming pool</option>
              <option value="indoor">Indoor swimming pool</option>
              <option value="outdoor">Outdoor swimming pool</option>
            </select>
          </div>
        </Section>

        <Section
          title="4. Equine facilities"
          description="Make your property easier to discover for guests travelling with horses."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
            {[
              "On-site stabling",
              "Paddocks",
              "Horse grazing",
              "Horse trailer parking",
              "Horse washing area",
              "Direct access to riding trails",
              "Nearby riding facilities",
              "Nearby livery yard",
            ].map((item) => (
              <label
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 12,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={equineFacilities.includes(item)}
                  onChange={() => toggleItem(item, equineFacilities, setEquineFacilities)}
                />
                <span style={{ fontSize: 14 }}>{item}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section
          title="5. Property photographs"
          description="Add up to 20 images. Images must be 10 MB or smaller each. Choose a cover photo to appear first."
        >
          <label
            style={{
              display: "block",
              padding: "28px 16px",
              textAlign: "center",
              border: "2px dashed #9ca3af",
              borderRadius: 10,
              background: "#f9fafb",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "block", fontSize: 30, marginBottom: 8 }}>📷</span>
            <strong>Choose property photos</strong>
            <span style={{ display: "block", color: "#6b7280", fontSize: 13, marginTop: 6 }}>
              Select multiple photos from your phone or computer
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                handlePhotos(e.target.files);
                e.currentTarget.value = "";
              }}
              style={{ display: "block", margin: "14px auto 0", maxWidth: "100%" }}
            />
          </label>

          {photos.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 14, color: "#374151" }}>
                {photos.length} photo{photos.length === 1 ? "" : "s"} selected.
                Choose which photo should be the cover.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                {photos.map((photo, index) => (
                  <div key={`${photo.name}-${photo.lastModified}-${index}`} style={{ border: "1px solid #e5e7eb", borderRadius: 9, padding: 8, minWidth: 0 }}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={photo.name}
                      style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 6 }}
                    />
                    <p style={{ fontSize: 12, overflowWrap: "anywhere" }}>{photo.name}</p>
                    <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12 }}>
                      <input
                        type="radio"
                        name="coverPhoto"
                        checked={coverIndex === index}
                        onChange={() => setCoverIndex(index)}
                      />
                      Cover photo
                    </label>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      style={{ marginTop: 8, border: 0, background: "#fee2e2", color: "#991b1b", borderRadius: 5, padding: "6px 9px", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        <Section
          title="6. Property location"
          description="Enter the address or nearest town. The map preview uses Google Maps; guests should only see the exact address if you choose to publish it."
        >
          <label style={labelStyle}>Address, town or postcode *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Minehead, Somerset"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {location.trim() && (
            <div style={{ marginTop: 16 }}>
              <iframe
                title="Google Maps property location preview"
                src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 10 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-block", marginTop: 10, color: green, fontWeight: 600 }}
              >
                Check location in Google Maps ↗
              </a>
            </div>
          )}
        </Section>

        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
            Your listing will be saved as a draft. Review the details and photographs before making it visible to guests.
          </p>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: 0,
              borderRadius: 9,
              background: saving ? "#6b7280" : green,
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 16,
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? "Saving property and photos..." : "Save Property & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
