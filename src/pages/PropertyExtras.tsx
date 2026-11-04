
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const green = "#14532d";

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

type PaymentTiming = "deposit" | "balance";

type StandardKey = "dog" | "horse" | "cot";

type StandardExtra = {
  enabled: boolean;
  price: string;
  paymentTiming: PaymentTiming;
  id?: string;
};

type ExtraItem = {
  localId: number;
  id?: string;
  name: string;
  description: string;
  price: string;
  paymentTiming: PaymentTiming;
  imageUrl?: string;
  imageFile?: File;
  imagePreview?: string;
};

type ExtraRow = {
  id: string;
  property_id: string;
  extra_type: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  pricing_type: string;
  is_available: boolean;
  requires_approval: boolean;
  sort_order: number;
  payment_timing: PaymentTiming;
};

const standardDefinitions: {
  key: StandardKey;
  name: string;
  description: string;
  extraType: string;
  sortOrder: number;
}[] = [
  {
    key: "dog",
    name: "Dogs",
    description: "Bring your dog along for your stay.",
    extraType: "dog",
    sortOrder: 1,
  },
  {
    key: "horse",
    name: "Horse accommodation",
    description: "Horse accommodation or facilities during your stay.",
    extraType: "horse",
    sortOrder: 2,
  },
  {
    key: "cot",
    name: "Travel cot",
    description: "A travel cot provided for your stay.",
    extraType: "cot",
    sortOrder: 3,
  },
];

function PaymentTimingSelect({
  value,
  onChange,
}: {
  value: PaymentTiming;
  onChange: (value: PaymentTiming) => void;
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <label style={labelStyle}>When should the guest pay for this extra?</label>

      <select
        style={inputStyle}
        value={value}
        onChange={(event) =>
          onChange(event.target.value as PaymentTiming)
        }
      >
        <option value="deposit">With booking deposit</option>
        <option value="balance">
          With remaining balance (30 days before arrival)
        </option>
      </select>

      <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.5 }}>
        If the booking is made within 30 days of arrival, the guest pays for
        this extra at checkout with the rest of the holiday.
      </p>
    </div>
  );
}

