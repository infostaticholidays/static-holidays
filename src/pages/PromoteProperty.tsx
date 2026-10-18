
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GREEN = "#176b50";
const GREEN_DARK = "#104b39";
const GREEN_LIGHT = "#eaf5ef";
const PAGE_BG = "#f5f7f6";
const BORDER = "#e4e9e6";
const MUTED = "#68756e";
const TEXT = "#1c2922";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: PAGE_BG,
    color: TEXT,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sidebar: {
    width: 238,
    flexShrink: 0,
    boxSizing: "border-box",
    background: GREEN_DARK,
    color: "#fff",
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  brand: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.7px",
    padding: "0 12px",
    marginBottom: 28,
  },
  nav: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    border: 0,
    textAlign: "left",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: 10,
    color: "#dcece3",
    background: "transparent",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  active: {
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
  },
  main: {
    minWidth: 0,
    flex: 1,
    padding: "30px clamp(16px, 3vw, 42px) 48px",
  },
  heading: {
    fontSize: 28,
    lineHeight: 1.2,
    letterSpacing: "-0.8px",
    fontWeight: 800,
    margin: 0,
  },
  muted: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 1.6,
  },
  card: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 22,
    boxSizing: "border-box",
    minWidth: 0,
  },
  button: {
    background: GREEN,
    color: "#fff",
    border: `1px solid ${GREEN}`,
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "12px 13px",
    background: "#fff",
    color: TEXT,
    fontSize: 14,
  },
};

type Property = {
  id: string;
  title?: string | null;
  name?: string | null;
  location?: string | null;
  address?: string | null;
};

