
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type RecordData = Record<string, any>;
type BillingPeriod = "monthly" | "yearly";
type PaidPlan = "super" | "elite";

const GREEN = "#176b50";
const GREEN_DARK = "#104b39";
const GREEN_LIGHT = "#eaf5ef";
const TEXT = "#18372b";
const MUTED = "#667b70";
const BORDER = "#dce9e0";

const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(value) || 0);

function normalisePlan(value: unknown) {
  const plan = String(value ?? "host").toLowerCase();

  if (plan.includes("elite")) return "elite";
  if (plan.includes("super")) return "super";

  return "host";
}

const styles: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f8f5",
    color: TEXT,
    fontFamily: "inherit",
  },
  sidebar: {
    width: 235,
    flexShrink: 0,
    background: GREEN_DARK,
    color: "#ffffff",
    padding: 22,
    boxSizing: "border-box",
  },
  navButton: {
    width: "100%",
    display: "block",
    padding: "12px 14px",
    border: 0,
    borderRadius: 9,
    background: "transparent",
    color: "#e5f3e9",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: 5,
    fontSize: 14,
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: 28,
    boxSizing: "border-box",
  },
  section: {
    background: "#ffffff",
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 22,
    scrollMarginTop: 24,
    boxShadow: "0 3px 14px rgba(16, 75, 57, 0.035)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: 16,
  },
  muted: {
    color: MUTED,
    lineHeight: 1.65,
  },
  button: {
    padding: "12px 16px",
    border: 0,
    borderRadius: 9,
    background: GREEN,
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
  secondaryButton: {
    padding: "10px 13px",
    border: `1px solid ${BORDER}`,
    borderRadius: 9,
    background: "#ffffff",
    color: TEXT,
    cursor: "pointer",
    fontWeight: 600,
  },
};

const plans = [
  {
    id: "host",
    name: "Host",
    icon: "🔑",
    monthly: 0,
    yearly: 0,
    commission: "12%",
    description: "Everything you need to get started.",
    features: [
      "Basic holiday-home listing",
      "Bookings and guest messaging",
      "Property management dashboard",
    ],
  },
  {
    id: "super",
    name: "Super Host",
    icon: "🏖️",
    monthly: 19.99,
    yearly: 199.9,
    commission: "5%",
    description: "More visibility for your property.",
    features: [
      "Everything in Host",
      "Higher listing ranking",
      "Featured listing boost",
      "Increased visibility",
    ],
  },
  {
    id: "elite",
    name: "Elite Host",
    icon: "👑",
    monthly: 39.99,
    yearly: 399.9,
    commission: "1%",
    description: "Premium benefits for your holiday business.",
    features: [
      "Everything in Super Host",
      "Homepage feature, subject to availability",
      "Promotional advertising opportunities",
      "Priority support",
    ],
  },
] as const;

