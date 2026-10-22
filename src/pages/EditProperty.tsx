
import { useEffect, useState, type FormEvent, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PropertyForm = {
  title: string;
  location: string;
  description: string;
    house_rules: string;
  hot_tub_instructions: string;
  nearby_information: string;
  check_in_time: string;
  check_in_timezone: string;
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

type PropertyPhoto = {
  id: string;
  public_url: string;
  storage_path: string;
  is_cover: boolean;
};

const initialForm: PropertyForm = {
  title: "",
  location: "",
  description: "",
    house_rules: "",
  hot_tub_instructions: "",
  nearby_information: "",
  check_in_time: "15:00",
  check_in_timezone: "Europe/London",
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

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid #dce4dc",
  borderRadius: 10,
  fontSize: 14,
  background: "#fff",
  color: "#203128",
  marginTop: 7,
  outlineColor: "#176b50",
};

const labelStyle: CSSProperties = {
  display: "block",
  color: "#34483c",
  fontSize: 13,
  fontWeight: 650,
};

const cardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5ebe5",
  borderRadius: 16,
  padding: 24,
  marginBottom: 18,
  boxShadow: "0 3px 12px rgba(31, 54, 39, 0.035)",
  minWidth: 0,
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "1px solid #d7e1d8",
  borderRadius: 10,
  padding: "11px 15px",
  background: "#fff",
  color: "#176b50",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 13,
};

const primaryButtonStyle: CSSProperties = {
  border: 0,
  borderRadius: 10,
  padding: "13px 20px",
  background: "#176b50",
  color: "#fff",
  fontWeight: 750,
  fontSize: 14,
  cursor: "pointer",
};

const sectionHeadingStyle: CSSProperties = {
  fontSize: 19,
  letterSpacing: "-0.4px",
  margin: "0 0 6px",
  color: "#203128",
};

const sectionDescriptionStyle: CSSProperties = {
  color: "#758078",
  fontSize: 13,
  lineHeight: 1.6,
  margin: "0 0 22px",
};

const twoColumnGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: 17,
};

const optionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
  gap: 10,
};