type Promotion = {
  id: string;
  property_id: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
};

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function PromoteProperty() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  const loadPage = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      // Load the signed-in host's properties.
      // Selecting * avoids errors caused by guessed column names.
      const { data: propertyData, error: propertyError } =
        await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", user.id);

      if (propertyError) {
        console.error("Failed to load properties:", propertyError);
        throw propertyError;
      }

      const ownedProperties = (propertyData ?? []) as Property[];

      setProperties(ownedProperties);

      // Load the host's promotion records.
      const { data: promotionData, error: promotionError } =
        await supabase
          .from("property_promotions")
          .select(
            "id, property_id, status, starts_at, expires_at, created_at"
          )
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

      if (promotionError) {
        console.error("Failed to load promotions:", promotionError);
        throw promotionError;
      }

      setPromotions((promotionData ?? []) as Promotion[]);
    } catch (error) {
      console.error("Promote property page error:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const propertyName = (propertyId: string) => {
    const property = properties.find(
      (item) => item.id === propertyId
    );

    if (!property) {
      return "Your property";
    }

    return (
      property.title ||
      property.name ||
      `Property ${property.id}`
    );
  };

  const handleCheckout = async () => {
    if (!selectedId) {
      setErrorMessage("Please choose a property first.");
      return;
    }

    setProcessing(true);
    setErrorMessage("");
    setNotice("");

    try {
      const { data, error } =
        await supabase.functions.invoke(
          "create-property-promotion-checkout",
          {
            body: {
              property_id: selectedId,
            },
          }
        );

      if (error) {
        throw error;
      }

      const checkoutUrl =
        data?.checkout_url ?? data?.url;

      if (
        typeof checkoutUrl !== "string" ||
        !checkoutUrl.startsWith("https://")
      ) {
        throw new Error(
          "Stripe did not return a valid checkout link. Check that the promotion checkout function is deployed and configured."
        );
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("Promotion checkout error:", error);
      setErrorMessage(getErrorMessage(error));
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: PAGE_BG,
          color: GREEN_DARK,
        }}
      >
        Loading your promotions…
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          🌿 Static Holidays
        </div>

        <nav aria-label="Host navigation">
          {[
            ["◫  Overview", "/host-dashboard"],
            ["⌂  My Properties", "/my-properties"],
            ["✦  Promote a Property", "/promote-property"],
            ["▣  Bookings", "/host-bookings"],
            ["✓  Compliance Centre", "/host-compliance"],
            ["✉  Messages", "/host-messages"],
            ["£  Earnings", "/host-earnings"],
            ["☆  Reviews", "/host-reviews"],
            ["◈  Plans & Membership", "/host-subscriptions"],
          ].map(([label, path]) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              style={{
                ...styles.nav,
                ...(path === "/promote-property"
                  ? styles.active
                  : {}),
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          style={{
            ...styles.nav,
            marginTop: "auto",
          }}
          onClick={() => navigate("/account")}
        >
          ⚙ Account settings
        </button>
      </aside>

      <main style={styles.main}>
        <header style={{ marginBottom: 26 }}>
          <p
            style={{
              color: GREEN,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              margin: "0 0 7px",
            }}
          >
            PROPERTY VISIBILITY
          </p>

          <h1 style={styles.heading}>
            Promote your property
          </h1>

          <p style={styles.muted}>
            Give your holiday let extra visibility for 30 days.
          </p>
        </header>

        {errorMessage && (
          <div
            role="alert"
            style={{
              ...styles.card,
              marginBottom: 18,
              borderColor: "#e9c2bd",
              color: "#8c3025",
              background: "#fff8f7",
            }}
          >
            {errorMessage}
          </div>
        )}

        {notice && (
          <div
            role="status"
            style={{
              ...styles.card,
              marginBottom: 18,
              background: GREEN_LIGHT,
              color: GREEN_DARK,
            }}
          >
            {notice}
          </div>
        )}

        <section
          style={{
            ...styles.card,
            padding: 0,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: GREEN_DARK,
              color: "#fff",
              padding: "clamp(24px, 4vw, 40px)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              ONE-OFF PROMOTION
            </span>

            <h2
              style={{
                fontSize: 29,
                lineHeight: 1.25,
                margin: "18px 0 10px",
              }}
            >
              Put your property in the spotlight
            </h2>

            <p
              style={{
                maxWidth: 570,
                color: "#d6e6dc",
                lineHeight: 1.7,
                fontSize: 14,
                margin: 0,
              }}
            >
              Give your listing a promotional boost on Static
              Holidays. Pay once, with no additional subscription
              required.
            </p>

            <div
              style={{
                fontSize: 36,
                fontWeight: 850,
                marginTop: 20,
              }}
            >
              £4.99{" "}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                / 30 days
              </span>
            </div>
          </div>

          <div style={{ padding: 24 }}>
            <label
              htmlFor="promotion-property"
              style={{
                display: "block",
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              1. Choose your property
            </label>

            <select
              id="promotion-property"
              value={selectedId}
              onChange={(event) =>
                setSelectedId(event.target.value)
              }
              style={styles.input}
            >
              <option value="">
                Select a property…
              </option>

              {properties.map((property) => (
                <option
                  key={property.id}
                  value={property.id}
                >
                  {property.title ||
                    property.name ||
                    `Property ${property.id}`}
                </option>
              ))}
            </select>

            {selectedId && (
              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  borderRadius: 10,
                  background: GREEN_LIGHT,
                }}
              >
                <strong>{propertyName(selectedId)}</strong>

                <p
                  style={{
                    ...styles.muted,
                    margin: "5px 0 0",
                  }}
                >
                  {(() => {
                    const property = properties.find(
                      (item) => item.id === selectedId
                    );

                    return (
                      property?.location ||
                      property?.address ||
                      "Your selected listing"
                    );
                  })()}
                </p>
              </div>
            )}

            <h3
              style={{
                fontSize: 16,
                margin: "24px 0 12px",
              }}
            >
              2. Review your promotion
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "13px 0",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <span style={styles.muted}>
                Promotion duration
              </span>
              <strong>30 days</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "13px 0",
              }}
            >
              <span style={styles.muted}>
                One-off payment
              </span>
              <strong>£4.99 GBP</strong>
            </div>

            <button
              type="button"
              disabled={
                !selectedId ||
                processing ||
                properties.length === 0
              }
              onClick={() => void handleCheckout()}
              style={{
                ...styles.button,
                width: "100%",
                marginTop: 12,
                opacity:
                  !selectedId ||
                  processing ||
                  properties.length === 0
                    ? 0.6
                    : 1,
                cursor:
                  !selectedId ||
                  processing ||
                  properties.length === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {processing
                ? "Opening secure checkout…"
                : "Promote for £4.99 →"}
            </button>

            <p
              style={{
                ...styles.muted,
                textAlign: "center",
                fontSize: 12,
                marginBottom: 0,
              }}
            >
              Secure payment through Stripe. Your promotion
              starts only after successful payment is verified.
            </p>

            {properties.length === 0 && (
              <button
                type="button"
                style={{
                  ...styles.button,
                  marginTop: 16,
                }}
                onClick={() => navigate("/add-property")}
              >
                + Add a property
              </button>
            )}
          </div>
        </section>

        <section style={styles.card}>
          <h2
            style={{
              fontSize: 19,
              margin: "0 0 6px",
            }}
          >
            Your promotions
          </h2>

          <p style={styles.muted}>
            Check the payment status and expiry of your
            promotions.
          </p>

          {promotions.length === 0 ? (
            <p style={styles.muted}>
              You don't have any promotions yet. Your purchased
              promotions will appear here.
            </p>
          ) : (
            promotions.map((promotion) => {
              const isActive =
                promotion.status === "active" &&
                promotion.expires_at !== null &&
                new Date(promotion.expires_at).getTime() >
                  Date.now();

              return (
                <div
                  key={promotion.id}
                  style={{
                    padding: "14px 0",
                    borderTop: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <strong>
                      {propertyName(promotion.property_id)}
                    </strong>

                    <span
                      style={{
                        color: isActive ? GREEN : MUTED,
                        fontWeight: 800,
                        fontSize: 13,
                        textTransform: "capitalize",
                      }}
                    >
                      {promotion.status}
                    </span>
                  </div>

                  <p
                    style={{
                      ...styles.muted,
                      margin: "6px 0 0",
                    }}
                  >
                    {promotion.expires_at
                      ? `Expires ${new Date(
                          promotion.expires_at
                        ).toLocaleDateString("en-GB")}`
                      : promotion.status === "pending"
                        ? "Awaiting verified payment"
                        : "Expiry date not set"}
                  </p>
                </div>
              );
            })
          )}

          <button
            type="button"
            onClick={() => void loadPage()}
            style={{
              ...styles.button,
              marginTop: 14,
            }}
          >
            Refresh promotions
          </button>
        </section>
      </main>
    </div>
  );
}
