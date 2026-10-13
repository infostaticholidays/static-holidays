
import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type RecordData = Record<string, any>;

const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);

const cardStyle: CSSProperties = {
  background: "#ffffff",
  padding: 22,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  minWidth: 0,
};

const buttonStyle: CSSProperties = {
  background: "#15803d",
  color: "#ffffff",
  border: "none",
  padding: "10px 15px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryButton: CSSProperties = {
  ...buttonStyle,
  background: "#f1f5f9",
  color: "#1e293b",
  border: "1px solid #e2e8f0",
};

const mutedText: CSSProperties = {
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.6,
};

const sectionStyle: CSSProperties = {
  ...cardStyle,
  marginBottom: 24,
};

export default function HostDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<RecordData | null>(null);

  const [conversations, setConversations] = useState<RecordData[]>([]);
  const [properties, setProperties] = useState<RecordData[]>([]);
  const [bookings, setBookings] = useState<RecordData[]>([]);
  const [reviews, setReviews] = useState<RecordData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const loadDashboard = useCallback(async () => {
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

      setUser(currentUser);

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

      if (profileError) throw profileError;

      if (!profileData || profileData.role !== "host") {
        navigate("/account");
        return;
      }

      setProfile(profileData);

      const { data: propertyData, error: propertyError } =
        await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", currentUser.id);

      if (propertyError) throw propertyError;

      const propertyList = propertyData || [];
      setProperties(propertyList);

      let bookingList: RecordData[] = [];

      if (propertyList.length > 0) {
        const { data: bookingData, error: bookingError } =
          await supabase
            .from("bookings")
            .select("*")
            .in(
              "property_id",
              propertyList.map((property) => property.id)
            );

        if (bookingError) throw bookingError;
        bookingList = bookingData || [];
      }

      setBookings(bookingList);

      const { data: conversationData, error: conversationError } =
        await supabase
          .from("conversations")
          .select("*")
          .eq("host_id", currentUser.id);

      if (conversationError) throw conversationError;
      setConversations(conversationData || []);

      const { data: reviewData, error: reviewError } =
        await supabase
          .from("reviews")
          .select("*")
          .eq("host_id", currentUser.id);

      if (reviewError) throw reviewError;
      setReviews(reviewData || []);
    } catch (err: unknown) {
      console.error("Host dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  // ACCOUNT AND PLAN

  const plan = profile?.subscription_plan || "host";

  const planName =
    plan === "elite"
      ? "Elite Host"
      : plan === "super"
      ? "Super Host"
      : "Host (Free)";

  const commissionRate =
    plan === "elite" ? 0.01 : plan === "super" ? 0.05 : 0.12;

  // The existing schema exposes these two verification flags.
  // Detailed document progress belongs in HostCompliance.tsx.

  const isVerified =
    Boolean(profile?.id_verified) &&
    Boolean(profile?.insurance_verified);

  const verificationChecks = [
    Boolean(profile?.id_verified),
    Boolean(profile?.insurance_verified),
  ];

  const verificationCount = verificationChecks.filter(Boolean).length;

  // FINANCIAL SUMMARY
  // These figures use the existing booking records.
  // They are estimates, not confirmed payouts.

  const gross = bookings.reduce(
    (sum, booking) =>
      sum + (Number(booking.total_price) || 0),
    0
  );

  const commission = gross * commissionRate;
  const estimatedNet = gross - commission;

  const potentialMonthly = properties.reduce(
    (sum, property) =>
      sum + (Number(property.price_per_night) || 0) * 30,
    0
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) => sum + (Number(review.rating) || 0),
          0
        ) / reviews.length
      : 0;

  const draftProperties = properties.filter(
    (property) =>
      String(property.status || "").toLowerCase() === "draft"
  );

  const publishedProperties = properties.filter(
    (property) =>
      ["published", "live", "active"].includes(
        String(property.status || "").toLowerCase()
      )
  );

  // NAVIGATION

  function goToSection(section: string) {
    setActiveSection(section);

    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // DELETE PROPERTY

  async function deleteProperty(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This cannot be undone."
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    const { error: deleteError } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    if (deleteError) {
      setError(
        "The property could not be deleted. Check its bookings and your permissions."
      );
      return;
    }

    setProperties((previous) =>
      previous.filter((property) => property.id !== id)
    );

    setNotice("Property deleted successfully.");
  }

  // ACCOUNT PREFERENCES

  async function updatePreference(
    field: "newsletter" | "featured_marketing",
    checked: boolean
  ) {
    if (!user || !profile) return;

    setError("");
    setNotice("");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ [field]: checked })
      .eq("id", user.id);

    if (updateError) {
      setError("Your preference could not be saved. Please try again.");
      return;
    }

    setProfile((previous) =>
      previous ? { ...previous, [field]: checked } : previous
    );

    setNotice("Your preferences have been saved.");
  }

  // LOADING AND ERROR STATES

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <p>Loading your Static Holidays dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2>Dashboard unavailable</h2>
          <p style={mutedText}>
            We could not load your host account.
          </p>

          {error && <p style={errorStyle}>{error}</p>}

          <button style={buttonStyle} onClick={loadDashboard}>
            Try again
          </button>

          <button
            style={{ ...secondaryButton, marginLeft: 8 }}
            onClick={() => navigate("/login")}
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD

  const firstName =
    profile.full_name?.trim().split(/\s+/)[0] || "Host";

  const navigation = [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "properties", label: "My Properties", icon: "⌂" },
    { id: "bookings", label: "Bookings", icon: "▣" },
    { id: "compliance", label: "Compliance Centre", icon: "✓" },
    { id: "messages", label: "Messages", icon: "✉" },
    { id: "earnings", label: "Earnings", icon: "£" },
    { id: "reviews", label: "Reviews", icon: "★" },
    { id: "account", label: "Account & Plan", icon: "⚙" },
  ];

  return (
    <div style={pageStyle}>
      <div style={layoutStyle}>
        {/* SIDEBAR */}

        <aside style={sidebarStyle}>
          <div style={{ padding: "8px 12px 24px" }}>
            <div style={brandStyle}>STATIC HOLIDAYS</div>
            <p style={mutedText}>Host portal</p>
          </div>

          <nav aria-label="Host dashboard navigation">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => goToSection(item.id)}
                style={{
                  ...navButtonStyle,
                  ...(activeSection === item.id
                    ? activeNavStyle
                    : {}),
                }}
                aria-current={
                  activeSection === item.id ? "location" : undefined
                }
              >
                <span style={{ width: 25 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div style={sidebarFooterStyle}>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>
              {planName}
            </p>
            <p style={mutedText}>
              Manage your holiday rental business.
            </p>
            <button
              style={{ ...secondaryButton, width: "100%" }}
              onClick={() => navigate("/account")}
            >
              Account settings
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <main style={mainStyle}>
          <header style={headerStyle}>
            <div>
              <p style={eyebrowStyle}>HOST PORTAL</p>
              <h1 style={headingStyle}>
                Welcome back, {firstName}
              </h1>
              <p style={mutedText}>
                Manage your properties, guests and holiday lets.
              </p>
            </div>

            <button
              style={buttonStyle}
              onClick={() => navigate("/host-compliance")}
            >
              View compliance
            </button>
          </header>

          {error && (
            <div role="alert" style={errorStyle}>
              <strong>Something needs attention</strong>
              <p>{error}</p>
              <button
                style={secondaryButton}
                onClick={loadDashboard}
              >
                Reload dashboard
              </button>
            </div>
          )}

          {notice && (
            <div role="status" style={successStyle}>
              {notice}
            </div>
          )}

          {/* OVERVIEW */}

          <section id="overview" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>YOUR BUSINESS</p>
                <h2 style={subheadingStyle}>Dashboard overview</h2>
              </div>

              <span style={planBadgeStyle}>{planName}</span>
            </div>

            <div style={statsGridStyle}>
              <StatCard
                icon="⌂"
                label="Properties"
                value={properties.length}
                detail={`${draftProperties.length} saved drafts`}
              />

              <StatCard
                icon="▣"
                label="Bookings"
                value={bookings.length}
                detail="Booking records"
              />

              <StatCard
                icon="✉"
                label="Conversations"
                value={conversations.length}
                detail="Your conversations"
              />

              <StatCard
                icon="★"
                label="Reviews"
                value={reviews.length}
                detail={
                  reviews.length
                    ? `${averageRating.toFixed(1)} average rating`
                    : "No ratings yet"
                }
              />
            </div>
          </section>

          {/* VERIFICATION */}

          <section id="compliance" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>ACCOUNT REQUIREMENTS</p>
                <h2 style={subheadingStyle}>Verification progress</h2>
              </div>

              <span
                style={{
                  ...statusBadgeStyle,
                  ...(isVerified ? approvedBadgeStyle : pendingBadgeStyle),
                }}
              >
                {isVerified ? "Basic checks complete" : "Action required"}
              </span>
            </div>

            <p style={mutedText}>
              {isVerified
                ? "Your existing ID and insurance verification flags are complete. Check the Compliance Centre for the status of every required document."
                : "Complete your identity and insurance checks. You can visit the Compliance Centre to see the status of each required document."}
            </p>

            <div style={progressTrackStyle}>
              <div
                style={{
                  ...progressFillStyle,
                  width: `${(verificationCount / 2) * 100}%`,
                }}
              />
            </div>

            <p style={mutedText}>
              {verificationCount} of 2 basic account verification flags complete.
              {" "}This is not the full document approval count.
            </p>

            <div style={checkRowStyle}>
              <span>
                {profile.id_verified ? "✓" : "○"} Identity verification
              </span>
              <strong>
                {profile.id_verified ? "Verified" : "Outstanding"}
              </strong>
            </div>

            <div style={checkRowStyle}>
              <span>
                {profile.insurance_verified ? "✓" : "○"} Insurance verification
              </span>
              <strong>
                {profile.insurance_verified ? "Verified" : "Outstanding"}
              </strong>
            </div>

            <button
              style={{ ...buttonStyle, marginTop: 18 }}
              onClick={() => navigate("/host-compliance")}
            >
              Open Compliance Centre →
            </button>

            {!isVerified && (
              <p style={warningTextStyle}>
                Do not publish a property until all required documents and
                the property itself have been approved.
              </p>
            )}
          </section>

          {/* PROPERTIES */}

          <section id="properties" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>YOUR ACCOMMODATION</p>
                <h2 style={subheadingStyle}>My properties</h2>
              </div>

              <button
                style={buttonStyle}
                onClick={() => navigate("/add-property")}
              >
                + Add property
              </button>
            </div>

            {!isVerified && (
              <div style={infoBoxStyle}>
                <strong>Prepare your listing while you wait</strong>
                <p style={mutedText}>
                  You can start preparing property details. Your add-property
                  page must support saving drafts, and unapproved listings
                  must remain unpublished.
                </p>
              </div>
            )}

            {properties.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={emptyIconStyle}>⌂</div>
                <h3>No properties yet</h3>
                <p style={mutedText}>
                  Start adding your holiday property to your account.
                </p>
                <button
                  style={buttonStyle}
                  onClick={() => navigate("/add-property")}
                >
                  Add your first property
                </button>
              </div>
            ) : (
              <div style={propertyGridStyle}>
                {properties.map((property) => {
                  const status = String(
                    property.status || "Status not recorded"
                  );

                  const isDraft =
                    status.toLowerCase() === "draft";

                  return (
                    <article
                      key={property.id}
                      style={propertyCardStyle}
                    >
                      <div style={propertyIconStyle}>⌂</div>

                      <div style={propertyContentStyle}>
                        <div style={sectionHeadingStyle}>
                          <h3 style={propertyTitleStyle}>
                            {property.title || "Untitled property"}
                          </h3>

                          <span
                            style={{
                              ...statusBadgeStyle,
                              ...(isDraft
                                ? pendingBadgeStyle
                                : neutralBadgeStyle),
                            }}
                          >
                            {status}
                          </span>
                        </div>

                        <p style={mutedText}>
                          {property.location || "Location not added"}
                        </p>

                        <p style={priceStyle}>
                          {money(Number(property.price_per_night) || 0)}
                          <span style={mutedText}> / night</span>
                        </p>

                        <div style={actionRowStyle}>
                          <button
                            style={secondaryButton}
                            onClick={() =>
                              navigate(
                                `/property-calendar/${property.id}`
                              )
                            }
                          >
                            Calendar
                          </button>

                          <button
                            style={secondaryButton}
                            onClick={() =>
                              navigate(`/add-property?id=${property.id}`)
                            }
                          >
                            Edit
                          </button>

                          <button
                            style={dangerButtonStyle}
                            onClick={() => deleteProperty(property.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <p style={{ ...mutedText, marginTop: 16 }}>
              {publishedProperties.length} properties marked published,
              live or active in the existing status field.
            </p>
          </section>

          {/* BOOKINGS */}

          <section id="bookings" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>GUEST STAYS</p>
                <h2 style={subheadingStyle}>Bookings</h2>
              </div>

              <span style={planBadgeStyle}>
                {bookings.length} records
              </span>
            </div>

            {bookings.length === 0 ? (
              <EmptyMessage message="Your bookings will appear here when available." />
            ) : (
              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={tableCellStyle}>Check-in</th>
                      <th style={tableCellStyle}>Check-out</th>
                      <th style={tableCellStyle}>Booking value</th>
                      <th style={tableCellStyle}>Booking ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td style={tableCellStyle}>
                          {booking.start_date || "—"}
                        </td>
                        <td style={tableCellStyle}>
                          {booking.end_date || "—"}
                        </td>
                        <td style={tableCellStyle}>
                          {money(Number(booking.total_price) || 0)}
                        </td>
                        <td style={tableCellStyle}>
                          {String(booking.id).slice(0, 8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p style={mutedText}>
              Booking records may include cancelled or unpaid bookings.
              Confirmed stays and paid earnings require the appropriate
              booking status fields.
            </p>
          </section>

          {/* MESSAGES */}

          <section id="messages" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>COMMUNICATION</p>
                <h2 style={subheadingStyle}>Messages</h2>
              </div>

              <span style={planBadgeStyle}>
                {conversations.length} conversations
              </span>
            </div>

            {conversations.length === 0 ? (
              <EmptyMessage message="You have no conversations yet." />
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} style={listItemStyle}>
                  <div style={{ minWidth: 0 }}>
                    <strong>Guest conversation</strong>
                    <p style={mutedText}>
                      Booking: {conversation.booking_id || "Not linked"}
                    </p>
                  </div>

                  <button
                    style={secondaryButton}
                    onClick={() =>
                      conversation.booking_id &&
                      navigate(`/messages/${conversation.booking_id}`)
                    }
                    disabled={!conversation.booking_id}
                  >
                    Open chat
                  </button>
                </div>
              ))
            )}
          </section>

          {/* EARNINGS */}

          <section id="earnings" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>FINANCIAL OVERVIEW</p>
                <h2 style={subheadingStyle}>Earnings estimate</h2>
              </div>
            </div>

            <div style={statsGridStyle}>
              <StatCard
                icon="£"
                label="Recorded booking value"
                value={money(gross)}
                detail="Before estimated commission"
              />

              <StatCard
                icon="↘"
                label="Estimated commission"
                value={money(commission)}
                detail={`${commissionRate * 100}% illustrative plan rate`}
              />

              <StatCard
                icon="✓"
                label="Estimated after commission"
                value={money(estimatedNet)}
                detail="Not a confirmed payout"
              />

              <StatCard
                icon="⌂"
                label="Potential 30-night value"
                value={money(potentialMonthly)}
                detail="Assumes every property is booked for 30 nights"
              />
            </div>

            <div style={infoBoxStyle}>
              <p style={mutedText}>
                These figures are estimates based on your current property
                and booking records. They do not account for booking status,
                refunds, taxes, adjustments or payment settlement.
                Verify your actual commission arrangements before relying
                on these amounts.
              </p>
            </div>
          </section>

          {/* REVIEWS */}

          <section id="reviews" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>GUEST FEEDBACK</p>
                <h2 style={subheadingStyle}>Reviews</h2>
              </div>

              <span style={planBadgeStyle}>
                {reviews.length} reviews
              </span>
            </div>

            {reviews.length === 0 ? (
              <EmptyMessage message="Guest reviews will appear here when received." />
            ) : (
              reviews.map((review) => (
                <article key={review.id} style={reviewCardStyle}>
                  <div style={{ fontWeight: 700 }}>
                    {"★".repeat(
                      Math.min(
                        5,
                        Math.max(0, Number(review.rating) || 0)
                      )
                    )}
                    {" "}
                    {review.rating ?? "—"} / 5
                  </div>

                  <p style={{ lineHeight: 1.7 }}>
                    {review.review_text || "No written feedback provided."}
                  </p>
                </article>
              ))
            )}
          </section>

          {/* ACCOUNT */}

          <section id="account" style={sectionStyle}>
            <div style={sectionHeadingStyle}>
              <div>
                <p style={eyebrowStyle}>YOUR ACCOUNT</p>
                <h2 style={subheadingStyle}>Account & plan</h2>
              </div>
            </div>

            <div style={infoBoxStyle}>
              <p>
                <strong>Owner:</strong> {profile.full_name || "Host"}
              </p>
              <p>
                <strong>Email:</strong> {user.email || "Not available"}
              </p>
              <p>
                <strong>Current plan:</strong> {planName}
              </p>
              <p>
                <strong>Identity:</strong>{" "}
                {profile.id_verified ? "Verified" : "Not verified"}
              </p>
              <p>
                <strong>Insurance:</strong>{" "}
                {profile.insurance_verified ? "Verified" : "Not verified"}
              </p>
            </div>

            <label style={preferenceLabelStyle}>
              <input
                type="checkbox"
                checked={Boolean(profile.newsletter)}
                onChange={(event) =>
                  void updatePreference(
                    "newsletter",
                    event.target.checked
                  )
                }
              />
              Receive the Static Holidays newsletter
            </label>

            {plan === "super" || plan === "elite" ? (
              <label style={preferenceLabelStyle}>
                <input
                  type="checkbox"
                  checked={Boolean(profile.featured_marketing)}
                  onChange={(event) =>
                    void updatePreference(
                      "featured_marketing",
                      event.target.checked
                    )
                  }
                />
                Consider my property for newsletter and social media
                promotion
              </label>
            ) : (
              <div style={infoBoxStyle}>
                <strong>Promote your property</strong>
                <p style={mutedText}>
                  Super Host and Elite Host members may be eligible for
                  newsletter and social media promotion.
                </p>
                <p style={mutedText}>
                  Contact your administrator to confirm upgrade options
                  and the applicable plan benefits.
                </p>
              </div>
            )}

            <div style={actionRowStyle}>
              <button
                style={buttonStyle}
                onClick={() => navigate("/account")}
              >
                Manage account
              </button>

              <button
                style={secondaryButton}
                onClick={() => navigate("/host-compliance")}
              >
                Manage documents
              </button>
            </div>
          </section>

          <footer style={footerStyle}>
            <p>Static Holidays © {new Date().getFullYear()}</p>
            <p style={mutedText}>Your holiday rental business, in one place.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

// REUSABLE COMPONENTS

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: string;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div style={statCardStyle}>
      <div style={statIconStyle}>{icon}</div>
      <p style={statLabelStyle}>{label}</p>
      <div style={statValueStyle}>{value}</div>
      <p style={mutedText}>{detail}</p>
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div style={emptyStateStyle}>
      <p style={mutedText}>{message}</p>
    </div>
  );
}

// STYLES

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  color: "#172033",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const layoutStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 24,
  maxWidth: 1600,
  margin: "0 auto",
  padding: 20,
};

const sidebarStyle: CSSProperties = {
  width: 235,
  flexShrink: 0,
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  position: "sticky",
  top: 20,
  alignSelf: "flex-start",
};

const brandStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 900,
  letterSpacing: 1,
  color: "#166534",
};

const navButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  textAlign: "left",
  padding: "12px 10px",
  marginBottom: 4,
  border: "none",
  borderRadius: 9,
  background: "transparent",
  color: "#475569",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const activeNavStyle: CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
};

const sidebarFooterStyle: CSSProperties = {
  borderTop: "1px solid #e5e7eb",
  paddingTop: 18,
  marginTop: 20,
};

const mainStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const headerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 24,
  padding: "16px 4px",
};

const eyebrowStyle: CSSProperties = {
  color: "#15803d",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 1.4,
  marginBottom: 8,
};

const headingStyle: CSSProperties = {
  fontSize: "clamp(25px, 3vw, 34px)",
  lineHeight: 1.2,
  letterSpacing: -0.8,
  margin: "0 0 8px",
};

const subheadingStyle: CSSProperties = {
  fontSize: 21,
  margin: 0,
  letterSpacing: -0.4,
};

const sectionHeadingStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  marginBottom: 20,
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
  gap: 14,
  marginTop: 20,
};

const statCardStyle: CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e8edf2",
  borderRadius: 12,
  padding: 17,
  minWidth: 0,
};

const statIconStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "#dcfce7",
  color: "#166534",
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 14,
};

const statLabelStyle: CSSProperties = {
  color: "#64748b",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 8,
};

const statValueStyle: CSSProperties = {
  fontSize: 25,
  fontWeight: 800,
  letterSpacing: -0.6,
  overflowWrap: "anywhere",
};

const planBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#f1f5f9",
  color: "#334155",
  padding: "7px 11px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 700,
};

