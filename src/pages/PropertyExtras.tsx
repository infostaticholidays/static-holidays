
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

type StandardKey = "dog" | "horse" | "cot";

type StandardExtra = {
  enabled: boolean;
  price: string;
  id?: string;
};

type CustomExtra = {
  localId: number;
  id?: string;
  name: string;
  description: string;
  price: string;
};

type ExtraRow = {
  id: string;
  property_id: string;
  extra_type: string;
  name: string;
  description: string | null;
  price: number;
  pricing_type: string;
  is_available: boolean;
  requires_approval: boolean;
  sort_order: number;
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

export default function PropertyExtras() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();

  const [propertyName, setPropertyName] = useState("");
  const [standardExtras, setStandardExtras] = useState<
    Record<StandardKey, StandardExtra>
  >({
    dog: { enabled: false, price: "0" },
    horse: { enabled: false, price: "0" },
    cot: { enabled: false, price: "0" },
  });
  const [customExtras, setCustomExtras] = useState<CustomExtra[]>([]);
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
          dog: { enabled: false, price: "0" },
          horse: { enabled: false, price: "0" },
          cot: { enabled: false, price: "0" },
        };

        const customState: CustomExtra[] = [];

        loadedRows.forEach((row, index) => {
          if (
            row.extra_type === "dog" ||
            row.extra_type === "horse" ||
            row.extra_type === "cot"
          ) {
            const key = row.extra_type as StandardKey;
            standardState[key] = {
              enabled: row.is_available,
              price: String(row.price),
              id: row.id,
            };
          } else if (row.extra_type === "custom") {
            customState.push({
              localId: Date.now() + index,
              id: row.id,
              name: row.name,
              description: row.description || "",
              price: String(row.price),
            });
          }
        });

        setStandardExtras(standardState);
        setCustomExtras(customState);
      } catch (error) {
        console.error("LOAD PROPERTY EXTRAS ERROR:", error);
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not load the property extras."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPropertyAndExtras();
  }, [propertyId, navigate]);

  function updateStandardExtra(
    key: StandardKey,
    field: "enabled" | "price",
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

  function addCustomExtra() {
    setCustomExtras((current) => [
      ...current,
      {
        localId: Date.now() + Math.random(),
        name: "",
        description: "",
        price: "",
      },
    ]);
  }

  function updateCustomExtra(
    localId: number,
    field: "name" | "description" | "price",
    value: string
  ) {
    setCustomExtras((current) =>
      current.map((extra) =>
        extra.localId === localId
          ? { ...extra, [field]: value }
          : extra
      )
    );
  }

  function removeCustomExtra(localId: number) {
    setCustomExtras((current) =>
      current.filter((extra) => extra.localId !== localId)
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

    for (const extra of customExtras) {
      if (!extra.name.trim() || !extra.description.trim()) {
        setMessage(
          "Please enter a name and description for every occasion package."
        );
        return;
      }

      const amount = Number(extra.price);

      if (
        extra.price.trim() === "" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        Math.round(amount * 100) !== amount * 100
      ) {
        setMessage(
          "Please enter a valid price for every occasion package."
        );
        return;
      }
    }

    setSaving(true);

    try {
      const rowsToSave = [
        ...standardDefinitions
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
              is_available: true,
              requires_approval: false,
              sort_order: definition.sortOrder,
            };
          }),

        ...customExtras.map((extra, index) => ({
          ...(extra.id ? { id: extra.id } : {}),
          property_id: propertyId,
          extra_type: "custom",
          name: extra.name.trim(),
          description: extra.description.trim(),
          price: Number(extra.price),
          pricing_type: "per_stay",
          is_available: true,
          requires_approval: false,
          sort_order: index + 4,
        })),
      ];

      // Get existing extras BEFORE saving anything.
      const { data: currentRows, error: currentError } = await supabase
        .from("property_extras")
        .select("id")
        .eq("property_id", propertyId);

      if (currentError) throw currentError;

      const existingIds = (currentRows || []).map((row) => row.id);

      const retainedIds = rowsToSave
        .map((row) => ("id" in row ? row.id : undefined))
        .filter((id): id is string => Boolean(id));

      // Save enabled extras and update existing ones.
      if (rowsToSave.length > 0) {
        const { error: saveError } = await supabase
          .from("property_extras")
          .upsert(rowsToSave);

        if (saveError) throw saveError;
      }

      // Delete only previously existing extras that were switched off
      // or removed. Newly inserted extras are not included here.
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

      setMessage("Your property extras have been saved successfully.");
    } catch (error) {
      console.error("SAVE PROPERTY EXTRAS ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save your property extras."
      );
    } finally {
      setSaving(false);
    }
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
              color: message.includes("successfully")
                ? green
                : "#9a3412",
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
                  </div>
                )}
              </div>
            );
          })}
        </section>

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
            Special occasions and personal touches
          </h2>

          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
            Create packages for birthdays, anniversaries, romantic breaks,
            Christmas, Halloween or other special occasions. Set your own
            price and explain exactly what is included.
          </p>

          {customExtras.map((extra, index) => (
            <div
              key={extra.localId}
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
                  Occasion package {index + 1}
                </strong>

                <button
                  type="button"
                  onClick={() => removeCustomExtra(extra.localId)}
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

              <label style={labelStyle}>Package name *</label>

              <input
                style={inputStyle}
                placeholder="e.g. Birthday surprise"
                value={extra.name}
                onChange={(event) =>
                  updateCustomExtra(
                    extra.localId,
                    "name",
                    event.target.value
                  )
                }
              />

              <label style={{ ...labelStyle, marginTop: 14 }}>
                What is included? *
              </label>

              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                placeholder="Describe the decorations, treats or other items included..."
                value={extra.description}
                onChange={(event) =>
                  updateCustomExtra(
                    extra.localId,
                    "description",
                    event.target.value
                  )
                }
              />

              <label style={{ ...labelStyle, marginTop: 14 }}>
                One-off package price (£) *
              </label>

              <input
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 35"
                value={extra.price}
                onChange={(event) =>
                  updateCustomExtra(
                    extra.localId,
                    "price",
                    event.target.value
                  )
                }
              />

              <p style={{ color: "#6b7280", fontSize: 12 }}>
                You choose the price. This is charged once per booking.
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={addCustomExtra}
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
            + Add a special occasion package
          </button>
        </section>

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

