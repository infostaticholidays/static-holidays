
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type RecordData = Record<string, any>;
type BillingPeriod = "monthly" | "yearly";
type PaidPlan = "super" | "elite";

const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(value) || 0);

const normalisePlan = (value: unknown) => {
  const plan = String(value ?? "host").toLowerCase();

  if (plan.includes("elite")) return "elite";
  if (plan.includes("super")) return "super";

  return "host";
};

const styles: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#172033",
    fontFamily: "inherit",
  },
  sidebar: {
    width: 225,
    flexShrink: 0,
    background: "#172033",
    color: "#ffffff",
    padding: 20,
    boxSizing: "border-box",
  },
  navButton: {
    width: "100%",
    padding: "12px 14px",
    border: 0,
    borderRadius: 9,
    background: "transparent",
    color: "#e2e8f0",
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
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 22,
    marginBottom: 22,
    scrollMarginTop: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: 16,
  },
  muted: {
    color: "#64748b",
    lineHeight: 1.6,
  },
  button: {
    padding: "11px 15px",
    border: 0,
    borderRadius: 9,
    background: "#0f766e",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 13px",
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    background: "#ffffff",
    color: "#172033",
    cursor: "pointer",
  },
};

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
          "Checkout isn't configured yet. Please try again later."
        );
      }

      window.location.assign(data.url);
    } catch (err) {
      console.error("Plan checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again."
      );

      setProcessingPlan(null);
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
        current.filter((property) => property.id !== propertyId)
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

  async function updatePreference(
    field: "newsletter_opt_in" | "featured_marketing",
    value: boolean
  ) {
    if (!user) return;

    setError("");
    setNotice("");

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ [field]: value })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile((current) =>
        current ? { ...current, [field]: value } : current
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
      <div style={{ padding: 40 }}>
        Loading your host dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Your dashboard couldn't be loaded</h2>
        <p>{error || "Please sign in and try again."}</p>
        <button onClick={() => navigate("/login")}>
          Sign in
        </button>
      </div>
    );
  }

  const plans = [
    {
      id: "host",
      name: "🔑 Host",
      monthly: 0,
      yearly: 0,
      commission: "12%",
      description: "Get started with your holiday property.",
      features: [
        "Basic property listing",
        "Bookings and guest messaging",
        "Property management dashboard",
      ],
    },
    {
      id: "super",
      name: "🏖️ Super Host",
      monthly: 19.99,
      yearly: 199.9,
      commission: "5%",
      description: "Improve your property's visibility.",
      features: [
        "Everything in Host",
        "Higher listing ranking",
        "Featured listing boost",
        "More property visibility",
      ],
    },
    {
      id: "elite",
      name: "👑 Elite Host",
      monthly: 39.99,
      yearly: 399.9,
      commission: "1%",
      description: "Maximum exposure for your property.",
      features: [
        "Everything in Super Host",
        "Homepage feature",
        "Promotional advertising opportunities",
        "Priority support",
      ],
    },
  ] as const;

  const formatPrice = (price: number) => money(price);

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={{ marginTop: 5 }}>Static Holidays</h2>
        <p style={{ color: "#cbd5e1", fontSize: 13 }}>
          Owner dashboard
        </p>

        {[
          ["overview", "Overview"],
          ["properties", "My Properties"],
          ["bookings", "Bookings"],
          ["compliance", "Compliance Centre"],
          ["messages", "Messages"],
          ["earnings", "Earnings"],
          ["reviews", "Reviews"],
          ["account", "Account & Plans"],
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
                  ? "#334155"
                  : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </aside>

      <main style={styles.main}>
        <header id="overview" style={{ marginBottom: 25 }}>
          <p style={styles.muted}>OWNER DASHBOARD</p>
          <h1 style={{ marginBottom: 5 }}>
            Welcome{profile.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p style={styles.muted}>
            Manage your holiday properties, bookings and membership.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              padding: 14,
              marginBottom: 18,
              background: "#fef2f2",
              color: "#991b1b",
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
              background: "#ecfdf5",
              color: "#065f46",
              borderRadius: 10,
            }}
          >
            {notice}
          </div>
        )}

        <section style={styles.grid}>
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
              }}
            >
              <p style={styles.muted}>{label}</p>
              <h2 style={{ fontSize: 30, margin: 0 }}>{value}</h2>
            </div>
          ))}
        </section>

        <section id="compliance" style={styles.section}>
          <h2>Host verification</h2>
          <p style={styles.muted}>
            {isVerified
              ? "Your basic identity and insurance checks are marked complete."
              : "Complete your verification requirements to help prepare your property for publication."}
          </p>
          <button
            style={styles.button}
            onClick={() => navigate("/host-compliance")}
          >
            Open Compliance Centre
          </button>
        </section>

        <section id="properties" style={styles.section}>
          <h2>My Properties</h2>
          <p style={styles.muted}>
            Manage your holiday homes, lodges and caravans.
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
            <div style={{ ...styles.grid, marginTop: 18 }}>
              {properties.map((property) => (
                <article
                  key={property.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <h3>{property.title || "Untitled property"}</h3>
                  <p style={styles.muted}>
                    {property.location || property.address || "Location not added"}
                  </p>
                  <p>
                    {property.status || "Status not set"}
                  </p>
                  <p>
                    {money(Number(property.price_per_night) || 0)}
                    {" "}per night
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
                        color: "#b91c1c",
                      }}
                      onClick={() => deleteProperty(property.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="bookings" style={styles.section}>
          <h2>Bookings</h2>

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
                  <tr>
                    <th style={{ padding: 10 }}>Booking</th>
                    <th style={{ padding: 10 }}>Status</th>
                    <th style={{ padding: 10 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td style={{ padding: 10 }}>
                        {String(booking.id).slice(0, 8)}
                      </td>
                      <td style={{ padding: 10 }}>
                        {booking.status || "Pending"}
                      </td>
                      <td style={{ padding: 10 }}>
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
          <h2>Messages</h2>

          {conversations.length === 0 ? (
            <p style={styles.muted}>No conversations yet.</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
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
                      `/messages/${conversation.booking_id || conversation.id}`
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
          <h2>Earnings overview</h2>

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
            Estimates only. These figures use all booking records
            returned to this dashboard and may include unpaid or
            cancelled bookings. They are not payout statements.
          </p>
        </section>

        <section id="reviews" style={styles.section}>
          <h2>Guest Reviews</h2>

          {reviews.length === 0 ? (
            <p style={styles.muted}>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <strong>
                  {review.rating ? `${review.rating}/5` : "Guest review"}
                </strong>
                <p>{review.comment || review.review || "No written comment."}</p>
              </article>
            ))
          )}
        </section>

        <section id="account" style={styles.section}>
          <h2>Account & Membership Plans</h2>
          <p style={styles.muted}>
            Choose the membership that suits your holiday business.
            Upgrade securely using Buy Now.
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
                    planBilling === period ? "#0f766e" : "#ffffff",
                  color:
                    planBilling === period ? "#ffffff" : "#172033",
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
                        ? "2px solid #0f766e"
                        : "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    minWidth: 0,
                  }}
                >
                  {plan.id === "super" && (
                    <strong style={{ color: "#0f766e", fontSize: 12 }}>
                      POPULAR CHOICE
                    </strong>
                  )}

                  <h3 style={{ margin: 0 }}>{plan.name}</h3>
                  <p style={{ ...styles.muted, margin: 0 }}>
                    {plan.description}
                  </p>

                  <div>
                    <strong style={{ fontSize: 29 }}>
                      {formatPrice(price)}
                    </strong>
                    <div style={styles.muted}>
                      {price === 0
                        ? "Free"
                        : planBilling === "yearly"
                        ? "for one year, paid upfront"
                        : "per month"}
                    </div>
                  </div>

                  {plan.id !== "host" && planBilling === "yearly" && (
                    <p
                      style={{
                        color: "#047857",
                        background: "#ecfdf5",
                        padding: 9,
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    >
                      Save {formatPrice(plan.monthly * 12 - plan.yearly)}
                      {" "}compared with monthly payments
                    </p>
                  )}

                  <strong>{plan.commission} booking commission</strong>

                  <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
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
                        background: isCurrent ? "#e2e8f0" : "#172033",
                        color: isCurrent ? "#475569" : "#ffffff",
                      }}
                    >
                      {isCurrent ? "Your current plan" : "Free plan"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isCurrent || processingPlan !== null}
                      onClick={() =>
                        handlePlanUpgrade(plan.id, planBilling)
                      }
                      style={{
                        ...styles.button,
                        marginTop: "auto",
                        background: isCurrent ? "#e2e8f0" : "#0f766e",
                        color: isCurrent ? "#475569" : "#ffffff",
                        opacity: processingPlan === plan.id ? 0.7 : 1,
                        cursor:
                          isCurrent || processingPlan !== null
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {isCurrent
                        ? "Your current plan"
                        : processingPlan === plan.id
                        ? "Opening checkout..."
                        : "Buy Now"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <p style={{ ...styles.muted, fontSize: 12, marginTop: 18 }}>
            Annual membership is paid upfront. Plan changes and
            commission rates must be confirmed by the payment and
            booking systems. Promotional benefits may be subject
            to eligibility and availability.
          </p>

          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              marginTop: 24,
              paddingTop: 20,
            }}
          >
            <h3>Marketing preferences</h3>

            <label style={{ display: "block", margin: "12px 0" }}>
              <input
                type="checkbox"
                checked={Boolean(profile.newsletter_opt_in)}
                onChange={(event) =>
                  updatePreference(
                    "newsletter_opt_in",
                    event.target.checked
                  )
                }
              />{" "}
              Receive Static Holidays newsletters
            </label>

            <label style={{ display: "block", margin: "12px 0" }}>
              <input
                type="checkbox"
                checked={Boolean(profile.featured_marketing)}
                onChange={(event) =>
                  updatePreference(
                    "featured_marketing",
                    event.target.checked
                  )
                }
              />{" "}
              Receive property promotion opportunities
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