const iconBoxStyle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 12,
  background: "#eaf4ec",
  display: "grid",
  placeItems: "center",
  color: "#176b50",
  fontSize: 20,
  flexShrink: 0,
};

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<PropertyForm>(initialForm);
  const [ownerId, setOwnerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState("");
    const [arrivalDetails, setArrivalDetails] = useState({
  house_rules: "",
  hot_tub_instructions: "",
  check_in_instructions: "",
  key_safe_location: "",
  key_safe_code: "",
  owner_contact_details: "",
  arrival_notes: "",
});

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
                    house_rules: data.house_rules ?? "",
          hot_tub_instructions: data.hot_tub_instructions ?? "",
          nearby_information: data.nearby_information ?? "",
          check_in_time: data.check_in_time
            ? String(data.check_in_time).slice(0, 5)
            : "15:00",
          check_in_timezone: data.check_in_timezone ?? "Europe/London",
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
        const { data: arrivalData, error: arrivalError } = await supabase
          .from("property_arrival_details")
          .select(
            "check_in_instructions, key_safe_location, key_safe_code, owner_contact_details, arrival_notes"
          )
          .eq("property_id", id)
          .maybeSingle();

        if (arrivalError) {
          console.error("Could not load private arrival details:", arrivalError);
          setErrorMessage(
            "Your property loaded, but private arrival details could not be loaded. Please check the arrival-information permissions in Supabase."
          );
        } else if (arrivalData && !cancelled) {
          setArrivalDetails({
            check_in_instructions: arrivalData.check_in_instructions ?? "",
            key_safe_location: arrivalData.key_safe_location ?? "",
            key_safe_code: arrivalData.key_safe_code ?? "",
            owner_contact_details: arrivalData.owner_contact_details ?? "",
            arrival_notes: arrivalData.arrival_notes ?? "",
          });
        }
        const { data: imageRows, error: imageError } = await supabase
          .from("property_images")
          .select("id, public_url, storage_path, is_cover")
          .eq("property_id", id)
          .order("position", { ascending: true });

        if (cancelled) return;

        if (imageError) {
          console.error("Could not load property photos:", imageError);
          setErrorMessage(
            "Your property details loaded, but your photos could not be loaded. Please check the property_images permissions in Supabase."
          );
        } else {
          const loadedPhotos = (imageRows ?? []) as PropertyPhoto[];
          setPhotos(loadedPhotos);

          const cover = loadedPhotos.find((photo) => photo.is_cover);
          setCoverPhotoId(cover?.id ?? loadedPhotos[0]?.id ?? "");
        }
      } catch (error) {
        console.error("Could not load property for editing:", error);

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load property."
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

      if (price !== null && (!Number.isFinite(price) || price < 0)) {
        throw new Error("Enter a valid nightly price.");
      }

      const propertyUpdate = {
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
                house_rules: form.house_rules.trim(),
        hot_tub_instructions: form.hot_tub_instructions.trim(),
        nearby_information: form.nearby_information.trim(),
        check_in_time: form.check_in_time,
        check_in_timezone: form.check_in_timezone,
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

      const { data: updatedRows, error: updateError } = await supabase
        .from("properties")
        .update(propertyUpdate)
        .eq("id", id)
        .eq("owner_id", user.id)
        .select("id");

      if (updateError) throw updateError;

      if (!updatedRows || updatedRows.length === 0) {
        throw new Error(
          "No property was updated. Check that you own this listing and have permission to edit it."
        );
      }
      const { error: arrivalSaveError } = await supabase
        .from("property_arrival_details")
        .upsert(
          {
            property_id: id,
            check_in_instructions:
              arrivalDetails.check_in_instructions.trim(),
            key_safe_location: arrivalDetails.key_safe_location.trim(),
            key_safe_code: arrivalDetails.key_safe_code.trim(),
            owner_contact_details:
              arrivalDetails.owner_contact_details.trim(),
            arrival_notes: arrivalDetails.arrival_notes.trim(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "property_id" }
        );

      if (arrivalSaveError) {
        throw new Error(
          `Property details were saved, but private arrival details could not be saved: ${arrivalSaveError.message}`
        );
      }
      const uploadedPhotos: PropertyPhoto[] = [];

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

        const { data: insertedPhoto, error: imageInsertError } =
          await supabase
            .from("property_images")
            .insert({
              property_id: id,
              owner_id: user.id,
              storage_path: storagePath,
              public_url: publicData.publicUrl,
              is_cover: photos.length === 0 && index === 0,
              position: photos.length + index,
            })
            .select("id, public_url, storage_path, is_cover")
            .single();

        if (imageInsertError) {
          await supabase.storage
            .from("property-images")
            .remove([storagePath]);

          throw imageInsertError;
        }

        uploadedPhotos.push(insertedPhoto as PropertyPhoto);
      }

      const allPhotos = [...photos, ...uploadedPhotos];

      if (coverPhotoId) {
        const chosenCover = allPhotos.find(
          (photo) => photo.id === coverPhotoId
        );

        if (!chosenCover) {
          throw new Error(
            "The selected cover photo could not be found. Please select a cover photo and save again."
          );
        }

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
      } else if (allPhotos.length > 0) {
        const firstPhoto = allPhotos[0];

        const { error: unsetError } = await supabase
          .from("property_images")
          .update({ is_cover: false })
          .eq("property_id", id)
          .eq("owner_id", user.id);

        if (unsetError) throw unsetError;

        const { error: coverError } = await supabase
          .from("property_images")
          .update({ is_cover: true })
          .eq("id", firstPhoto.id)
          .eq("property_id", id)
          .eq("owner_id", user.id);

        if (coverError) throw coverError;

        setCoverPhotoId(firstPhoto.id);
      }

      const { data: refreshedPhotos, error: refreshError } = await supabase
        .from("property_images")
        .select("id, public_url, storage_path, is_cover")
        .eq("property_id", id)
        .order("position", { ascending: true });

      if (refreshError) {
        console.error("Could not refresh photos:", refreshError);
      } else {
        const savedPhotos = (refreshedPhotos ?? []) as PropertyPhoto[];
        setPhotos(savedPhotos);

        const savedCover = savedPhotos.find((photo) => photo.is_cover);
        setCoverPhotoId(savedCover?.id ?? savedPhotos[0]?.id ?? "");
      }

      setNewPhotos([]);
      setSuccessMessage("Your property details and photos have been saved.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Could not save property:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not save your changes."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePhoto(photo: PropertyPhoto) {
    if (!id || !ownerId || saving) return;

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

      const remainingPhotos = photos.filter((item) => item.id !== photo.id);
      setPhotos(remainingPhotos);

      if (coverPhotoId === photo.id) {
        const nextPhoto = remainingPhotos[0];
        setCoverPhotoId(nextPhoto?.id ?? "");

        if (nextPhoto) {
          const { error: unsetError } = await supabase
            .from("property_images")
            .update({ is_cover: false })
            .eq("property_id", id)
            .eq("owner_id", ownerId);

          if (unsetError) throw unsetError;

          const { error: coverError } = await supabase
            .from("property_images")
            .update({ is_cover: true })
            .eq("id", nextPhoto.id)
            .eq("property_id", id)
            .eq("owner_id", ownerId);

          if (coverError) throw coverError;

          setPhotos((current) =>
            current.map((item) => ({
              ...item,
              is_cover: item.id === nextPhoto.id,
            }))
          );
        }
      }

      setSuccessMessage("Photo deleted.");
    } catch (error) {
      console.error("Could not delete photo:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Could not delete photo."
      );
    }
  }

  function renderOptions(
    options: string[],
    key: "holiday_types" | "features" | "equine_facilities"
  ) {
    return (
      <div style={optionGridStyle}>
        {options.map((option) => {
          const selected = form[key].includes(option);

          return (
            <label
              key={option}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 13px",
                border: `1px solid ${selected ? "#176b50" : "#e0e7e1"}`,
                background: selected ? "#eef7f0" : "#fff",
                borderRadius: 10,
                cursor: "pointer",
                color: selected ? "#176b50" : "#46564b",
                fontSize: 13,
                fontWeight: selected ? 650 : 450,
              }}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleOption(key, option)}
                style={{ accentColor: "#176b50", width: 16, height: 16 }}
              />
              {option}
            </label>
          );
        })}
      </div>
    );
  }

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

  const coverPhoto =
    photos.find((photo) => photo.id === coverPhotoId) ?? photos[0];

  const hasValidPrice =
    form.nightly_price.trim() !== "" &&
    Number.isFinite(Number(form.nightly_price)) &&
    Number(form.nightly_price) >= 0;

  const previewPrice = hasValidPrice
    ? `£${Number(form.nightly_price).toLocaleString("en-GB")}`
    : "Price not set";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8f5",
        color: "#203128",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "24px 18px 60px",
      }}
    >
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate("/host-dashboard")}
          style={{
            ...secondaryButtonStyle,
            border: "none",
            background: "transparent",
            padding: "8px 0",
            marginBottom: 20,
          }}
        >
          ← Back to owner dashboard
        </button>

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 18,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div>
            <p
              style={{
                color: "#176b50",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                margin: "0 0 9px",
              }}
            >
              HOST CENTRE / YOUR LISTINGS
            </p>

            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 38px)",
                letterSpacing: "-1.2px",
                lineHeight: 1.15,
                margin: "0 0 10px",
              }}
            >
              Edit your property
            </h1>

            <p style={{ color: "#738077", margin: 0, lineHeight: 1.6, fontSize: 14 }}>
              Make your listing shine and keep your details up to date.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/property-calendar/${id}`)}
            style={secondaryButtonStyle}
          >
            ▦ Manage calendar
          </button>
        </header>

        {errorMessage && (
          <div
            role="alert"
            style={{
              ...cardStyle,
              borderColor: "#efc8c2",
              background: "#fff5f3",
              color: "#9b3024",
            }}
          >
            <strong>Something needs your attention</strong>
            <p style={{ marginBottom: 0, lineHeight: 1.6 }}>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            style={{
              ...cardStyle,
              borderColor: "#b9d9c0",
              background: "#eef8f0",
              color: "#176b50",
            }}
          >
            <strong>✓ Changes saved successfully</strong>
            <p style={{ marginBottom: 0, lineHeight: 1.6 }}>{successMessage}</p>
          </div>
        )}

        <form onSubmit={save}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 320px)",
              gap: 22,
              alignItems: "start",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <section style={cardStyle}>
                <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 24 }}>
                  <div style={iconBoxStyle}>⌂</div>
                  <div>
                    <h2 style={sectionHeadingStyle}>Property details</h2>
                    <p style={{ ...sectionDescriptionStyle, margin: 0 }}>
                      The essential information guests see when they discover your property.
                    </p>
                  </div>
                </div>

                <div style={twoColumnGridStyle}>
                  <label style={labelStyle}>
                    Property name *
                    <input
                      required
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Meadow View Cottage"
                    />
                  </label>

                  <label style={labelStyle}>
                    Location or postcode
                    <input
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      style={inputStyle}
                      placeholder="Town, county or postcode"
                    />
                  </label>

                  <label style={labelStyle}>
                    Property type
                    <select
                      value={form.property_type}
                      onChange={(e) => update("property_type", e.target.value)}
                      style={inputStyle}
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

                  <label style={labelStyle}>
                    Holiday park (if applicable)
                    <input
                      value={form.holiday_park}
                      onChange={(e) => update("holiday_park", e.target.value)}
                      style={inputStyle}
                      placeholder="Holiday park name"
                    />
                  </label>
                </div>

                <label style={{ ...labelStyle, marginTop: 19 }}>
                  Property description
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                    placeholder="Tell guests what makes your property special…"
                  />
                </label>

                <div style={{ ...twoColumnGridStyle, marginTop: 19 }}>
                  <label style={labelStyle}>
                    Bedrooms
                    <input
                      type="number"
                      min="0"
                      value={form.bedrooms}
                      onChange={(e) => update("bedrooms", Number(e.target.value))}
                      style={inputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Bathrooms
                    <input
                      type="number"
                      min="0"
                      value={form.bathrooms}
                      onChange={(e) => update("bathrooms", Number(e.target.value))}
                      style={inputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Sleeps
                    <input
                      type="number"
                      min="1"
                      value={form.sleeps}
                      onChange={(e) => update("sleeps", Number(e.target.value))}
                      style={inputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Nightly price (£)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.nightly_price}
                      onChange={(e) => update("nightly_price", e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. 125"
                    />
                  </label>
                </div>
              </section>

              <section style={cardStyle}>
                <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 22 }}>
                  <div style={iconBoxStyle}>✳</div>
                  <div>
                    <h2 style={sectionHeadingStyle}>Facilities & suitability</h2>
                    <p style={{ ...sectionDescriptionStyle, margin: 0 }}>
                      Help guests find a stay that suits them.
                    </p>
                  </div>
                </div>

                <div style={optionGridStyle}>
                  {booleanFields.map(({ key, label }) => {
                    const selected = form[key];

                    return (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 13px",
                          border: `1px solid ${selected ? "#176b50" : "#e0e7e1"}`,
                          background: selected ? "#eef7f0" : "#fff",
                          borderRadius: 10,
                          cursor: "pointer",
                          color: selected ? "#176b50" : "#46564b",
                          fontSize: 13,
                          fontWeight: selected ? 650 : 450,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => toggleBoolean(key, e.target.checked)}
                          style={{ accentColor: "#176b50", width: 16, height: 16 }}
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>

                <label style={{ ...labelStyle, display: "block", marginTop: 22 }}>
                  Swimming pool type
                  <select
                    value={form.pool_type}
                    onChange={(e) => {
                      update("pool_type", e.target.value);
                      update("has_pool", e.target.value !== "none");
                    }}
                    style={inputStyle}
                  >
                    <option value="none">No pool</option>
                    <option value="outdoor">Outdoor pool</option>
                    <option value="indoor">Indoor pool</option>
                    <option value="shared">Shared pool</option>
                    <option value="private">Private pool</option>
                  </select>
                </label>
              </section>

              <section style={cardStyle}>
                <h2 style={sectionHeadingStyle}>Holiday types</h2>
                <p style={sectionDescriptionStyle}>
                  Select the kinds of breaks your property is suitable for.
                </p>
                {renderOptions(holidayOptions, "holiday_types")}
              </section>

              <section style={cardStyle}>
                <h2 style={sectionHeadingStyle}>More property features</h2>
                <p style={sectionDescriptionStyle}>
                  Add useful extras to help guests compare listings.
                </p>
                {renderOptions(featureOptions, "features")}
              </section>

              <section style={cardStyle}>
                <h2 style={sectionHeadingStyle}>Equine facilities</h2>
                <p style={sectionDescriptionStyle}>
                  Select only facilities that are actually available to guests and their horses.
                </p>
                {renderOptions(equineOptions, "equine_facilities")}
              </section>

              <section style={cardStyle}>
                <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={iconBoxStyle}>▧</div>
                  <div>
                    <h2 style={sectionHeadingStyle}>Property photos</h2>
                    <p style={{ ...sectionDescriptionStyle, margin: 0 }}>
                      Choose the first image guests should see, or add new photos.
                    </p>
                  </div>
                </div>

                {photos.length === 0 && (
                  <div style={{ padding: 22, background: "#f7f9f6", borderRadius: 12, color: "#758078", fontSize: 13, marginBottom: 15 }}>
                    No saved photos were found for this property yet.
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 175px), 1fr))", gap: 14 }}>
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      style={{
                        overflow: "hidden",
                        border: `1px solid ${coverPhotoId === photo.id ? "#176b50" : "#e1e8e1"}`,
                        borderRadius: 12,
                        background: "#fff",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <img
                          src={photo.public_url}
                          alt="Property"
                          style={{ display: "block", width: "100%", height: 150, objectFit: "cover" }}
                        />

                        {coverPhotoId === photo.id && (
                          <span style={{ position: "absolute", top: 9, left: 9, background: "#176b50", color: "#fff", padding: "5px 8px", borderRadius: 6, fontSize: 11, fontWeight: 750 }}>
                            COVER PHOTO
                          </span>
                        )}
                      </div>

                      <div style={{ padding: 12 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#34483c", marginBottom: 12, cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="cover-photo"
                            checked={coverPhotoId === photo.id}
                            onChange={() => setCoverPhotoId(photo.id)}
                            style={{ accentColor: "#176b50" }}
                          />
                          Use as cover photo
                        </label>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void deletePhoto(photo)}
                          style={{ ...secondaryButtonStyle, width: "100%", color: "#a33427", borderColor: "#eed8d5", padding: "8px 10px", fontSize: 12 }}
                        >
                          Delete photo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <label style={{ display: "block", marginTop: 20, padding: 22, textAlign: "center", border: "1px dashed #b9cbbd", borderRadius: 12, background: "#f8faf7", cursor: "pointer", color: "#176b50", fontWeight: 700, fontSize: 13 }}>
                  <span style={{ display: "block", fontSize: 25, marginBottom: 8 }}>＋</span>
                  Add photos to your listing
                  <span style={{ display: "block", color: "#758078", fontSize: 12, fontWeight: 400, marginTop: 5 }}>
                    Choose one or more image files
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewPhotos(Array.from(e.target.files ?? []))}
                    style={{ display: "block", width: "100%", marginTop: 12, fontSize: 12, color: "#46564b" }}
                  />
                </label>

                {newPhotos.length > 0 && (
                  <p style={{ color: "#176b50", background: "#eef7f0", borderRadius: 9, padding: 12, fontSize: 13 }}>
                    ✓ {newPhotos.length} new photo(s) selected. They will upload when you save.
                  </p>
                )}
              </section>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingBottom: 24 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Saving changes…" : "✓ Save property changes"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/property-calendar/${id}`)}
                  style={secondaryButtonStyle}
                >
                  Open calendar →
                </button>
              </div>
            </div>

            <aside style={{ minWidth: 0 }}>
              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                {coverPhoto ? (
                  <img
                    src={coverPhoto.public_url}
                    alt="Your property cover"
                    style={{ display: "block", width: "100%", height: 200, objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ height: 165, background: "linear-gradient(135deg, #e4eee3, #f7f3e8)", display: "grid", placeItems: "center", color: "#68816e", fontSize: 13, textAlign: "center", padding: 15 }}>
                    Your property photo will appear here
                  </div>
                )}

                <div style={{ padding: 20 }}>
                  <p style={{ color: "#176b50", fontSize: 11, fontWeight: 800, letterSpacing: 1.2, margin: "0 0 9px" }}>
                    LISTING PREVIEW
                  </p>

                  <h2 style={{ fontSize: 21, letterSpacing: "-0.5px", margin: "0 0 8px", overflowWrap: "anywhere" }}>
                    {form.title || "Your property name"}
                  </h2>

                  <p style={{ color: "#758078", fontSize: 13, margin: "0 0 15px" }}>
                    ⌖ {form.location || "Add your property location"}
                  </p>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "#536358", fontSize: 12, paddingBottom: 16, borderBottom: "1px solid #edf0ed" }}>
                    <span>🛏 {form.bedrooms} bedrooms</span>
                    <span>♧ Sleeps {form.sleeps}</span>
                  </div>

                  <p style={{ margin: "16px 0 0", fontSize: 21, fontWeight: 800, color: "#176b50" }}>
                    {previewPrice}
                    {hasValidPrice && (
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#758078" }}>
                        {" "}/ night
                      </span>
                    )}
                  </p>

                  <p style={{ color: "#758078", fontSize: 12, lineHeight: 1.6, margin: "13px 0 0" }}>
                    This preview updates as you edit. Save your changes to update the stored listing.
                  </p>
                </div>
              </div>

              <div style={{ ...cardStyle, padding: 20 }}>
                <h3 style={{ fontSize: 15, margin: "0 0 14px" }}>Listing checklist</h3>

                {([
                  ["Property name", Boolean(form.title.trim())],
                  ["Location", Boolean(form.location.trim())],
                  ["Description", Boolean(form.description.trim())],
                  ["Nightly price", hasValidPrice],
                  ["Property photos", photos.length > 0 || newPhotos.length > 0],
                ] as [string, boolean][]).map(([label, complete]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12, fontSize: 12, color: complete ? "#176b50" : "#7c867e" }}>
                    <span style={{ width: 19, height: 19, borderRadius: "50%", background: complete ? "#e5f4e8" : "#f0f2ef", display: "grid", placeItems: "center", fontSize: 11, flexShrink: 0 }}>
                      {complete ? "✓" : "○"}
                    </span>
                    {label}
                  </div>
                ))}
              </div>

              <div style={{ borderRadius: 14, background: "#eaf3eb", padding: 20, color: "#315640", marginBottom: 18 }}>
                <p style={{ fontSize: 14, fontWeight: 750, margin: "0 0 8px" }}>
                  💡 A helpful tip
                </p>
                <p style={{ fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                  Good photos, a clear description and accurate facilities help guests decide whether your property is right for their stay.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/property-calendar/${id}`)}
                style={{ ...secondaryButtonStyle, width: "100%", padding: 14 }}
              >
                ▦ Manage availability & prices
              </button>
            </aside>
          </div>
        </form>

        <footer style={{ borderTop: "1px solid #e2e8e2", paddingTop: 22, marginTop: 12, color: "#89938b", fontSize: 12, textAlign: "center" }}>
          © 2026 Static Holidays
        </footer>
      </div>
    </main>
  );
}