const statusBadgeStyle: CSSProperties = {
  display: "inline-block",
  borderRadius: 20,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
};

const approvedBadgeStyle: CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
};

const pendingBadgeStyle: CSSProperties = {
  background: "#fef3c7",
  color: "#92400e",
};

const neutralBadgeStyle: CSSProperties = {
  background: "#e2e8f0",
  color: "#334155",
};

const progressTrackStyle: CSSProperties = {
  width: "100%",
  height: 9,
  borderRadius: 20,
  background: "#e2e8f0",
  overflow: "hidden",
  marginTop: 20,
};

const progressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: 20,
  background: "#16a34a",
  transition: "width 0.3s ease",
};

const checkRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: 10,
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
};

const warningTextStyle: CSSProperties = {
  background: "#fffbeb",
  color: "#92400e",
  padding: 14,
  borderRadius: 9,
  fontSize: 13,
  lineHeight: 1.6,
  marginTop: 18,
};

const infoBoxStyle: CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: 16,
  borderRadius: 10,
  marginTop: 14,
  marginBottom: 14,
  overflowWrap: "anywhere",
};

const emptyStateStyle: CSSProperties = {
  textAlign: "center",
  padding: "30px 16px",
  border: "1px dashed #cbd5e1",
  borderRadius: 12,
  background: "#fafcff",
};