export default function HostDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<RecordData | null>(null);
  const [profile, setProfile] = useState<RecordData | null>(null);
  const [properties, setProperties] = useState<RecordData[]>([]);
  const [bookings, setBookings] = useState<RecordData[]>([]);
  const [conversations, setConversations] = useState<RecordData[]>([]);
  const [reviews, setReviews] = useState<RecordData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const [planBilling, setPlanBilling] =
    useState<BillingPeriod>("monthly");

  const [processingPlan, setProcessingPlan] =
    useState<PaidPlan | null>(null);

  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [processingPromotion, setProcessingPromotion] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        const currentUser = authData.user;

        if (!currentUser) {
          navigate("/login");
          return;
        }

        if (!mounted) return;
        setUser(currentUser);

        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

        if (profileError) throw profileError;

        if (profileData.role !== "host") {
          navigate("/account");
          return;
        }

        if (!mounted) return;
        setProfile(profileData);

        const { data: propertyData, error: propertyError } =
          await supabase
            .from("properties")
            .select("*")
            .eq("owner_id", currentUser.id)
            .order("created_at", { ascending: false });

        if (propertyError) throw propertyError;

        const propertyList = propertyData ?? [];

        if (!mounted) return;
        setProperties(propertyList);

        if (propertyList.length > 0) {
          const propertyIds = propertyList.map(
            (property) => property.id
          );

          const { data: bookingData, error: bookingError } =
            await supabase
              .from("bookings")
              .select("*")
              .in("property_id", propertyIds);

          if (bookingError) throw bookingError;

          if (!mounted) return;
          setBookings(bookingData ?? []);
        } else {
          setBookings([]);
        }

        const { data: conversationData, error: conversationError } =
          await supabase
            .from("conversations")
            .select("*")
            .eq("host_id", currentUser.id);

        if (conversationError) throw conversationError;

        if (!mounted) return;
        setConversations(conversationData ?? []);

        const { data: reviewData, error: reviewError } =
          await supabase
            .from("reviews")
            .select("*")
            .eq("host_id", currentUser.id);

        if (reviewError) throw reviewError;

        if (!mounted) return;
        setReviews(reviewData ?? []);

        if (propertyList.length > 0) {
          setSelectedPropertyId((current) => {
            const stillExists = propertyList.some(
              (property) => String(property.id) === current
            );

            return stillExists
              ? current
              : String(propertyList[0].id);
          });
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your dashboard."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const currentPlan = normalisePlan(profile?.plan);

  const isVerified =
    Boolean(profile?.id_verified) &&
    Boolean(profile?.insurance_verified);

  const commissionRate =
    currentPlan === "elite"
      ? 0.01
      : currentPlan === "super"
      ? 0.05
      : 0.12;

  const grossEarnings = bookings.reduce(
    (total, booking) =>
      total + (Number(booking.total_price) || 0),
    0
  );

  const estimatedCommission = grossEarnings * commissionRate;
  const estimatedNet = grossEarnings - estimatedCommission;

  async function handlePlanUpgrade(plan: PaidPlan) {
    setError("");
    setNotice("");
    setProcessingPlan(plan);

    try {
      const { data, error: checkoutError } =
        await supabase.functions.invoke(
          "create-plan-checkout",
          {
            body: {
              plan,
              billingInterval: planBilling,
            },
          }
        );

      if (checkoutError) throw checkoutError;

      if (
        !data?.url ||
        typeof data.url !== "string" ||
        !data.url.startsWith("https://")
      ) {
        throw new Error(
          "Membership checkout is not available yet. Please try again later."
        );
      }

      window.location.assign(data.url);
    } catch (err) {
      console.error("Membership checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start membership payment."
      );

      setProcessingPlan(null);
    }
  }

  async function handlePromotionCheckout() {
    if (!user) {
      setError("Please sign in before promoting a property.");
      return;
    }

    if (!selectedPropertyId) {
      setError("Please select a property to promote.");
      return;
    }

    const selectedProperty = properties.find(
      (property) => String(property.id) === selectedPropertyId
    );

    if (!selectedProperty) {
      setError("We couldn't find that property. Please refresh and try again.");
      return;
    }

    setError("");
    setNotice("");
    setProcessingPromotion(true);

    try {
      const { data, error: checkoutError } =
        await supabase.functions.invoke(
          "create-property-promotion-checkout",
          {
            body: {
              property_id: selectedProperty.id,
              promotion_type: "homepage_search",
            },
          }
        );

      if (checkoutError) throw checkoutError;

      if (
        !data?.url ||
        typeof data.url !== "string" ||
        !data.url.startsWith("https://")
      ) {
        throw new Error(
          "Property promotion checkout is not available yet. Please try again later."
        );
      }

      window.location.assign(data.url);
    } catch (err) {
      console.error("Property promotion checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the property promotion payment."
      );

      setProcessingPromotion(false);
    }
  }

  async function deleteProperty(propertyId: string) {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const { error: deleteError } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId)
        .eq("owner_id", user.id);

      if (deleteError) throw deleteError;

      setProperties((current) =>
        current.filter((property) => String(property.id) !== propertyId)
      );

      setNotice("Property deleted.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the property."
      );
    }
  }

  async function updateNewsletterPreference(value: boolean) {
    if (!user) return;

    setError("");
    setNotice("");

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ newsletter_opt_in: value })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile((current) =>
        current
          ? { ...current, newsletter_opt_in: value }
          : current
      );

      setNotice("Your preferences have been updated.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your preferences."
      );
    }
  }

  function goToSection(id: string) {
    setActiveSection(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (loading) {
    return (
      <div style={{ padding: 40, color: GREEN_DARK }}>
        Loading your host dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: 40, color: GREEN_DARK }}>
        <h2>Your dashboard couldn't be loaded</h2>
        <p>{error || "Please sign in and try again."}</p>
        <button style={styles.button} onClick={() => navigate("/login")}>
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={{ marginTop: 5, lineHeight: 1.3 }}>
          Static Holidays
        </h2>

        <p style={{ color: "#c9e0d1", fontSize: 13 }}>
          Owner dashboard
        </p>

        <div
          style={{
            height: 1,
            background: "#ffffff25",
            margin: "22px 0",
          }}
        />

        {[
          ["overview", "Overview"],
          ["properties", "My Properties"],
          ["promotion", "Promote a Property"],
          ["bookings", "Bookings"],
          ["compliance", "Compliance Centre"],
          ["messages", "Messages"],
          ["earnings", "Earnings"],
          ["reviews", "Reviews"],
          ["account", "Subscriptions & Plans"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() =>
              id === "compliance"
                ? navigate("/host-compliance")
                : goToSection(id)
            }
            style={{
              ...styles.navButton,
              background:
                activeSection === id
                  ? "#ffffff20"
                  : "transparent",
              fontWeight: activeSection === id ? 700 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </aside>

      <main style={styles.main}>
        <header id="overview" style={{ marginBottom: 26 }}>
          <p
            style={{
              color: GREEN,
              fontWeight: 800,
              letterSpacing: 1.5,
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            OWNER DASHBOARD
          </p>

          <h1 style={{ margin: "0 0 8px", color: GREEN_DARK }}>
            Welcome
            {profile.full_name ? `, ${profile.full_name}` : ""}
          </h1>

          <p style={styles.muted}>
            Manage your holiday properties, bookings and membership
            in one place.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              padding: 14,
              marginBottom: 18,
              background: "#fff1f0",
              color: "#a52a24",
              border: "1px solid #ffd5d1",
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            style={{
              padding: 14,
              marginBottom: 18,
              background: GREEN_LIGHT,
              color: GREEN_DARK,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
            }}
          >
            {notice}
          </div>
        )}

        <section style={{ ...styles.grid, marginBottom: 22 }}>
          {[
            ["Properties", properties.length],
            ["Bookings", bookings.length],
            ["Messages", conversations.length],
            ["Reviews", reviews.length],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                ...styles.section,
                marginBottom: 0,
                borderTop: `3px solid ${GREEN}`,
              }}
            >
              <p style={styles.muted}>{label}</p>
              <h2 style={{ fontSize: 30, margin: 0, color: GREEN_DARK }}>
                {value}
              </h2>
            </div>
          ))}
        </section>

        <section id="compliance" style={styles.section}>
          <h2 style={{ color: GREEN_DARK }}>Host verification</h2>

          <p style={styles.muted}>
            {isVerified
              ? "Your basic identity and insurance checks are marked complete."
              : "Visit the Compliance Centre to manage your verification documents."}
          </p>

          <button
            style={styles.button}
            onClick={() => navigate("/host-compliance")}
          >
            Open Compliance Centre
          </button>
        </section>

        <section id="properties" style={styles.section}>
          <h2 style={{ color: GREEN_DARK }}>My Properties</h2>

          <p style={styles.muted}>
            Manage your caravans, lodges and holiday homes.
          </p>

          <button
            style={styles.button}
            onClick={() => navigate("/add-property")}
          >
            + Add a Property
          </button>

          {properties.length === 0 ? (
            <p style={styles.muted}>
              You haven't added any properties yet.
            </p>
          ) : (
            <div style={{ ...styles.grid, marginTop: 20 }}>
              {properties.map((property) => (
                <article
                  key={property.id}
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 13,
                    padding: 18,
                    background: "#ffffff",
                  }}
                >
                  <h3 style={{ color: GREEN_DARK }}>
                    {property.title || "Untitled property"}
                  </h3>

                  <p style={styles.muted}>
                    {property.location ||
                      property.address ||
                      "Location not added"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {property.status || "Not set"}
                  </p>

                  <p>
                    <strong>
                      {money(Number(property.price_per_night) || 0)}
                    </strong>{" "}
                    per night
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <button
                      style={styles.secondaryButton}
                      onClick={() =>
                        navigate(`/add-property?id=${property.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={styles.secondaryButton}
                      onClick={() =>
                        navigate(`/property-calendar/${property.id}`)
                      }
                    >
                      Calendar
                    </button>

                    <button
                      style={{
                        ...styles.secondaryButton,
                        color: "#a52a24",
                      }}
                      onClick={() => deleteProperty(String(property.id))}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ONE-OFF PROPERTY PROMOTION */}
        <section
          id="promotion"
          style={{
            ...styles.section,
            border: `2px solid ${GREEN}`,
            background: "linear-gradient(145deg, #ffffff 0%, #f0f8f2 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 22,
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <span
                style={{
                  display: "inline-block",
                  background: GREEN_LIGHT,
                  color: GREEN_DARK,
                  padding: "7px 11px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                SPECIAL OFFER · ONE-OFF PAYMENT
              </span>

              <h2
                style={{
                  fontSize: 27,
                  lineHeight: 1.25,
                  color: GREEN_DARK,
                  margin: "0 0 10px",
                }}
              >
                Give your property a visibility boost
              </h2>

              <p style={styles.muted}>
                Want more guests to discover your holiday home?
                Promote your selected property on the Static Holidays
                homepage and improve its search placement for 30 days.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  margin: "18px 0",
                }}
              >
                {[
                  "Homepage promotion",
                  "Improved search visibility",
                  "30-day promotion period",
                ].map((feature) => (
                  <span
                    key={feature}
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      padding: "9px 11px",
                      fontSize: 13,
                      color: GREEN_DARK,
                    }}
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                flex: "0 1 260px",
                minWidth: 230,
                background: "#ffffff",
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: 22,
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(16,75,57,0.07)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: MUTED,
                  fontSize: 13,
                }}
              >
                One property · 30 days
              </p>

              <div
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: GREEN_DARK,
                  letterSpacing: -1,
                }}
              >
                £4.99
              </div>

              <p style={{ ...styles.muted, fontSize: 13 }}>
                One-off payment. No recurring subscription for this
                promotion.
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              marginTop: 22,
              paddingTop: 22,
            }}
          >
            <label
              htmlFor="promotion-property"
              style={{
                display: "block",
                fontWeight: 700,
                marginBottom: 9,
                color: GREEN_DARK,
              }}
            >
              Which property would you like to promote?
            </label>

            <select
              id="promotion-property"
              value={selectedPropertyId}
              onChange={(event) =>
                setSelectedPropertyId(event.target.value)
              }
              disabled={properties.length === 0 || processingPromotion}
              style={{
                display: "block",
                width: "100%",
                maxWidth: 540,
                padding: 13,
                border: `1px solid ${BORDER}`,
                borderRadius: 9,
                background: "#ffffff",
                color: TEXT,
                fontSize: 15,
                marginBottom: 16,
              }}
            >
              {properties.length === 0 ? (
                <option value="">
                  Add a property before promoting it
                </option>
              ) : (
                properties.map((property) => (
                  <option
                    key={property.id}
                    value={String(property.id)}
                  >
                    {property.title || "Untitled property"}
                    {property.location
                      ? ` — ${property.location}`
                      : ""}
                  </option>
                ))
              )}
            </select>

            {properties.length === 0 ? (
              <button
                style={styles.button}
                onClick={() => navigate("/add-property")}
              >
                + Add a Property First
              </button>
            ) : (
              <button
                type="button"
                style={{
                  ...styles.button,
                  padding: "14px 22px",
                  fontSize: 15,
                  opacity: processingPromotion ? 0.7 : 1,
                  cursor: processingPromotion
                    ? "not-allowed"
                    : "pointer",
                }}
                disabled={processingPromotion}
                onClick={handlePromotionCheckout}
              >
                {processingPromotion
                  ? "Opening secure payment..."
                  : "Promote for £4.99 →"}
              </button>
            )}

            <p
              style={{
                ...styles.muted,
                fontSize: 12,
                marginTop: 12,
              }}
            >
              Promotion begins after payment confirmation and approval
              of the listing. Search position is not guaranteed.
              Availability and eligibility rules apply.
            </p>
          </div>
        </section>

        <section id="bookings" style={styles.section}>
          <h2 style={{ color: GREEN_DARK }}>Bookings</h2>

          {bookings.length === 0 ? (
            <p style={styles.muted}>No bookings to display yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ background: GREEN_LIGHT }}>
                    <th style={{ padding: 12 }}>Booking</th>
                    <th style={{ padding: 12 }}>Status</th>
                    <th style={{ padding: 12 }}>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                      <td style={{ padding: 12 }}>
                        {String(booking.id).slice(0, 8)}
                      </td>
                      <td style={{ padding: 12 }}>
                        {booking.status || "Pending"}
                      </td>
                      <td style={{ padding: 12 }}>
                        {money(booking.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="messages" style={styles.section}>
          <h2 style={{ color: GREEN_DARK }}>Messages</h2>

          {conversations.length === 0 ? (
            <p style={styles.muted}>No conversations yet.</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                style={{
                  padding: "12px 0",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <p>
                  {conversation.subject ||
                    conversation.last_message ||
                    "Guest conversation"}
                </p>

                <button
                  style={styles.secondaryButton}
                  onClick={() =>
                    navigate(
                      `/messages/${
                        conversation.booking_id || conversation.id
                      }`
                    )
                  }
                >
                  Open conversation
                </button>
              </div>
            ))
          )}
        </section>

        <section id="earnings" style={styles.section}>
          <h2 style={{ color: GREEN_DARK }}>Earnings overview</h2>

          <div style={styles.grid}>
            <div>
              <p style={styles.muted}>Booking totals shown</p>
              <h3>{money(grossEarnings)}</h3>
            </div>

            <div>
              <p style={styles.muted}>
                Estimated commission ({commissionRate * 100}%)
              </p>
              <h3>{money(estimatedCommission)}</h3>
            </div>

            <div>
              <p style={styles.muted}>Estimated after commission</p>
              <h3>{money(estimatedNet)}</h3>
            </div>
          </div>

          <p style={{ ...styles.muted, fontSize: 12 }}>
            Estimates only. Figures use booking records returned to
            this dashboard and may include unpaid or cancelled
            bookings. They are not payout statements.
          </p>
        </section>

        <section id="reviews" style={styles.section}>
          <h2 style={{ color: GREEN_DARK }}>Guest Reviews</h2>

          {reviews.length === 0 ? (
            <p style={styles.muted}>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                style={{
                  padding: "12px 0",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <strong>
                  {review.rating
                    ? `${review.rating}/5`
                    : "Guest review"}
                </strong>
                <p>
                  {review.comment ||
                    review.review ||
                    "No written comment."}
                </p>
              </article>
            ))
          )}
        </section>

        {/* SUBSCRIPTION PLANS */}
        <section id="account" style={styles.section}>
          <h2 style={{ color: GREEN_DARK }}>
            Membership & Subscription Plans
          </h2>

          <p style={styles.muted}>
            Choose the plan that suits your holiday business.
            Compare the benefits, booking commission and payment options.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              margin: "20px 0",
            }}
          >
            {(["monthly", "yearly"] as BillingPeriod[]).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setPlanBilling(period)}
                aria-pressed={planBilling === period}
                style={{
                  ...styles.secondaryButton,
                  background:
                    planBilling === period ? GREEN : "#ffffff",
                  color:
                    planBilling === period ? "#ffffff" : TEXT,
                  borderColor:
                    planBilling === period ? GREEN : BORDER,
                }}
              >
                {period === "monthly"
                  ? "Monthly billing"
                  : "Pay yearly — save two months"}
              </button>
            ))}
          </div>

          <div style={styles.grid}>
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.id;

              const price =
                planBilling === "yearly"
                  ? plan.yearly
                  : plan.monthly;

              return (
                <article
                  key={plan.id}
                  style={{
                    border:
                      plan.id === "super"
                        ? `2px solid ${GREEN}`
                        : `1px solid ${BORDER}`,
                    borderRadius: 14,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    minWidth: 0,
                    background: "#ffffff",
                  }}
                >
                  {plan.id === "super" && (
                    <span
                      style={{
                        color: GREEN,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: 1,
                      }}
                    >
                      POPULAR CHOICE
                    </span>
                  )}

                  <h3 style={{ margin: 0, color: GREEN_DARK }}>
                    {plan.icon} {plan.name}
                  </h3>

                  <p style={{ ...styles.muted, margin: 0 }}>
                    {plan.description}
                  </p>

                  <div>
                    <strong
                      style={{
                        fontSize: 29,
                        color: GREEN_DARK,
                      }}
                    >
                      {formatPrice(price)}
                    </strong>

                    <div style={styles.muted}>
                      {price === 0
                        ? "Free membership"
                        : planBilling === "yearly"
                        ? "for one year, paid upfront"
                        : "per month"}
                    </div>
                  </div>

                  {plan.id !== "host" && planBilling === "yearly" && (
                    <div
                      style={{
                        background: GREEN_LIGHT,
                        color: GREEN_DARK,
                        padding: 10,
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Save{" "}
                      {formatPrice(
                        plan.monthly * 12 - plan.yearly
                      )}{" "}
                      per year
                    </div>
                  )}

                  <div
                    style={{
                      borderTop: `1px solid ${BORDER}`,
                      borderBottom: `1px solid ${BORDER}`,
                      padding: "13px 0",
                    }}
                  >
                    <strong>{plan.commission} booking commission</strong>
                  </div>

                  <ul
                    style={{
                      paddingLeft: 20,
                      lineHeight: 1.8,
                      fontSize: 14,
                      color: TEXT,
                    }}
                  >
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>

                  {plan.id === "host" ? (
                    <button
                      type="button"
                      disabled={isCurrent}
                      style={{
                        ...styles.button,
                        marginTop: "auto",
                        background: isCurrent ? "#e6eee8" : GREEN_DARK,
                        color: isCurrent ? MUTED : "#ffffff",
                        cursor: isCurrent ? "default" : "pointer",
                      }}
                    >
                      {isCurrent ? "Your current plan" : "Free plan"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        isCurrent || processingPlan !== null
                      }
                      onClick={() => handlePlanUpgrade(plan.id)}
                      style={{
                        ...styles.button,
                        marginTop: "auto",
                        background: isCurrent ? "#e6eee8" : GREEN,
                        color: isCurrent ? MUTED : "#ffffff",
                        opacity:
                          processingPlan === plan.id ? 0.7 : 1,
                        cursor:
                          isCurrent || processingPlan !== null
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {isCurrent
                        ? "Your current plan"
                        : processingPlan === plan.id
                        ? "Opening secure checkout..."
                        : "Buy Now"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <p style={{ ...styles.muted, fontSize: 12, marginTop: 18 }}>
            Yearly membership is paid upfront. Promotion benefits may
            be subject to eligibility and availability. Membership
            prices, commission and benefits should match the applicable
            terms and the payment system.
          </p>

          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              marginTop: 24,
              paddingTop: 20,
            }}
          >
            <h3 style={{ color: GREEN_DARK }}>
              Newsletter preferences
            </h3>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                margin: "12px 0",
              }}
            >
              <input
                type="checkbox"
                checked={Boolean(profile.newsletter_opt_in)}
                onChange={(event) =>
                  updateNewsletterPreference(event.target.checked)
                }
              />
              Receive Static Holidays newsletters
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
