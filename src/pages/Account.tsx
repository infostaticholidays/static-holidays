
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const green = "#176b50";
const darkGreen = "#124936";
const sage = "#f3f7f2";
const muted = "#68766e";
const border = "#e5ebe5";

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: `1px solid ${border}`,
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 5px 20px rgba(24, 65, 43, 0.04)",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "11px 18px",
  background: green,
  color: "#ffffff",
  border: "none",
  borderRadius: 10,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [previousTrips, setPreviousTrips] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterSaving, setNewsletterSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
const [idSubmission, setIdSubmission] = useState<any>(null);
const [idFile, setIdFile] = useState<File | null>(null);
const [idUploading, setIdUploading] = useState(false);


const [profileForm, setProfileForm] = useState({
  full_name: "",
  phone: "",
  address: "",
});

  const navigate = useNavigate();
  useEffect(() => {
    loadAccount().catch((error) => {
      console.error("Failed to load account:", error);
      setLoading(false);
    });
  }, []);
  async function loadAccount() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      setUser(user);
      console.log("Signed-in guest ID:", user.id);

    
const { data: profileData, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

if (error) {
  console.error("Could not load profile:", error);
  alert("We couldn't load your account profile. Please check the browser console.");
  return;
}


      setProfile(profileData);
      
const { data: verificationData, error: verificationError } =
  await supabase
    .from("identity_verifications")
    .select("id, document_path, status, submitted_at")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

if (verificationError) {
  console.error("Could not load ID submission:", verificationError);
} else {
  setIdSubmission(verificationData);
}

      setProfileForm({
  full_name: profileData.full_name || "",
  phone: profileData.phone || "",
  address: profileData.address || "",
});

      const { data: favData, error: favError } = await supabase
        .from("favourites")
        .select(`
          id,
          properties (
            id,
            title,
            location,
            images,
            price_per_night
          )
        `)
        .eq("user_id", user.id);

      if (favError) {
        console.error("Could not load favourites:", favError);
      }

      setFavourites(favData || []);

      
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          id,
          guest_id,
          property_id,
          check_in,
          check_out,
          booking_status,
          properties (
            title,
            location
          )
        `)
        .eq("guest_id", user.id)
        .eq("booking_status", "confirmed")
        .order("check_in", { ascending: true });

      if (bookingsError) {
        console.error("Could not load bookings:", bookingsError);
      }

      if (!bookingsError) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
console.log("Bookings returned from Supabase:", bookingsData);
        const confirmedTrips = (bookingsData || []).map((booking: any) => {
          const property = Array.isArray(booking.properties)
            ? booking.properties[0]
            : booking.properties;

          return {
            ...booking,
            destination:
              property?.title ||
              property?.location ||
              "Your upcoming holiday",
            start_date: booking.check_in,
            end_date: booking.check_out,
          };
        });

        const previous = confirmedTrips.filter(
          (t: any) => t.end_date && new Date(t.end_date) < today
        );

        const upcoming = confirmedTrips
          .filter((t: any) => t.end_date && new Date(t.end_date) >= today)
          .sort(
            (a: any, b: any) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
          );

       const todayForCountdown = new Date();
todayForCountdown.setHours(0, 0, 0, 0);

const tripsWithMessages = upcoming.map((holiday: any) => {
  const parseDate = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const checkIn = parseDate(holiday.start_date);
  const checkOut = parseDate(holiday.end_date);

  const daysToCheckIn = Math.round(
    (checkIn.getTime() - todayForCountdown.getTime()) / 86400000
  );

  const daysToCheckOut = Math.round(
    (checkOut.getTime() - todayForCountdown.getTime()) / 86400000
  );

  let holidayMessage = "";

  if (daysToCheckOut <= 0) {
    holidayMessage =
      "🏡 Your holiday ends today — we hope you had a wonderful stay!";
  } else if (daysToCheckIn > 0) {
    const months = Math.floor(daysToCheckIn / 30);
    const weeks = Math.floor((daysToCheckIn % 30) / 7);
    const days = daysToCheckIn % 7;

    const parts: string[] = [];

    if (months > 0) {
      parts.push(`${months} ${months === 1 ? "month" : "months"}`);
    }
    if (weeks > 0) {
      parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
    }
    if (days > 0 || parts.length === 0) {
      parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    }

    holidayMessage = `🏡 Your holiday starts in ${parts.join(", ")}!`;
  } else if (daysToCheckIn === 0) {
    holidayMessage = "🌿 Your holiday has started! Enjoy every moment.";
  } else if (daysToCheckOut === 1) {
    holidayMessage = "💚 Enjoy your last day — checkout is tomorrow!";
  } else {
    holidayMessage =
      `🏖️ Holiday mode is on! ${daysToCheckOut} days left until checkout.`;
  }

  return { ...holiday, holidayMessage };
});

setPreviousTrips(previous);
setUpcomingTrips(tripsWithMessages);
setTrip(tripsWithMessages[0] || null);
        console.log("Upcoming trips after filtering:", upcoming);
      }


      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (reviewError) {
        console.error("Could not load reviews:", reviewError);
      }

      setReviews(reviewData || []);
     } finally {
      console.log("ACCOUNT: loading finished");
      setLoading(false);
    }
  }

 
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      setUpcomingTrips((trips) =>
        trips.map((holiday) => {
          const parseDate = (value: string) => {
            const [year, month, day] = value.split("-").map(Number);
            return new Date(year, month - 1, day);
          };

          const checkIn = parseDate(holiday.start_date);
          const checkOut = parseDate(holiday.end_date);

          const daysToCheckIn = Math.round(
            (checkIn.getTime() - today.getTime()) / 86400000
          );

          const daysToCheckOut = Math.round(
            (checkOut.getTime() - today.getTime()) / 86400000
          );

          let holidayMessage: string;

          if (daysToCheckOut <= 0) {
            holidayMessage =
              "🏡 Your holiday ends today — we hope you had a wonderful stay!";
          } else if (daysToCheckIn > 0) {
            const months = Math.floor(daysToCheckIn / 30);
            const weeks = Math.floor((daysToCheckIn % 30) / 7);
            const days = daysToCheckIn % 7;

            const parts: string[] = [];

            if (months > 0) {
              parts.push(`${months} ${months === 1 ? "month" : "months"}`);
            }
            if (weeks > 0) {
              parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
            }
            if (days > 0 || parts.length === 0) {
              parts.push(`${days} ${days === 1 ? "day" : "days"}`);
            }

            holidayMessage = `🏡 Your holiday starts in ${parts.join(", ")}!`;
          } else if (daysToCheckIn === 0) {
            holidayMessage = "🌿 Your holiday has started! Enjoy every moment.";
          } else if (daysToCheckOut === 1) {
            holidayMessage = "💚 Enjoy your last day — checkout is tomorrow!";
          } else {
            holidayMessage =
              `🏖️ Holiday mode is on! ${daysToCheckOut} days left until checkout.`;
          }

          return { ...holiday, holidayMessage };
        })
      );
    };

    updateCountdowns();
    const timer = window.setInterval(updateCountdowns, 60000);

    return () => window.clearInterval(timer);
  }, [upcomingTrips.length]);


  

  async function toggleNewsletter(value: boolean) {
    if (!user || newsletterSaving) return;

    const oldValue = profile?.newsletter || false;
    setProfile((prev: any) => ({ ...prev, newsletter: value }));
    setNewsletterSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ newsletter: value })
      .eq("id", user.id);

    if (error) {
      console.error("Could not update newsletter preference:", error);
      setProfile((prev: any) => ({ ...prev, newsletter: oldValue }));
      alert("Sorry, we couldn't update your newsletter preference. Please try again.");
    }

    setNewsletterSaving(false);
  }
  
async function saveProfile() {
  if (!user || profileSaving) return;

  const fullName = profileForm.full_name.trim();
  const nameParts = fullName.split(/\s+/).filter(Boolean);

  setProfileSaving(true);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName || null,
        first_name: nameParts[0] || null,
        last_name: nameParts.slice(1).join(" ") || null,
        phone: profileForm.phone.trim() || null,
        address: profileForm.address.trim() || null,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    setProfile(data);

    setProfileForm({
      full_name: data.full_name || "",
      phone: data.phone || "",
      address: data.address || "",
    });

    alert("Your account details have been saved.");
  } catch (error) {
    console.error("Could not save account details:", error);
    alert("Sorry, we couldn't save your details. Please try again.");
  } finally {
    setProfileSaving(false);
  }
}


async function submitIdentityDocument() {
  if (!user || !idFile || idUploading) return;

  if (!["image/jpeg", "image/png", "application/pdf"].includes(idFile.type)) {
    alert("Please choose a JPG, PNG, or PDF document.");
    return;
  }

  if (idFile.size > 10 * 1024 * 1024) {
    alert("Your document must be smaller than 10 MB.");
    return;
  }

  if (
    idSubmission?.status === "pending" ||
    idSubmission?.status === "approved"
  ) {
    alert(
      "You already have a pending or approved ID submission."
    );
    return;
  }

  setIdUploading(true);

  let uploadedPath: string | null = null;

  try {
    const safeName = idFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("identity-documents")
      .upload(filePath, idFile, {
        upsert: false,
        contentType: idFile.type,
      });

    if (uploadError) throw uploadError;

    uploadedPath = filePath;

    const { data, error: insertError } = await supabase
      .from("identity_verifications")
      .insert({
        user_id: user.id,
        document_path: filePath,
        status: "pending",
      })
      .select("id, document_path, status, submitted_at")
      .single();

    if (insertError) throw insertError;

    setIdSubmission(data);
    setIdFile(null);

    alert("Your ID has been submitted for review.");
  } catch (error) {
    console.error("ID submission failed:", error);

    if (uploadedPath) {
      const { error: cleanupError } = await supabase.storage
        .from("identity-documents")
        .remove([uploadedPath]);

      if (cleanupError) {
        console.error("Could not clean up uploaded ID:", cleanupError);
      }
    }

    alert(
      "We couldn't submit your ID. Please try again. If the problem continues, check the browser console."
    );
  } finally {
    setIdUploading(false);
  }
}

  async function removeFavourite(id: string) {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Could not remove favourite:", error);
      alert("Sorry, we couldn't remove this favourite. Please try again.");
      return;
    }

    setFavourites((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Sorry, we couldn't log you out. Please try again.");
      return;
    }

    window.location.href = "/";
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          background: sage,
          color: green,
          fontSize: 17,
        }}
      >
        Loading your holiday dashboard...
      </div>
    );
  }


const firstName =
  profile?.first_name?.trim() ||
  profile?.full_name?.trim()?.split(/\s+/)[0] ||
  user?.user_metadata?.first_name?.trim() ||
  user?.user_metadata?.full_name?.trim()?.split(/\s+/)[0] ||
  user?.user_metadata?.name?.trim()?.split(/\s+/)[0] ||
  "holidaymaker";



  return (
    <div
      style={{
        minHeight: "100vh",
        background: sage,
        color: "#24372c",
        fontFamily: "inherit",
        padding: "28px 18px 60px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* WELCOME BANNER */}
        <section
          style={{
            background: `linear-gradient(125deg, ${darkGreen}, ${green})`,
            borderRadius: 24,
            padding: "36px 30px",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            marginBottom: 26,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -25,
              top: -65,
              width: 230,
              height: 230,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />

          <div style={{ position: "relative" }}>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#d0e6d6",
                fontWeight: 700,
              }}
            >
              YOUR STATIC HOLIDAYS
            </p>

            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                lineHeight: 1.15,
                margin: "0 0 12px",
                fontWeight: 750,
              }}
            >
              Welcome back, {firstName}!
            </h1>


<p
  style={{
    margin: "0 0 8px",
    fontSize: 17,
    lineHeight: 1.6,
  }}
>
  Let's find your somewhere special.
</p>

<p
  style={{
    margin: "0 0 24px",
    maxWidth: 540,
    lineHeight: 1.7,
    color: "#e0eee4",
    fontSize: 15,
  }}
>
  Your next getaway starts here.
</p>

            
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/properties"
                style={{
                  ...buttonStyle,
                  background: "#ffffff",
                  color: darkGreen,
                }}
              >
                Explore properties →
              </Link>

              <a
                href="#account-details"
                style={{
                  ...buttonStyle,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                My details
              </a>
            </div>
          </div>
        </section>

        {/* DASHBOARD STATISTICS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            {
              icon: "♡",
              label: "Saved stays",
              value: favourites.length,
            },
            {
              icon: "🏡",
              label: "Upcoming trip",
              value: trip ? "Planned" : "Not yet",
            },
            {
              icon: "★",
              label: "Reviews",
              value: reviews.length,
            },
            {
              icon: "✓",
              label: "Past trips",
              value: previousTrips.length,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                ...cardStyle,
                padding: "20px 18px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#e8f2e9",
                  color: green,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 23,
                  marginBottom: 14,
                }}
              >
                {item.icon}
              </div>

              <p
                style={{
                  margin: "0 0 5px",
                  fontSize: 13,
                  color: muted,
                }}
              >
                {item.label}
              </p>

              <strong style={{ fontSize: 22, color: darkGreen }}>
                {item.value}
              </strong>
            </div>
          ))}
        </div>

        {/* NEXT TRIP */}
        <section style={{ ...cardStyle, marginBottom: 26 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 12,
                  color: green,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                YOUR NEXT ADVENTURE
              </p>
              <h2 style={{ margin: 0, fontSize: 23 }}>
                {upcomingTrips.length > 1 ? "My upcoming trips" : "My next trip"}
              </h2>
            </div>
            <span style={{ fontSize: 30 }}>🏖️</span>
          </div>

          {upcomingTrips.length === 0 ? (
            <div
              style={{
                background: sage,
                borderRadius: 15,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 38, marginBottom: 10 }}>🌿</div>
              <h3 style={{ margin: "0 0 8px" }}>
                Your next escape awaits
              </h3>
              <p style={{ color: muted, lineHeight: 1.6 }}>
                You don't have an upcoming trip listed yet. Find somewhere
                special for your next break.
              </p>
              <Link to="/properties" style={buttonStyle}>
                Find your getaway
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {upcomingTrips.map((holiday: any, index: number) => (
                <div
                  key={holiday.id}
                  style={{
                    background: sage,
                    borderRadius: 16,
                    padding: 24,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 23, margin: "0 0 12px" }}>
                      {holiday.destination || "Your upcoming holiday"}
                    </h3>

                    <p style={{ margin: "0 0 8px", color: muted }}>
                      <strong>Check-in:</strong>{" "}
                      {holiday.start_date
                        ? new Date(holiday.start_date).toLocaleDateString("en-GB")
                        : "Not set"}
                    </p>

                    <p style={{ margin: "0 0 8px", color: muted }}>
                      <strong>Check-out:</strong>{" "}
                      {holiday.end_date
                        ? new Date(holiday.end_date).toLocaleDateString("en-GB")
                        : "Not set"}
                    </p>

                   <p
  style={{
    margin: "16px 0 0",
    color: green,
    fontWeight: 700,
    lineHeight: 1.6,
  }}
>
  {holiday.holidayMessage}
</p>
                  </div>
                  <div style={{ fontSize: 56 }}>🏡</div>
                </div>
              ))}
            </div>
          )}
        </section>

     
        {/* FAVOURITE PROPERTIES */}
        <section style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 5px",
                  color: green,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 1.5,
                }}
              >
                SAVED FOR LATER
              </p>
              <h2 style={{ margin: 0, fontSize: 25 }}>
                Your favourite stays
              </h2>
            </div>

            <Link
              to="/properties"
              style={{
                color: green,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Browse stays →
            </Link>
          </div>

          {favourites.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: "center", padding: 32 }}>
              <div style={{ fontSize: 38 }}>♡</div>
              <h3>No favourites saved yet</h3>
              <p style={{ color: muted, lineHeight: 1.6 }}>
                When you find a property you love, save it here for easy access.
              </p>
              <Link to="/properties" style={buttonStyle}>
                Discover properties
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
                gap: 20,
              }}
            >
              {favourites.map((fav) => {
                const p = Array.isArray(fav.properties)
                  ? fav.properties[0]
                  : fav.properties;

                const image = Array.isArray(p?.images)
                  ? p.images[0]
                  : p?.images;

                return (
                  <article
                    key={fav.id}
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${border}`,
                      borderRadius: 18,
                      overflow: "hidden",
                      boxShadow: "0 5px 20px rgba(24,65,43,0.05)",
                    }}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={p?.title || "Favourite holiday property"}
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 200,
                          background: "#e8f0e7",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 48,
                        }}
                      >
                        🏡
                      </div>
                    )}

                    <div style={{ padding: 18 }}>
                      <h3
                        style={{
                          margin: "0 0 8px",
                          fontSize: 19,
                          color: darkGreen,
                        }}
                      >
                        {p?.title || "Holiday property"}
                      </h3>

                      <p
                        style={{
                          margin: "0 0 12px",
                          color: muted,
                          fontSize: 14,
                        }}
                      >
                        📍 {p?.location || "Location not listed"}
                      </p>

                      {p?.price_per_night != null && (
                        <p
                          style={{
                            margin: "0 0 16px",
                            color: green,
                            fontWeight: 700,
                          }}
                        >
                          £{Number(p.price_per_night).toFixed(2)}{" "}
                          <span
                            style={{
                              color: muted,
                              fontWeight: 400,
                            }}
                          >
                            / night
                          </span>
                        </p>
                      )}

                      <div style={{ display: "flex", gap: 10 }}>
                        {p?.id ? (
                          <Link
                            to={`/property/${p.id}`}
                            style={{ ...buttonStyle, flex: 1, textAlign: "center" }}
                          >
                            View stay
                          </Link>
                        ) : (
                          <span style={{ color: muted, fontSize: 13 }}>
                            Property unavailable
                          </span>
                        )}

                        <button
                          onClick={() => removeFavourite(fav.id)}
                          style={{
                            background: "#ffffff",
                            border: `1px solid ${border}`,
                            borderRadius: 10,
                            padding: "10px 12px",
                            color: "#8a4545",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        
{/* IDENTITY VERIFICATION */}
<section style={{ ...cardStyle, marginBottom: 28 }}>
  <div style={{ fontSize: 28, marginBottom: 12 }}>🪪</div>

  <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>
    Identity verification
  </h2>

<p style={{ color: muted, lineHeight: 1.7, fontSize: 14 }}>
  Submit a valid passport or driving licence for identity verification.
  Your document will be reviewed before you can book a property.
</p>

<p style={{ color: muted, lineHeight: 1.7, fontSize: 14 }}>
  Accepted documents: passport or driving licence. Accepted file
  formats: JPG, PNG or PDF. Maximum file size: 10 MB. Please ensure
  your document is clear and all details are readable.
</p>
  {idSubmission?.status === "pending" ? (
    <div
      style={{
        background: "#fff6df",
        borderRadius: 12,
        padding: 16,
        color: "#795a16",
      }}
    >
      <strong>⏳ ID awaiting review</strong>
      <p style={{ marginBottom: 0, fontSize: 14 }}>
        Your document has been submitted and is waiting for review.
      </p>
    </div>
  ) : idSubmission?.status === "approved" ? (
    <div
      style={{
        background: "#e8f2e9",
        borderRadius: 12,
        padding: 16,
        color: darkGreen,
      }}
    >
      <strong>✓ ID submission approved</strong>
      <p style={{ marginBottom: 0, fontSize: 14 }}>
        Your submitted document has been approved.
      </p>
    </div>
  ) : (
    <>
      {idSubmission?.status === "rejected" && (
        <p style={{ color: "#934444", fontSize: 14 }}>
          Your previous submission was rejected. You can submit a
          new document below.
        </p>
      )}

      <label
        htmlFor="identity-document"
        style={{ display: "block", fontWeight: 600, margin: "18px 0 8px" }}
      >
        Choose your ID document
      </label>

      <input
        id="identity-document"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        disabled={idUploading}
        onChange={(e) => setIdFile(e.target.files?.[0] || null)}
        style={{ display: "block", marginBottom: 16, maxWidth: "100%" }}
      />

      <p style={{ color: muted, fontSize: 12, lineHeight: 1.6 }}>
        Accepted formats: JPG, PNG, or PDF. Maximum file size: 10 MB.
        Your document is stored in private storage.
      </p>

      <button
        type="button"
        onClick={submitIdentityDocument}
        disabled={!idFile || idUploading}
        style={{
          ...buttonStyle,
          opacity: !idFile || idUploading ? 0.6 : 1,
        }}
      >
        {idUploading ? "Submitting..." : "Submit ID for review"}
      </button>
    </>
  )}
</section>


        {/* ACCOUNT DETAILS AND NEWSLETTER */}
        <section
          id="account-details"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
            marginBottom: 28,
            scrollMarginTop: 20,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>👤</div>
            <h2 style={{ margin: "0 0 20px", fontSize: 22 }}>
              Account details
            </h2>

           

{!isEditingProfile ? (
  <div style={{ display: "grid", gap: 16 }}>
    {[
      ["Full name", profile?.full_name],
      ["Email address", user?.email],
      ["Phone", profile?.phone],
      ["Address", profile?.address],
    ].map(([label, value]) => (
      <div
        key={label}
        style={{
          paddingBottom: 12,
          borderBottom: `1px solid ${border}`,
        }}
      >
        <p style={{ color: muted, fontSize: 12, margin: "0 0 5px" }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
          {value || "Not set"}
        </p>
      </div>
    ))}

    <button
      type="button"
      onClick={() => setIsEditingProfile(true)}
      style={buttonStyle}
    >
      Edit
    </button>
  </div>
) : (
  <div style={{ display: "grid", gap: 16 }}>
    <div>
      <label htmlFor="profile-full-name">Full name</label>
      <input
        id="profile-full-name"
        value={profileForm.full_name}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            full_name: e.target.value,
          }))
        }
        placeholder="Enter your full name"
        style={{
          boxSizing: "border-box",
          width: "100%",
          padding: 12,
          marginTop: 6,
          border: `1px solid ${border}`,
          borderRadius: 10,
        }}
      />
    </div>

    <div>
      <label htmlFor="profile-email">Email address</label>
      <input
        id="profile-email"
        type="email"
        value={user?.email || ""}
        readOnly
        style={{
          boxSizing: "border-box",
          width: "100%",
          padding: 12,
          marginTop: 6,
          background: sage,
          border: `1px solid ${border}`,
          borderRadius: 10,
        }}
      />
    </div>

    <div>
      <label htmlFor="profile-phone">Phone</label>
      <input
        id="profile-phone"
        type="tel"
        value={profileForm.phone}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            phone: e.target.value,
          }))
        }
        placeholder="Enter your phone number"
        style={{
          boxSizing: "border-box",
          width: "100%",
          padding: 12,
          marginTop: 6,
          border: `1px solid ${border}`,
          borderRadius: 10,
        }}
      />
    </div>

    <div>
      <label htmlFor="profile-address">Address</label>
      <textarea
        id="profile-address"
        value={profileForm.address}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            address: e.target.value,
          }))
        }
        placeholder="Enter your address"
        rows={3}
        style={{
          boxSizing: "border-box",
          width: "100%",
          padding: 12,
          marginTop: 6,
          border: `1px solid ${border}`,
          borderRadius: 10,
        }}
      />
    </div>

    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={saveProfile}
        disabled={profileSaving}
        style={{
          ...buttonStyle,
          opacity: profileSaving ? 0.7 : 1,
        }}
      >
        {profileSaving ? "Saving..." : "Save changes"}
      </button>

      <button
        type="button"
        onClick={() => {
          setProfileForm({
            full_name: profile?.full_name || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
          });
          setIsEditingProfile(false);
        }}
        style={{
          ...buttonStyle,
          background: "#ffffff",
          color: darkGreen,
          border: `1px solid ${border}`,
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

       
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✉️</div>
            <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>
              Stay in the loop
            </h2>

            <p style={{ color: muted, lineHeight: 1.7, fontSize: 14 }}>
              Get updates and holiday inspiration from Static Holidays.
              You can change your preference whenever you like.
            </p>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: sage,
                padding: 16,
                borderRadius: 12,
                marginTop: 20,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={profile?.newsletter || false}
                disabled={newsletterSaving}
                onChange={(e) => toggleNewsletter(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  accentColor: green,
                  marginTop: 2,
                }}
              />

              <span>
                <strong style={{ display: "block", marginBottom: 5 }}>
                  Subscribe to our newsletter
                </strong>
                <span style={{ color: muted, fontSize: 13 }}>
                  {newsletterSaving
                    ? "Saving your preference..."
                    : "I would like to receive holiday news and offers."}
                </span>
              </span>
            </label>

            <p style={{ color: muted, fontSize: 12, lineHeight: 1.6 }}>
              Only subscribe if you want to receive these updates.
            </p>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ ...cardStyle, marginBottom: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                margin: "0 0 5px",
                color: green,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
              }}
            >
              YOUR FEEDBACK
            </p>
            <h2 style={{ margin: 0, fontSize: 24 }}>My reviews</h2>
          </div>

          {reviews.length === 0 ? (
            <div
              style={{
                background: sage,
                padding: 22,
                borderRadius: 12,
                color: muted,
              }}
            >
              <span style={{ fontSize: 26 }}>⭐</span>
              <p style={{ marginBottom: 0 }}>
                Your reviews will appear here when available.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {reviews.map((r) => (
                <article
                  key={r.id}
                  style={{
                    background: sage,
                    borderRadius: 12,
                    padding: 18,
                  }}
                >
                  <p
                    style={{
                      color: "#b78327",
                      margin: "0 0 8px",
                      letterSpacing: 2,
                    }}
                  >
                    {"★".repeat(
                      Math.max(0, Math.min(5, Number(r.rating) || 0))
                    )}
                    {"☆".repeat(
                      5 - Math.max(0, Math.min(5, Number(r.rating) || 0))
                    )}
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.7 }}>
                    {r.review_text}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ACCOUNT FOOTER */}
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            padding: "22px 4px",
            borderTop: `1px solid ${border}`,
          }}
        >
          <div>
            <strong style={{ color: darkGreen }}>Static Holidays</strong>
            <p
              style={{
                color: muted,
                fontSize: 13,
                margin: "5px 0 0",
              }}
            >
              Your next escape is closer than you think.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: "#ffffff",
              border: "1px solid #e2d5d5",
              color: "#934444",
              borderRadius: 10,
              padding: "11px 18px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Log out
          </button>
        </footer>
      </div>
    </div>
  );
}