const emptyIconStyle: CSSProperties = {
  fontSize: 35,
  color: "#64748b",
  marginBottom: 10,
};

const propertyGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: 14,
};

const propertyCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 14,
  padding: 15,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  minWidth: 0,
  overflowWrap: "anywhere",
};

const propertyIconStyle: CSSProperties = {
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: 10,
  background: "#dcfce7",
  color: "#166534",
  fontSize: 26,
};

const propertyContentStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const propertyTitleStyle: CSSProperties = {
  fontSize: 16,
  margin: 0,
  overflowWrap: "anywhere",
};

const priceStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  margin: "14px 0",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 14,
};

const dangerButtonStyle: CSSProperties = {
  ...secondaryButton,
  color: "#b91c1c",
  background: "#fef2f2",
  borderColor: "#fecaca",
};

const tableWrapperStyle: CSSProperties = {
  overflowX: "auto",
  width: "100%",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  fontSize: 14,
};

const tableCellStyle: CSSProperties = {
  padding: "13px 12px",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const listItemStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  padding: 14,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  marginBottom: 10,
};

const reviewCardStyle: CSSProperties = {
  padding: 16,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  marginBottom: 12,
};

const preferenceLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "14px 0",
  lineHeight: 1.6,
  fontSize: 14,
};

const errorStyle: CSSProperties = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#991b1b",
  borderRadius: 10,
  padding: 16,
  marginBottom: 20,
  overflowWrap: "anywhere",
};

const successStyle: CSSProperties = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#166534",
  borderRadius: 10,
  padding: 14,
  marginBottom: 20,
};

const footerStyle: CSSProperties = {
  textAlign: "center",
  padding: "20px 10px",
  color: "#475569",
  fontSize: 13,
};
