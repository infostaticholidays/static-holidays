import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PlanId = "host" | "super" | "elite";
type BillingInterval = "monthly" | "yearly";

type Plan = {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  commission: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const GREEN = "#176b50";
const GREEN_DARK = "#104b39";
const GREEN_LIGHT = "#eaf5ef";
const PAGE_BG = "#f5f7f6";
const BORDER = "#e4e9e6";
const MUTED = "#68756e";
const TEXT = "#1c2922";

const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number.isFinite(value) ? value : 0);

// Keep this helper at module scope so every component can access it.
const formatPrice = (price: number) => money(price);

const plans: Plan[] = [
  {
    id: "host",
    name: "Host Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    commission: "12%",
    description: "Everything you need to get started.",
    features: [
      "Create property listings",
      "Manage bookings and enquiries",
      "Message your guests",
      "Standard search visibility",
    ],
  },
  {
    id: "super",
    name: "Super Host",
    monthlyPrice: 19.99,
    yearlyPrice: 199.9,
    commission: "5%",
    description: "More visibility with lower commission.",
    features: [
      "Everything in Host Free",
      "Reduced 5% booking commission",
      "Improved search ranking",
      "Featured listing boost",
    ],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite Host",
    monthlyPrice: 39.99,
    yearlyPrice: 399.9,
    commission: "1%",
    description: "Maximum exposure and our lowest commission.",
    features: [
      "Everything in Super Host",
      "Just 1% booking commission",
      "Homepage feature opportunities",
      "Priority host support",
    ],
  },
];

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: PAGE_BG,
    color: TEXT,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  sidebar: {
    width: 238,
    flexShrink: 0,
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
  navItem: {
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
  navActive: {
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
  },
  main: {
    minWidth: 0,
    flex: 1,
    padding: "30px clamp(16px, 3vw, 42px) 48px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 26,
  },
  heading: {
    fontSize: 28,
    lineHeight: 1.2,
    letterSpacing: "-0.8px",
    fontWeight: 800,
    margin: 0,
  },
  muted: { color: MUTED, fontSize: 14, lineHeight: 1.6 },
  card: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 22,
    minWidth: 0,
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: 16,
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: 19,
    fontWeight: 800,
    letterSpacing: "-0.35px",
  },
  primaryButton: {
    background: GREEN,
    color: "#fff",
    border: `1px solid ${GREEN}`,
    borderRadius: 10,
    padding: "11px 16px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "#fff",
    color: GREEN,
    border: `1px solid ${GREEN}`,
    borderRadius: 10,
    padding: "10px 14px",
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
  pill: {
    display: "inline-block",
    borderRadius: 999,
    background: GREEN_LIGHT,
    color: GREEN,
    padding: "5px 9px",
    fontSize: 12,
    fontWeight: 800,
  },
};

function getPlanId(value: unknown): PlanId {
  const plan = String(value ?? "").toLowerCase();

  if (plan.includes("elite")) return "elite";
  if (plan.includes("super")) return "super";
  return "host";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function HostDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  
const [profile, setProfile] = useState<any>(null);
const [bookingMode, setBookingMode] = useState<"manual" | "automatic">("manual");
const [savingBookingMode, setSavingBookingMode] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");

  const [planBilling, setPlanBilling] =
    useState<BillingInterval>("monthly");
  const [processingPlan, setProcessingPlan] = useState<PlanId | null>(null);

  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [processingPromotion, setProcessingPromotion] = useState(false);

  const loadDashboard = useCallback(
    async (mountedCheck: () => boolean = () => true) => {
      setLoading(true);
      setPageError("");

      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!currentUser) {
          navigate("/login");
          return;
        }

        if (!mountedCheck()) return;

        setUser(currentUser);

        // Profile is essential to determine whether this account is a host.
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!mountedCheck()) return;

        if (!profileData) {
          setPageError(
            "We couldn't find your profile. Please check that your profiles table has a record for your account."
          );
          return;
        }

        setProfile(profileData);
        setBookingMode(
  profileData.booking_mode === "automatic" ? "automatic" : "manual"
);

        if (profileData.role && profileData.role !== "host") {
          navigate("/account");
          return;
        }

        // Load each dashboard section independently so one optional section
        // cannot prevent the rest of the dashboard from appearing.
        const propertyResult = await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (!mountedCheck()) return;

        if (propertyResult.error) {
          console.error("Properties could not be loaded:", propertyResult.error);
          setProperties([]);
          setNotice("Some property information could not be loaded.");
        } else {
          const propertyData = propertyResult.data ?? [];
          setProperties(propertyData);

          const propertyIds = propertyData
            .map((property: any) => property.id)
            .filter(Boolean);

          if (propertyIds.length > 0) {
            const bookingResult = await supabase
              .from("bookings")
              .select("*")
              .in("property_id", propertyIds)
              .order("created_at", { ascending: false });

            if (!mountedCheck()) return;

            if (bookingResult.error) {
              console.error("Bookings could not be loaded:", bookingResult.error);
              setBookings([]);
            } else {
              setBookings(bookingResult.data ?? []);
            }
          } else {
            setBookings([]);
          }
        }

        const conversationResult = await supabase
          .from("conversations")
          .select("*")
          .eq("host_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (!mountedCheck()) return;

        if (conversationResult.error) {
          console.error(
            "Conversations could not be loaded:",
            conversationResult.error
          );
          setConversations([]);
        } else {
          setConversations(conversationResult.data ?? []);
        }

        // Reviews are optional. A missing host_id column or another reviews
        // query error should not crash the whole dashboard.
        const reviewResult = await supabase
          .from("reviews")
          .select("*")
          .eq("host_id", currentUser.id);

        if (!mountedCheck()) return;

        if (reviewResult.error) {
          console.error("Reviews could not be loaded:", reviewResult.error);
          setReviews([]);
        } else {
          setReviews(reviewResult.data ?? []);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);

        if (mountedCheck()) {
          setPageError(getErrorMessage(error));
        }
      } finally {
        if (mountedCheck()) setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    let mounted = true;

    void loadDashboard(() => mounted);

    return () => {
      mounted = false;
    };
  }, [loadDashboard]);

  const currentPlan = getPlanId(profile?.plan);
  const isVerified = Boolean(
    profile?.id_verified && profile?.insurance_verified
  );

  const grossEarnings = bookings.reduce((total, booking) => {
    const status = String(booking.status ?? "").toLowerCase();

    // Avoid counting cancelled or rejected bookings as earnings.
    if (["cancelled", "canceled", "rejected"].includes(status)) return total;

    const amount = Number(
      booking.total_price ?? booking.total_amount ?? booking.amount ?? 0
    );

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const commissionRate =
    currentPlan === "elite" ? 0.01 : currentPlan === "super" ? 0.05 : 0.12;

  const estimatedCommission = grossEarnings * commissionRate;
  const estimatedNet = grossEarnings - estimatedCommission;
const handleSaveBookingMode = async () => {
  if (!user?.id) {
    setPageError("Please sign in again.");
    return;
  }

  setSavingBookingMode(true);
  setPageError("");
  setNotice("");

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        booking_mode: bookingMode,
      })
      .eq("id", user.id);

    if (error) throw error;

    setNotice("Booking preference saved successfully.");
  } catch (error) {
    console.error(error);
    setPageError("Could not save booking preference.");
  } finally {
    setSavingBookingMode(false);
  }
};
  
  
  
  const handlePlanUpgrade = async (planId: PlanId) => {
    if (planId === "host") {
      setNotice("Host Free is the free plan.");
      return;
    }

    setProcessingPlan(planId);
    setPageError("");
    setNotice("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-plan-checkout",
        {
          body: {
            plan: planId,
            billingInterval: planBilling,
          },
        }
      );

      if (error) throw error;

      if (!data?.url || typeof data.url !== "string") {
        throw new Error(
          "The checkout link was not returned. Check that create-plan-checkout is deployed and configured."
        );
      }

      if (!data.url.startsWith("https://")) {
        throw new Error("The checkout link is not a valid secure URL.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Plan checkout error:", error);
      setPageError(
        `Unable to start checkout: ${getErrorMessage(error)}. Make sure the create-plan-checkout Supabase Edge Function and Stripe settings are configured.`
      );
    } finally {
      setProcessingPlan(null);
    }
  };

  const handlePromotionCheckout = async () => {
    const selectedProperty = properties.find(
      (property) => String(property.id) === selectedPropertyId
    );

    if (!selectedProperty) {
      setPageError("Please choose a property to promote first.");
      return;
    }

    setProcessingPromotion(true);
    setPageError("");
    setNotice("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-property-promotion-checkout",
        {
          body: {
            property_id: selectedProperty.id,
            promotion_type: "homepage_search",
          },
        }
      );

      if (error) throw error;

      if (!data?.url || typeof data.url !== "string") {
        throw new Error(
          "The checkout link was not returned. Check that create-property-promotion-checkout is deployed and configured."
        );
      }

      if (!data.url.startsWith("https://")) {
        throw new Error("The checkout link is not a valid secure URL.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Property promotion checkout error:", error);
      setPageError(
        `Unable to start promotion checkout: ${getErrorMessage(error)}. Make sure the create-property-promotion-checkout Supabase Edge Function and Stripe settings are configured.`
      );
    } finally {
      setProcessingPromotion(false);
    }
  };

  const goTo = (path: string) => navigate(path);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: PAGE_BG,
          color: GREEN_DARK,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
          <strong>Loading your host dashboard…</strong>
        </div>
      </div>
    );
  }

  if (pageError && !profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: PAGE_BG,
          padding: 24,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ ...styles.card, maxWidth: 540, width: "100%" }}>
          <h2 style={styles.sectionTitle}>We couldn't load your dashboard</h2>
          <p style={styles.muted}>{pageError}</p>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => void loadDashboard()}
          >
            Try again
          </button>
          <button
            type="button"
            style={{ ...styles.secondaryButton, marginLeft: 8 }}
            onClick={() => goTo("/account")}
          >
            Go to account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>🌿 Static Holidays</div>

        <nav
          aria-label="Host dashboard navigation"
          style={{ display: "flex", flexDirection: "column", gap: 5 }}
        >
          <button
            type="button"
            style={{ ...styles.navItem, ...styles.navActive }}
            onClick={() => goTo("/host-dashboard")}
          >
            ◫ &nbsp; Overview
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/my-properties")}
          >
            ⌂ &nbsp; My Properties
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/promote-property")}
          >
            ✦ &nbsp; Promote a Property
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/host-bookings")}
          >
            ▣ &nbsp; Bookings
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/host-compliance")}
          >
            ✓ &nbsp; Compliance Centre
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/host-messages")}
          >
            ✉ &nbsp; Messages
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/host-earnings")}
          >
            £ &nbsp; Earnings
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/host-reviews")}
          >
            ☆ &nbsp; Reviews
          </button>
          <button
            type="button"
            style={styles.navItem}
            onClick={() => goTo("/host-subscriptions")}
          >
            ◈ &nbsp; Plans & Membership
          </button>
        </nav>

        <div style={{ marginTop: "auto", padding: "24px 12px 0" }}>
          <div style={{ fontSize: 12, color: "#c1d9cb", marginBottom: 5 }}>
            Signed in as
          </div>
          <div
            style={{
              fontWeight: 700,
              overflowWrap: "anywhere",
              fontSize: 13,
            }}
          >
            {profile?.full_name || user?.email || "Host account"}
          </div>
          <button
            type="button"
            style={{ ...styles.navItem, marginTop: 18, paddingLeft: 0 }}
            onClick={() => goTo("/account")}
          >
            ⚙ &nbsp; Account settings
          </button>
          <button
            type="button"
            style={{ ...styles.navItem, paddingLeft: 0 }}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
          >
            ↪ &nbsp; Sign out
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p
              style={{
                margin: "0 0 7px",
                color: GREEN,
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
              }}
            >
              HOST CONTROL CENTRE
            </p>
            <h1 style={styles.heading}>
              Welcome back
              {profile?.full_name
                ? `, ${String(profile.full_name).split(" ")[0]}`
                : ""}
              !
            </h1>
            <p style={{ ...styles.muted, margin: "8px 0 0" }}>
              Manage your properties, bookings and host membership in one place.
            </p>
          </div>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => goTo("/add-property")}
          >
            + Add a property
          </button>
        </header>

        {pageError && (
          <div
            role="alert"
            style={{
              ...styles.card,
              borderColor: "#e9c2bd",
              background: "#fff8f7",
              color: "#8c3025",
              marginBottom: 18,
            }}
          >
            <strong>Something needs your attention</strong>
            <p style={{ margin: "6px 0 0", fontSize: 14 }}>{pageError}</p>
            <button
              type="button"
              style={{
                ...styles.secondaryButton,
                marginTop: 12,
                borderColor: "#c76b5d",
                color: "#8c3025",
              }}
              onClick={() => setPageError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            style={{
              ...styles.card,
              background: GREEN_LIGHT,
              color: GREEN_DARK,
              marginBottom: 18,
            }}
          >
            {notice}
          </div>
        )}

        <section style={{ ...styles.card, marginBottom: 20 }}>
  <h2 style={styles.sectionTitle}>Booking preferences</h2>

  <p style={styles.muted}>
    Choose how you want to handle booking requests.
  </p>

  <label style={{ display: "block", marginBottom: 12 }}>
    <input
      type="radio"
      name="bookingMode"
      checked={bookingMode === "manual"}
      onChange={() => setBookingMode("manual")}
      disabled={savingBookingMode}
    />
    {" "}Manual approval — I approve each booking myself.
  </label>

  <label style={{ display: "block", marginBottom: 16 }}>
    <input
      type="radio"
      name="bookingMode"
      checked={bookingMode === "automatic"}
      onChange={() => setBookingMode("automatic")}
      disabled={savingBookingMode}
    />
    {" "}Automatic booking — eligible bookings are confirmed automatically.
  </label>

  <button
    type="button"
    style={styles.primaryButton}
    onClick={() => void handleSaveBookingMode()}
    disabled={savingBookingMode}
  >
    {savingBookingMode ? "Saving..." : "Save booking preference"}
  </button>
</section>

        {!isVerified && (
          <section
            style={{
              ...styles.card,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
              marginBottom: 20,
              borderColor: "#ead9b4",
              background: "#fffaf0",
            }}
          >
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>
                ✓ Complete your host verification
              </div>
              <div style={{ ...styles.muted, color: "#796644" }}>
                Complete your identity and insurance checks to help keep
                Static Holidays safe and trustworthy.
              </div>
              <div style={{ marginTop: 12, fontSize: 13 }}>
                <span style={{ marginRight: 14 }}>
                  {profile?.id_verified ? "✓" : "○"} Identity verified
                </span>
                <span>
                  {profile?.insurance_verified ? "✓" : "○"} Insurance verified
                </span>
              </div>
            </div>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => goTo("/host-compliance")}
            >
              Complete verification →
            </button>
          </section>
        )}

        <section style={{ ...styles.grid, marginBottom: 26 }}>
          <div style={styles.card}>
            <div style={{ ...styles.muted, marginBottom: 12 }}>
              My properties
            </div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>
              {properties.length}
            </div>
            <div style={{ ...styles.muted, marginTop: 8 }}>
              Properties in your account
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.muted, marginBottom: 12 }}>
              Total bookings
            </div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>
              {bookings.length}
            </div>
            <div style={{ ...styles.muted, marginTop: 8 }}>
              Bookings across your properties
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.muted, marginBottom: 12 }}>
              Estimated net earnings
            </div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>
              {money(estimatedNet)}
            </div>
            <div style={{ ...styles.muted, marginTop: 8 }}>
              After an estimated {Math.round(commissionRate * 100)}% commission
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.muted, marginBottom: 12 }}>
              Current membership
            </div>
            <div style={{ fontSize: 23, fontWeight: 800 }}>
              {plans.find((plan) => plan.id === currentPlan)?.name ?? "Host Free"}
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={styles.pill}>
                {currentPlan === "elite"
                  ? "1% commission"
                  : currentPlan === "super"
                    ? "5% commission"
                    : "12% commission"}
              </span>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={styles.sectionTitle}>Your properties</h2>
              <p style={{ ...styles.muted, margin: 0 }}>
                Keep your listings up to date and ready for guests.
              </p>
            </div>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => goTo("/my-properties")}
            >
              View all properties →
            </button>
          </div>

          {properties.length === 0 ? (
            <div style={styles.card}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>⌂</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 17 }}>
                Your first property starts here
              </h3>
              <p style={styles.muted}>
                Add a holiday let to begin creating your listing and managing
                guest enquiries.
              </p>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={() => goTo("/add-property")}
              >
                + Add your first property
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {properties.slice(0, 6).map((property: any) => (
                <article key={property.id} style={styles.card}>
                  {property.image_url || property.cover_image ? (
                    <img
                      src={property.image_url || property.cover_image}
                      alt={property.title || property.name || "Holiday property"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: 155,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginBottom: 14,
                        background: GREEN_LIGHT,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 125,
                        borderRadius: 10,
                        background: GREEN_LIGHT,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 34,
                        marginBottom: 14,
                      }}
                    >
                      🏡
                    </div>
                  )}

                  <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>
                    {property.title ||
                      property.name ||
                      "Untitled property"}
                  </h3>
                  <p style={{ ...styles.muted, margin: "0 0 14px" }}>
                    {property.location ||
                      property.address ||
                      "Location not added"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => goTo(`/edit-property/${property.id}`)}
                    >
                      Edit listing
                    </button>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() =>
                        goTo(`/property-calendar/${property.id}`)
                      }
                    >
                      Calendar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginBottom: 30 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={styles.sectionTitle}>Bookings & earnings</h2>
            <p style={{ ...styles.muted, margin: 0 }}>
              A quick look at your recent booking activity.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <div style={styles.muted}>Booking value counted</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 7 }}>
                  {money(grossEarnings)}
                </div>
              </div>
              <div>
                <div style={styles.muted}>Estimated platform commission</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 7 }}>
                  {money(estimatedCommission)}
                </div>
              </div>
              <div>
                <div style={styles.muted}>Estimated earnings after commission</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 7 }}>
                  {money(estimatedNet)}
                </div>
              </div>
            </div>

            <p style={{ ...styles.muted, margin: "15px 0 0", fontSize: 12 }}>
              These figures are estimates based on the booking amounts returned
              by your database. They are not an accounting statement and may
              not reflect refunds, taxes or payment-processing charges.
            </p>

            <button
              type="button"
              style={{ ...styles.secondaryButton, marginTop: 16 }}
              onClick={() => goTo("/host-bookings")}
            >
              View bookings →
            </button>
          </div>
        </section>

        <section style={{ marginBottom: 30 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={styles.sectionTitle}>Account & membership plans</h2>
            <p style={{ ...styles.muted, margin: 0 }}>
              Choose a plan to reduce commission and increase your property's
              visibility.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div style={{ ...styles.muted, fontWeight: 700 }}>
              Choose your billing period
            </div>
            <div
              style={{
                display: "inline-flex",
                gap: 4,
                padding: 4,
                background: "#e9eeeb",
                borderRadius: 12,
              }}
            >
              <button
                type="button"
                aria-pressed={planBilling === "monthly"}
                onClick={() => setPlanBilling("monthly")}
                style={{
                  border: 0,
                  borderRadius: 9,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  background: planBilling === "monthly" ? "#fff" : "transparent",
                  color: TEXT,
                  boxShadow:
                    planBilling === "monthly"
                      ? "0 1px 4px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                Monthly
              </button>
              <button
                type="button"
                aria-pressed={planBilling === "yearly"}
                onClick={() => setPlanBilling("yearly")}
                style={{
                  border: 0,
                  borderRadius: 9,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  background: planBilling === "yearly" ? "#fff" : "transparent",
                  color: TEXT,
                  boxShadow:
                    planBilling === "yearly"
                      ? "0 1px 4px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                Yearly · 2 months free
              </button>
            </div>
          </div>

          <div style={styles.grid}>
            {plans.map((plan) => {
              const price =
                planBilling === "monthly"
                  ? plan.monthlyPrice
                  : plan.yearlyPrice;
              const isCurrent = currentPlan === plan.id;

              return (
                <article
                  key={plan.id}
                  style={{
                    ...styles.card,
                    position: "relative",
                    border: plan.popular
                      ? `2px solid ${GREEN}`
                      : `1px solid ${BORDER}`,
                    padding: plan.popular ? 21 : 22,
                  }}
                >
                  {plan.popular && (
                    <div style={{ marginBottom: 12 }}>
                      <span style={styles.pill}>MOST POPULAR</span>
                    </div>
                  )}

                  <h3 style={{ fontSize: 20, margin: "0 0 7px" }}>
                    {plan.name}
                  </h3>
                  <p style={{ ...styles.muted, margin: "0 0 18px" }}>
                    {plan.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontSize: 31, fontWeight: 850 }}>
                      {formatPrice(price)}
                    </span>
                    <span style={styles.muted}>
                      {plan.id === "host"
                        ? "/ forever"
                        : planBilling === "monthly"
                          ? "/ month"
                          : "/ year"}
                    </span>
                  </div>

                  {plan.id !== "host" && planBilling === "yearly" && (
                    <p style={{ ...styles.muted, margin: "5px 0 0", fontSize: 12 }}>
                      Equivalent to {formatPrice(price / 12)} per month, billed
                      yearly.
                    </p>
                  )}

                  <div
                    style={{
                      margin: "18px 0",
                      padding: 12,
                      background: GREEN_LIGHT,
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 12, color: MUTED }}>
                      Booking commission
                    </div>
                    <div
                      style={{
                        fontSize: 23,
                        fontWeight: 850,
                        color: GREEN_DARK,
                        marginTop: 3,
                      }}
                    >
                      {plan.commission}
                    </div>
                  </div>

                  <ul
                    style={{
                      paddingLeft: 20,
                      margin: "0 0 22px",
                      minHeight: 125,
                    }}
                  >
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        style={{
                          fontSize: 13,
                          lineHeight: 1.6,
                          marginBottom: 8,
                          color: "#35433b",
                        }}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={isCurrent || processingPlan !== null}
                    style={{
                      ...styles.primaryButton,
                      width: "100%",
                      opacity:
                        isCurrent || processingPlan !== null ? 0.65 : 1,
                      cursor:
                        isCurrent || processingPlan !== null
                          ? "not-allowed"
                          : "pointer",
                    }}
                    onClick={() => void handlePlanUpgrade(plan.id)}
                  >
                    {processingPlan === plan.id
                      ? "Opening secure checkout…"
                      : isCurrent
                        ? "Your current plan"
                        : plan.id === "host"
                          ? "Free plan"
                          : `Buy ${plan.name} →`}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 30 }}>
          <div
            style={{
              ...styles.card,
              background: GREEN_DARK,
              color: "#fff",
              border: 0,
              padding: "clamp(22px, 4vw, 34px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 280px" }}>
                <span
                  style={{
                    ...styles.pill,
                    background: "rgba(255,255,255,0.14)",
                    color: "#fff",
                  }}
                >
                  ONE-OFF PROMOTION
                </span>
                <h2
                  style={{
                    fontSize: 25,
                    lineHeight: 1.25,
                    margin: "14px 0 10px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Put your property in the spotlight
                </h2>
                <p
                  style={{
                    margin: 0,
                    maxWidth: 570,
                    color: "#d6e6dc",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  Promote a property on the homepage and improve its search
                  visibility for 30 days — without changing your subscription.
                </p>
                <div
                  style={{
                    fontSize: 31,
                    fontWeight: 850,
                    marginTop: 18,
                  }}
                >
                  £4.99{" "}
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    / 30 days
                  </span>
                </div>
              </div>

              <div
                style={{
                  flex: "1 1 260px",
                  maxWidth: 380,
                  background: "#fff",
                  color: TEXT,
                  padding: 18,
                  borderRadius: 13,
                }}
              >
                <label
                  htmlFor="promotion-property"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  Choose a property to promote
                </label>
                <select
                  id="promotion-property"
                  value={selectedPropertyId}
                  onChange={(event) =>
                    setSelectedPropertyId(event.target.value)
                  }
                  style={styles.input}
                >
                  <option value="">Select your property…</option>
                  {properties.map((property: any) => (
                    <option key={property.id} value={String(property.id)}>
                      {property.title || property.name || `Property ${property.id}`}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={
                    !selectedPropertyId ||
                    processingPromotion ||
                    properties.length === 0
                  }
                  style={{
                    ...styles.primaryButton,
                    width: "100%",
                    marginTop: 12,
                    opacity:
                      !selectedPropertyId ||
                      processingPromotion ||
                      properties.length === 0
                        ? 0.6
                        : 1,
                  }}
                  onClick={() => void handlePromotionCheckout()}
                >
                  {processingPromotion
                    ? "Opening secure checkout…"
                    : "Promote for £4.99 →"}
                </button>

                {properties.length === 0 && (
                  <p
                    style={{
                      color: MUTED,
                      fontSize: 12,
                      lineHeight: 1.5,
                      margin: "10px 0 0",
                    }}
                  >
                    Add a property before purchasing a promotion.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={styles.sectionTitle}>Recent messages</h2>
              <p style={{ ...styles.muted, margin: 0 }}>
                Keep up with guest enquiries.
              </p>
            </div>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => goTo("/host-messages")}
            >
              Open messages →
            </button>
          </div>

          <div style={styles.card}>
            {conversations.length === 0 ? (
              <p style={{ ...styles.muted, margin: 0 }}>
                No conversations to show yet. Guest enquiries will appear here
                when available.
              </p>
            ) : (
              conversations.slice(0, 5).map((conversation: any) => (
                <div
                  key={conversation.id}
                  style={{
                    padding: "13px 0",
                    borderBottom: `1px solid ${BORDER}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 750, fontSize: 14 }}>
                      {conversation.subject ||
                        conversation.guest_name ||
                        conversation.title ||
                        "Guest conversation"}
                    </div>
                    <div style={{ ...styles.muted, fontSize: 12, marginTop: 4 }}>
                      {conversation.updated_at || conversation.created_at
                        ? new Date(
                            conversation.updated_at || conversation.created_at
                          ).toLocaleDateString("en-GB")
                        : "Date unavailable"}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => goTo(`/host-messages/${conversation.id}`)}
                  >
                    Open
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section style={{ marginBottom: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={styles.sectionTitle}>Guest reviews</h2>
              <p style={{ ...styles.muted, margin: 0 }}>
                See the feedback guests have left about their stays.
              </p>
            </div>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => goTo("/host-reviews")}
            >
              View reviews →
            </button>
          </div>

          <div style={styles.card}>
            {reviews.length === 0 ? (
              <p style={{ ...styles.muted, margin: 0 }}>
                No reviews to display yet. If you expected reviews here, check
                the browser console for “Reviews could not be loaded” and verify
                that your reviews table has a host_id column.
              </p>
            ) : (
              reviews.slice(0, 5).map((review: any) => (
                <article
                  key={review.id}
                  style={{
                    padding: "14px 0",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ fontSize: 14 }}>
                      {review.guest_name ||
                        review.reviewer_name ||
                        "Guest review"}
                    </strong>
                    <span style={{ color: "#a56a14", fontWeight: 800 }}>
                      {review.rating != null
                        ? `${"★".repeat(
                            Math.max(
                              0,
                              Math.min(5, Math.round(Number(review.rating) || 0))
                            )
                          )} ${review.rating}/5`
                        : "Rating not supplied"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#4c5951",
                      lineHeight: 1.65,
                      margin: "8px 0 0",
                    }}
                  >
                    {review.comment ||
                      review.review_text ||
                      review.content ||
                      "No written comment."}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <footer
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 18,
            color: MUTED,
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          Static Holidays host dashboard · Membership prices and commission
          estimates are displayed for guidance. Check your account and payment
          configuration before accepting live payments.
        </footer>
      </main>
    </div>
  );
}