export default function PropertyExtras() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();

  const [propertyName, setPropertyName] = useState("");

  const [standardExtras, setStandardExtras] = useState<
    Record<StandardKey, StandardExtra>
  >({
    dog: { enabled: false, price: "0", paymentTiming: "deposit" },
    horse: { enabled: false, price: "0", paymentTiming: "deposit" },
    cot: { enabled: false, price: "0", paymentTiming: "deposit" },
  });

  const [customExtras, setCustomExtras] = useState<ExtraItem[]>([]);
  const [welcomeHampers, setWelcomeHampers] = useState<ExtraItem[]>([]);
  const [otherRows, setOtherRows] = useState<ExtraRow[]>([]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPropertyAndExtras() {
      if (!propertyId) {
        setMessage("Property could not be found.");
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          navigate("/login");
          return;
        }

        const { data: property, error: propertyError } = await supabase
          .from("properties")
          .select("id, title")
          .eq("id", propertyId)
          .eq("owner_id", user.id)
          .single();

        if (propertyError) throw propertyError;

        setPropertyName(property.title);

        const { data: rows, error: extrasError } = await supabase
          .from("property_extras")
          .select("*")
          .eq("property_id", propertyId)
          .order("sort_order", { ascending: true });

        if (extrasError) throw extrasError;

        const loadedRows = (rows || []) as ExtraRow[];

        const standardState: Record<StandardKey, StandardExtra> = {
          dog: { enabled: false, price: "0", paymentTiming: "deposit" },
          horse: { enabled: false, price: "0", paymentTiming: "deposit" },
          cot: { enabled: false, price: "0", paymentTiming: "deposit" },
        };

        const customState: ExtraItem[] = [];
        const hamperState: ExtraItem[] = [];
        const preservedRows: ExtraRow[] = [];

        loadedRows.forEach((row, index) => {
          const paymentTiming: PaymentTiming =
            row.payment_timing === "balance" ? "balance" : "deposit";

          if (
            row.extra_type === "dog" ||
            row.extra_type === "horse" ||
            row.extra_type === "cot"
          ) {
            const key = row.extra_type as StandardKey;

            standardState[key] = {
              enabled: row.is_available,
              price: String(row.price),
              paymentTiming,
              id: row.id,
            };
          } else if (
            row.extra_type === "custom" ||
            row.extra_type === "welcome"
          ) {
            const item: ExtraItem = {
              localId: Date.now() + index,
              id: row.id,
              name: row.name,
              description: row.description || "",
              price: String(row.price),
              paymentTiming,
              imageUrl: row.image_url || "",
              imagePreview: row.image_url || "",
            };

            if (row.extra_type === "custom") {
              customState.push(item);
            } else {
              hamperState.push(item);
            }
          } else {
            // Keep other existing extra types intact.
            preservedRows.push(row);
          }
        });

        setStandardExtras(standardState);
        setCustomExtras(customState);
        setWelcomeHampers(hamperState);
        setOtherRows(preservedRows);
      } catch (error) {
        console.error("LOAD PROPERTY EXTRAS ERROR:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" &&
                error !== null &&
                "message" in error
              ? String(error.message)
              : String(error);

        setMessage(errorMessage || "Could not load your property extras.");
      } finally {
        setLoading(false);
      }
    }

    loadPropertyAndExtras();
  }, [propertyId, navigate]);

  function updateStandardExtra(
    key: StandardKey,
    field: "enabled" | "price" | "paymentTiming",
    value: boolean | string
  ) {
    setStandardExtras((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [field]: value,
      },
    }));
  }

  function addItem(setItems: React.Dispatch<React.SetStateAction<ExtraItem[]>>) {
    setItems((current) => [
      ...current,
      {
        localId: Date.now() + Math.random(),
        name: "",
        description: "",
        price: "",
        paymentTiming: "deposit",
        imageUrl: "",
        imagePreview: "",
      },
    ]);
  }

  function updateItem(
    setItems: React.Dispatch<React.SetStateAction<ExtraItem[]>>,
    localId: number,
    field: "name" | "description" | "price" | "paymentTiming",
    value: string
  ) {
    setItems((current) =>
      current.map((item) =>
        item.localId === localId ? { ...item, [field]: value } : item
      )
    );
  }

  function removeItem(
    setItems: React.Dispatch<React.SetStateAction<ExtraItem[]>>,
    localId: number
  ) {
    setItems((current) =>
      current.filter((item) => item.localId !== localId)
    );
  }

  function handleImageChange(
    setItems: React.Dispatch<React.SetStateAction<ExtraItem[]>>,
    localId: number,
    file?: File
  ) {
    if (!file) return;

    setMessage("");

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setItems((current) =>
        current.map((item) =>
          item.localId === localId
            ? {
                ...item,
                imageFile: file,
                imagePreview: String(reader.result),
              }
            : item
        )
      );
    };

    reader.onerror = () => {
      setMessage("Could not preview that image. Please try another.");
    };

    reader.readAsDataURL(file);
  }

  function removeImage(
    setItems: React.Dispatch<React.SetStateAction<ExtraItem[]>>,
    localId: number
  ) {
    setItems((current) =>
      current.map((item) =>
        item.localId === localId
          ? {
              ...item,
              imageUrl: "",
              imageFile: undefined,
              imagePreview: "",
            }
          : item
      )
    );
  }

  function validateItems(items: ExtraItem[], sectionName: string) {
    for (const item of items) {
      if (!item.name.trim() || !item.description.trim()) {
        setMessage(
          `Please enter a name and description for every ${sectionName}.`
        );
        return false;
      }

      const amount = Number(item.price);

      if (
        item.price.trim() === "" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        Math.round(amount * 100) !== amount * 100
      ) {
        setMessage(
          `Please enter a valid price for every ${sectionName}.`
        );
        return false;
      }
    }

    return true;
  }

  async function prepareItems(
    items: ExtraItem[],
    userId: string
  ): Promise<ExtraItem[]> {
    return Promise.all(
      items.map(async (item) => {
        let imageUrl = item.imageUrl || "";

        if (item.imageFile) {
          const safeName = item.imageFile.name.replace(
            /[^a-zA-Z0-9.-]/g,
            "-"
          );

          const filePath =
            `${userId}/${propertyId}/extras/${Date.now()}-${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(filePath, item.imageFile, {
              contentType: item.imageFile.type,
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("property-images")
            .getPublicUrl(filePath);

          imageUrl = publicUrlData.publicUrl;
        }

        return {
          ...item,
          imageUrl,
          imageFile: undefined,
          imagePreview: imageUrl,
        };
      })
    );
  }

  async function saveExtras() {
    setMessage("");

    if (!propertyId) {
      setMessage("Property could not be found.");
      return;
    }

    for (const definition of standardDefinitions) {
      const extra = standardExtras[definition.key];

      if (!extra.enabled) continue;

      const amount = Number(extra.price);

      if (
        extra.price.trim() === "" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > 20 ||
        Math.round(amount * 100) !== amount * 100
      ) {
        setMessage(
          `${definition.name} must have a price between £0 and £20.`
        );
        return;
      }
    }

    if (!validateItems(customExtras, "occasion packages")) return;
    if (!validateItems(welcomeHampers, "welcome hampers")) return;

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Please log in again.");

      const preparedCustomExtras = await prepareItems(customExtras, user.id);
      const preparedWelcomeHampers = await prepareItems(
        welcomeHampers,
        user.id
      );

      const standardRows = standardDefinitions
        .filter((definition) => standardExtras[definition.key].enabled)
        .map((definition) => {
          const extra = standardExtras[definition.key];

          return {
            ...(extra.id ? { id: extra.id } : {}),
            property_id: propertyId,
            extra_type: definition.extraType,
            name: definition.name,
            description: definition.description,
            price: Number(extra.price),
            pricing_type: "per_stay",
            payment_timing: extra.paymentTiming,
            is_available: true,
            requires_approval: false,
            sort_order: definition.sortOrder,
          };
        });

      const customRows = preparedCustomExtras.map((extra, index) => ({
        ...(extra.id ? { id: extra.id } : {}),
        property_id: propertyId,
        extra_type: "custom",
        name: extra.name.trim(),
        description: extra.description.trim(),
        image_url: extra.imageUrl || null,
        price: Number(extra.price),
        pricing_type: "per_stay",
        payment_timing: extra.paymentTiming,
        is_available: true,
        requires_approval: false,
        sort_order: index + 4,
      }));

      const hamperRows = preparedWelcomeHampers.map((extra, index) => ({
        ...(extra.id ? { id: extra.id } : {}),
        property_id: propertyId,
        extra_type: "welcome",
        name: extra.name.trim(),
        description: extra.description.trim(),
        image_url: extra.imageUrl || null,
        price: Number(extra.price),
        pricing_type: "per_stay",
        payment_timing: extra.paymentTiming,
        is_available: true,
        requires_approval: false,
        sort_order: index + 20,
      }));

      const rowsToSave = [
        ...otherRows,
        ...standardRows,
        ...customRows,
        ...hamperRows,
      ];

      const { data: currentRows, error: currentError } = await supabase
        .from("property_extras")
        .select("id")
        .eq("property_id", propertyId);

      if (currentError) throw currentError;

      const existingIds = (currentRows || []).map((row) => row.id);

      const retainedIds = rowsToSave
        .map((row) => ("id" in row ? row.id : undefined))
        .filter((id): id is string => Boolean(id));

      if (rowsToSave.length > 0) {
        const { error: saveError } = await supabase
          .from("property_extras")
          .upsert(rowsToSave);

        if (saveError) throw saveError;
      }

      const idsToDelete = existingIds.filter(
        (id) => !retainedIds.includes(id)
      );

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("property_extras")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      setCustomExtras(preparedCustomExtras);
      setWelcomeHampers(preparedWelcomeHampers);

      setMessage("Your property extras have been saved successfully.");
    } catch (error) {
      console.error("SAVE PROPERTY EXTRAS ERROR:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error
            ? String(error.message)
            : String(error);

      setMessage(errorMessage || "Could not save your property extras.");
    } finally {
      setSaving(false);
    }
  }

  function renderItemSection(
    heading: string,
    explanation: string,
    items: ExtraItem[],
    setItems: React.Dispatch<React.SetStateAction<ExtraItem[]>>,
    itemLabel: string,
    nameLabel: string,
    namePlaceholder: string,
    descriptionPlaceholder: string,
    addLabel: string
  ) {
    return (
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 20, color: green, marginTop: 0 }}>
          {heading}
        </h2>

        <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
          {explanation}
        </p>

        {items.map((item, index) => (
          <div
            key={item.localId}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 16,
              marginBottom: 14,
              background: "#f9faf9",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <strong style={{ color: green }}>
                {itemLabel} {index + 1}
              </strong>

              <button
                type="button"
                onClick={() => removeItem(setItems, item.localId)}
                style={{
                  border: 0,
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: 6,
                  padding: "7px 10px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>

            <label style={labelStyle}>{nameLabel} *</label>

            <input
              style={inputStyle}
              placeholder={namePlaceholder}
              value={item.name}
              onChange={(event) =>
                updateItem(setItems, item.localId, "name", event.target.value)
              }
            />

            <label style={{ ...labelStyle, marginTop: 14 }}>
              Description *
            </label>

            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              placeholder={descriptionPlaceholder}
              value={item.description}
              onChange={(event) =>
                updateItem(
                  setItems,
                  item.localId,
                  "description",
                  event.target.value
                )
              }
            />

            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Photo</label>

              {item.imagePreview && (
                <div style={{ marginBottom: 12 }}>
                  <img
                    src={item.imagePreview}
                    alt={`${item.name || itemLabel} preview`}
                    style={{
                      width: "100%",
                      maxWidth: 320,
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 10,
                      display: "block",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(setItems, item.localId)}
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      border: 0,
                      borderRadius: 7,
                      background: "#fee2e2",
                      color: "#991b1b",
                      cursor: "pointer",
                    }}
                  >
                    Remove photo
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageChange(
                    setItems,
                    item.localId,
                    event.target.files?.[0]
                  )
                }
              />

              <p style={{ color: "#6b7280", fontSize: 12 }}>
                Choose an image file up to 5MB.
              </p>
            </div>

            <label style={{ ...labelStyle, marginTop: 14 }}>
              One-off price (£) *
            </label>

            <input
              style={inputStyle}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 25"
              value={item.price}
              onChange={(event) =>
                updateItem(setItems, item.localId, "price", event.target.value)
              }
            />

            <p style={{ color: "#6b7280", fontSize: 12 }}>
              Enter 0 if this {itemLabel.toLowerCase()} is free. The price is
              charged once per booking.
            </p>

            <PaymentTimingSelect
              value={item.paymentTiming}
              onChange={(value) =>
                updateItem(
                  setItems,
                  item.localId,
                  "paymentTiming",
                  value
                )
              }
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => addItem(setItems)}
          style={{
            width: "100%",
            padding: 13,
            border: "1px dashed #39834b",
            borderRadius: 9,
            background: "#f0fdf4",
            color: green,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {addLabel}
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: green }}>
        Loading your property extras...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f7f9f7",
        minHeight: "100vh",
        padding: "32px 16px 60px",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: green, fontWeight: 700, marginBottom: 8 }}>
            STATIC HOLIDAYS · OWNER AREA
          </p>

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 38px)",
              color: green,
              margin: "0 0 10px",
            }}
          >
            Optional extras
          </h1>

          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            {propertyName
              ? `Choose the optional extras available for ${propertyName}.`
              : "Choose the optional extras available at your property."}
          </p>

          <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>
            Only extras you enable will be shown to guests. All extras are
            charged once for the whole booking, not per night.
          </p>
        </div>

        {message && (
          <div
            role="alert"
            style={{
              background: message.includes("successfully")
                ? "#f0fdf4"
                : "#fff7ed",
              border: `1px solid ${
                message.includes("successfully") ? "#bbf7d0" : "#fed7aa"
              }`,
              color: message.includes("successfully") ? green : "#9a3412",
              padding: 14,
              borderRadius: 8,
              marginBottom: 20,
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </div>
        )}

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 20, color: green, marginTop: 0 }}>
            Standard extras
          </h2>

          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
            Switch on the extras you offer. You can offer them free or charge
            up to £20 per booking.
          </p>

          {standardDefinitions.map((definition) => {
            const extra = standardExtras[definition.key];

            return (
              <div
                key={definition.key}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    fontWeight: 700,
                    color: green,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={extra.enabled}
                    onChange={(event) =>
                      updateStandardExtra(
                        definition.key,
                        "enabled",
                        event.target.checked
                      )
                    }
                  />
                  {definition.name}
                </label>

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: 13,
                    margin: "8px 0 12px",
                  }}
                >
                  {definition.description}
                </p>

                {extra.enabled && (
                  <div>
                    <label style={labelStyle}>
                      One-off charge for the whole stay (£)
                    </label>

                    <input
                      style={inputStyle}
                      type="number"
                      min="0"
                      max="20"
                      step="0.01"
                      value={extra.price}
                      onChange={(event) =>
                        updateStandardExtra(
                          definition.key,
                          "price",
                          event.target.value
                        )
                      }
                    />

                    <p style={{ color: "#6b7280", fontSize: 12 }}>
                      Enter 0 if this extra is free. Maximum £20.
                    </p>

                    <PaymentTimingSelect
                      value={extra.paymentTiming}
                      onChange={(value) =>
                        updateStandardExtra(
                          definition.key,
                          "paymentTiming",
                          value
                        )
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {renderItemSection(
          "Special occasions and personal touches",
          "Create packages for birthdays, anniversaries, romantic breaks, Christmas, Halloween or other special occasions. Set your own price and explain exactly what is included.",
          customExtras,
          setCustomExtras,
          "Occasion package",
          "Package name",
          "e.g. Birthday surprise",
          "Describe the decorations, treats or other items included...",
          "+ Add a special occasion package"
        )}

        {renderItemSection(
          "Welcome Hampers",
          "Offer guests a choice of welcome hampers for their stay. You can create several options, add a photo and set a separate price for each one.",
          welcomeHampers,
          setWelcomeHampers,
          "Welcome hamper",
          "Hamper name",
          "e.g. Luxury welcome hamper",
          "Describe the food, drinks, treats or other items included...",
          "+ Add a welcome hamper"
        )}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
            Guests will only see the extras you have enabled. These settings
            can be changed later.
          </p>

          <button
            type="button"
            onClick={saveExtras}
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
            {saving ? "Saving extras..." : "Save Optional Extras"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/host-dashboard")}
            style={{
              width: "100%",
              padding: "13px 20px",
              marginTop: 10,
              border: "1px solid #d1d5db",
              borderRadius: 9,
              background: "#ffffff",
              color: green,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Back to owner dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
