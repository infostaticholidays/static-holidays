
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type PlanId = "free" | "super" | "elite";
type BillingInterval = "monthly" | "yearly";

type Subscription = {
  plan_id: PlanId;
  billing_interval: BillingInterval;
  status: string;
  started_at: string;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
};

const plans = [
  {
    id: "free" as PlanId,
    name: "Host Free",
    monthly: 0,
    yearly: 0,
    commission: "12%",
    description: "Get started with your holiday property.",
    benefits: [
      "List your holiday property",
      "Access your host dashboard",
      "Manage your bookings",
      "Standard host support",
    ],
  },
  {
    id: "super" as PlanId,
    name: "Super Host",
    monthly: 19.99,
    yearly: 199.9,
    commission: "5%",
    description: "More savings for growing hosts.",
    benefits: [
      "Everything in Host Free",
      "Reduced booking commission",
      "Enhanced host visibility",
      "Priority host support",
    ],
  },
  {
    id: "elite" as PlanId,
    name: "Elite Host",
    monthly: 39.99,
    yearly: 399.9,
    commission: "1%",
    description: "Our premium host membership.",
    benefits: [
      "Everything in Super Host",
      "Our lowest booking commission",
      "Premium promotional opportunities",
      "Priority membership assistance",
    ],
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateLoyalty(startedAt?: string | null) {
  if (!startedAt) {
    return {
      years: 0,
      title: "Welcome to Static Holidays",
      description: "Your loyalty journey starts today.",
    };
  }

  const start = new Date(startedAt);

  if (Number.isNaN(start.getTime())) {
    return {
      years: 0,
      title: "Host Member",
      description: "Thank you for being part of Static Holidays.",
    };
  }

  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();

  const anniversary = new Date(start);
  anniversary.setFullYear(start.getFullYear() + years);

  if (now < anniversary) years--;

  years = Math.max(0, years);

  if (years >= 5) {
    return {
      years,
      title: "Lifetime Loyalty",
      description:
        "You have reached our five-year loyalty milestone.",
    };
  }

  if (years >= 3) {
    return {
      years,
      title: "Platinum Loyalty",
      description:
        "You have reached our three-year loyalty milestone.",
    };
  }

  if (years >= 1) {
    return {
      years,
      title: "Gold Loyalty",
      description:
        "You have reached our one-year loyalty milestone.",
    };
  }

  return {
    years,
    title: "Growing Together",
    description:
      "Reach your first anniversary to qualify for returning-host offers.",
  };
}

export default function HostSubscriptions() {
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [billing, setBilling] =
    useState<BillingInterval>("monthly");

  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] =
    useState<PlanId | null>(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMembership() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          if (active) {
            setError("Please sign in to view your membership.");
          }
          return;
        }

        const { data, error: queryError } = await supabase
          .from("host_subscriptions")
          .select(
            "plan_id, billing_interval, status, started_at, current_period_start, current_period_end, canceled_at"
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (queryError) throw queryError;

        if (active && data) {
          setSubscription(data as Subscription);

          setBilling(
            data.billing_interval === "yearly"
              ? "yearly"
              : "monthly"
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load membership information."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMembership();

    return () => {
      active = false;
    };
  }, []);

  const currentPlan = plans.find(
    (plan) => plan.id === subscription?.plan_id
  );

  const loyalty = calculateLoyalty(subscription?.started_at);

  async function choosePlan(planId: PlanId) {
    setError("");
    setNotice("");

    if (planId === "free") {
      setNotice(
        "Host Free costs nothing. If you are changing from a paid plan, please use your subscription billing portal or contact support."
      );
      return;
    }

    setCheckoutPlan(planId);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setError("Please sign in before choosing a plan.");
        return;
      }

      const { data, error: checkoutError } =
        await supabase.functions.invoke("create-plan-checkout", {
          body: {
            plan: planId,
            billingInterval: billing,
          },
        });

      if (checkoutError) throw checkoutError;

      if (!data?.url) {
        throw new Error(
          "Checkout did not return a payment URL. Check that the checkout function is configured."
        );
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start membership checkout."
      );
    } finally {
      setCheckoutPlan(null);
    }
  }

  return (
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "32px 20px 56px",
        color: "#1f2937",
      }}
    >
      <Link
        to="/host-dashboard"
        style={{
          color: "#166534",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Back to Owners Dashboard
      </Link>

      <header style={{ margin: "24px 0 30px" }}>
        <p
          style={{
            color: "#15803d",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 12,
          }}
        >
          Static Holidays Host Club
        </p>

        <h1 style={{ fontSize: 34, margin: "8px 0" }}>
          Plans &amp; Membership
        </h1>

        <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
          Manage your membership, check your renewal dates and discover
          benefits designed to reward our loyal hosts.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          style={{
            padding: 16,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            marginBottom: 20,
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          style={{
            padding: 16,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          {notice}
        </div>
      )}

      <section
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 16,
          padding: 24,
          marginBottom: 30,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Your membership details</h2>

        {loading ? (
          <p>Loading your membership…</p>
        ) : subscription ? (
          <>
            <p style={{ fontSize: 23, fontWeight: 700 }}>
              {currentPlan?.name ?? subscription.plan_id}
            </p>

            <p>
              Membership status:{" "}
              <strong>{subscription.status}</strong>
            </p>

            <p>
              Billing frequency:{" "}
              <strong>
                {subscription.billing_interval === "yearly"
                  ? "Annual"
                  : "Monthly"}
              </strong>
            </p>

            <p>
              Started on:{" "}
              <strong>{formatDate(subscription.started_at)}</strong>
            </p>

            <p>
              Current billing period began:{" "}
              <strong>
                {formatDate(subscription.current_period_start)}
              </strong>
            </p>

            <p>
              Next renewal / period end:{" "}
              <strong>
                {formatDate(subscription.current_period_end)}
              </strong>
            </p>

            {subscription.canceled_at && (
              <p>
                Cancellation recorded:{" "}
                <strong>{formatDate(subscription.canceled_at)}</strong>
              </p>
            )}

            <p>
              Booking commission:{" "}
              <strong>
                {currentPlan?.commission ?? "Contact support"}
              </strong>
            </p>
          </>
        ) : (
          <>
            <p>No membership record was found for your account.</p>
            <p>
              You can review the plans below. Your subscription dates
              will appear here when your membership is recorded in
              Supabase.
            </p>
          </>
        )}
      </section>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
          marginBottom: 30,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Your loyalty rewards</h2>

        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#166534",
          }}
        >
          {loyalty.title}
        </p>

        <p>{loyalty.description}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 14,
            marginTop: 20,
          }}
        >
          {[
            {
              years: 1,
              name: "Gold",
              benefit: "Returning-host offers",
            },
            {
              years: 3,
              name: "Platinum",
              benefit: "Enhanced loyalty offers",
            },
            {
              years: 5,
              name: "Lifetime",
              benefit: "Highest loyalty offers",
            },
          ].map((tier) => {
            const reached = loyalty.years >= tier.years;

            return (
              <div
                key={tier.years}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: `1px solid ${
                    reached ? "#86efac" : "#e5e7eb"
                  }`,
                  background: reached ? "#dcfce7" : "#f9fafb",
                }}
              >
                <strong>{tier.name} Loyalty</strong>
                <p>
                  {tier.years}+{" "}
                  {tier.years === 1 ? "year" : "years"}
                </p>
                <p style={{ fontSize: 14 }}>{tier.benefit}</p>
                <small>
                  {reached ? "Milestone reached" : "Future milestone"}
                </small>
              </div>
            );
          })}
        </div>

        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 18 }}>
          Loyalty milestones show eligibility for potential offers.
          Discounts are not automatically applied until the billing
          system has been configured to honour them.
        </p>
      </section>

      <section>
        <h2>Choose your membership</h2>

        <p style={{ color: "#6b7280" }}>
          Compare the plans and choose monthly or annual billing.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            margin: "20px 0 24px",
          }}
        >
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            style={{
              padding: "11px 18px",
              borderRadius: 8,
              border: "1px solid #166534",
              background:
                billing === "monthly" ? "#166534" : "#ffffff",
              color: billing === "monthly" ? "#ffffff" : "#166534",
              cursor: "pointer",
            }}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setBilling("yearly")}
            style={{
              padding: "11px 18px",
              borderRadius: 8,
              border: "1px solid #166534",
              background:
                billing === "yearly" ? "#166534" : "#ffffff",
              color: billing === "yearly" ? "#ffffff" : "#166534",
              cursor: "pointer",
            }}
          >
            Annual · 2 months free
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {plans.map((plan) => {
            const price =
              billing === "monthly" ? plan.monthly : plan.yearly;

            const isCurrent =
              subscription?.plan_id === plan.id &&
              subscription?.status === "active";

            return (
              <article
                key={plan.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 24,
                  border: isCurrent
                    ? "2px solid #15803d"
                    : "1px solid #e5e7eb",
                  borderRadius: 16,
                  background: "#ffffff",
                }}
              >
                {isCurrent && (
                  <p
                    style={{
                      color: "#166534",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    YOUR CURRENT PLAN
                  </p>
                )}

                <h3 style={{ fontSize: 23, marginBottom: 6 }}>
                  {plan.name}
                </h3>

                <p style={{ color: "#6b7280", minHeight: 44 }}>
                  {plan.description}
                </p>

                <p style={{ margin: "12px 0" }}>
                  <strong style={{ fontSize: 32 }}>
                    {money(price)}
                  </strong>
                  <span style={{ color: "#6b7280" }}>
                    {plan.id === "free"
                      ? " / month"
                      : billing === "monthly"
                        ? " / month"
                        : " / year"}
                  </span>
                </p>

                {billing === "yearly" && plan.id !== "free" && (
                  <p style={{ color: "#15803d", fontSize: 13 }}>
                    {money((plan.monthly * 12) - plan.yearly)} saved per year
                  </p>
                )}

                <div
                  style={{
                    background: "#f0fdf4",
                    padding: 12,
                    borderRadius: 8,
                    margin: "12px 0",
                  }}
                >
                  <span style={{ color: "#166534" }}>
                    Booking commission
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    {plan.commission}
                  </div>
                </div>

                <ul style={{ paddingLeft: 20, lineHeight: 1.9 }}>
                  {plan.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={isCurrent || checkoutPlan !== null}
                  onClick={() => choosePlan(plan.id)}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    padding: 13,
                    border: 0,
                    borderRadius: 8,
                    background: isCurrent ? "#d1d5db" : "#166534",
                    color: isCurrent ? "#374151" : "#ffffff",
                    fontWeight: 700,
                    cursor: isCurrent ? "default" : "pointer",
                  }}
                >
                  {isCurrent
                    ? "Current membership"
                    : checkoutPlan === plan.id
                      ? "Opening checkout…"
                      : plan.id === "free"
                        ? "Host Free"
                        : `Choose ${plan.name}`}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section
        style={{
          marginTop: 32,
          padding: 24,
          background: "#f9fafb",
          borderRadius: 12,
        }}
      >
        <h2>Need membership help?</h2>
        <p>
          Return to your Owners Dashboard to continue managing your
          properties and bookings.
        </p>
        <Link
          to="/host-dashboard"
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "12px 18px",
            borderRadius: 8,
            background: "#166534",
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          Return to Owners Dashboard
        </Link>
      </section>
    </div>
  );
}
