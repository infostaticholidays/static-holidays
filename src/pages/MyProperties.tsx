
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  title: string | null;
  location: string | null;
  price_per_night?: number | null;
  nightly_price?: number | null;
  images?: string | null;
  cover_image_url?: string | null;
  is_published?: boolean;
  status?: string;
};

export default function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMyProperties() {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Please log in to view your properties.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id);

      if (error) {
        console.error(error);
        setMessage("We couldn't load your properties. Please try again.");
      } else {
        setProperties((data || []) as Property[]);
      }

      setLoading(false);
    }

    fetchMyProperties();
  }, []);

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e4ebe5",
    borderRadius: "20px",
    overflow: "hidden" as const,
    boxShadow: "0 8px 28px rgba(21,62,42,0.06)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f6f8f5",
      color: "#173d2a",
      fontFamily: "Arial, sans-serif",
    }}>
      <header style={{
        background: "#ffffff",
        borderBottom: "1px solid #e3ebe4",
        padding: "18px 24px",
      }}>
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          <Link to="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#153e2a",
            textDecoration: "none",
            fontSize: "21px",
            fontWeight: 800,
          }}>
            <span style={{
              display: "grid",
              placeItems: "center",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "#17643b",
              color: "#fff",
              fontSize: "25px",
            }}>⌂</span>
            Static Holidays
          </Link>

          <Link to="/host-dashboard" style={{
            textDecoration: "none",
            color: "#17643b",
            fontWeight: 700,
            padding: "11px 16px",
            border: "1px solid #dce7de",
            borderRadius: "10px",
          }}>
            ← Dashboard
          </Link>
        </div>
      </header>

      <main style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "42px 24px 70px",
      }}>
        <section style={{
          padding: "34px",
          borderRadius: "24px",
          background: "linear-gradient(125deg, #e7f2e8, #ffffff 75%)",
          border: "1px solid #e0eae1",
          marginBottom: "28px",
        }}>
          <p style={{
            color: "#287447",
            fontWeight: 800,
            fontSize: "12px",
            letterSpacing: "2px",
            margin: "0 0 12px",
          }}>
            YOUR HOST SPACE
          </p>

          <h1 style={{
            fontSize: "clamp(30px, 4vw, 42px)",
            letterSpacing: "-1px",
            margin: "0 0 12px",
            color: "#153e2a",
          }}>
            My Properties
          </h1>

          <p style={{
            color: "#607166",
            lineHeight: 1.7,
            fontSize: "16px",
            maxWidth: "620px",
            margin: 0,
          }}>
            Welcome to your property space. View your listings,
            check their status and keep your holiday homes organised.
          </p>
        </section>

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "38px",
        }}>
          <div style={{
            ...cardStyle,
            padding: "24px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}>
              <div style={{
                background: "#e7f2e8",
                borderRadius: "13px",
                padding: "13px",
                fontSize: "24px",
              }}>⌂</div>
              <div>
                <p style={{ margin: "0 0 7px", color: "#607166" }}>
                  Your properties
                </p>
                <strong style={{ fontSize: "29px" }}>
                  {loading ? "—" : properties.length}
                </strong>
              </div>
            </div>
          </div>

          <div style={{
            ...cardStyle,
            padding: "24px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}>
              <div style={{
                background: "#e7f2e8",
                borderRadius: "13px",
                padding: "13px",
                fontSize: "24px",
              }}>£</div>
              <div>
                <p style={{ margin: "0 0 7px", color: "#607166" }}>
                  Listings with a nightly rate
                </p>
                <strong style={{ fontSize: "29px" }}>
                  {loading ? "—" : properties.filter(
                    p => (p.price_per_night ?? p.nightly_price) != null
                  ).length}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}>
            <div>
              <h2 style={{
                fontSize: "26px",
                margin: "0 0 8px",
                color: "#153e2a",
              }}>
                Your listings
              </h2>
              <p style={{ color: "#718078", margin: 0 }}>
                Properties linked to your account.
              </p>
            </div>

            <span style={{
              padding: "9px 14px",
              background: "#e7f2e8",
              color: "#17643b",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: 700,
            }}>
              {loading ? "Loading..." :
                `${properties.length} ${properties.length === 1 ? "property" : "properties"}`}
            </span>
          </div>

          {loading ? (
            <div style={{ ...cardStyle, padding: "40px", color: "#607166" }}>
              Loading your properties...
            </div>
          ) : message ? (
            <div style={{ ...cardStyle, padding: "30px", color: "#9b2c2c" }}>
              {message}
            </div>
          ) : properties.length === 0 ? (
            <div style={{
              ...cardStyle,
              padding: "50px 24px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "42px" }}>⌂</div>
              <h3>No properties yet</h3>
              <p style={{ color: "#718078" }}>
                Your properties will appear here when you add them.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "24px",
            }}>
              {properties.map((property) => {
                const image =
                  property.cover_image_url ||
                  property.images?.split(",")[0]?.trim();

                const price =
                  property.price_per_night ?? property.nightly_price;

                const published =
                  property.is_published === true ||
                  property.status?.toLowerCase() === "published";

                return (
                  <article key={property.id} style={cardStyle}>
                    <div style={{
                      position: "relative",
                      background: "#e7eee8",
                    }}>
                      {image ? (
                        <img
                          src={image}
                          alt={property.title || "Holiday property"}
                          style={{
                            width: "100%",
                            height: "260px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div style={{
                          height: "260px",
                          display: "grid",
                          placeItems: "center",
                          color: "#607166",
                        }}>
                          Property photo coming soon
                        </div>
                      )}

                      <span style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        padding: "9px 13px",
                        borderRadius: "30px",
                        background: published ? "#e3f6e8" : "#fff2d6",
                        color: published ? "#17643b" : "#8a5a00",
                        fontWeight: 800,
                        fontSize: "12px",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                      }}>
                        {published ? "● Published" : "● Draft"}
                      </span>
                    </div>

                    <div style={{ padding: "24px" }}>
                      <p style={{
                        color: "#287447",
                        fontSize: "12px",
                        letterSpacing: "1.3px",
                        fontWeight: 800,
                        margin: "0 0 10px",
                      }}>
                        YOUR HOLIDAY HOME
                      </p>

                      <h3 style={{
                        fontSize: "24px",
                        margin: "0 0 10px",
                        color: "#153e2a",
                      }}>
                        {property.title || "Untitled property"}
                      </h3>

                      <p style={{
                        color: "#718078",
                        margin: "0 0 22px",
                      }}>
                        <span aria-hidden="true">⌖ </span>
                        {property.location || "Location not set"}
                      </p>

                      <div style={{
                        borderTop: "1px solid #e7ece7",
                        paddingTop: "18px",
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}>
                        <div>
                          <p style={{
                            margin: "0 0 5px",
                            color: "#718078",
                            fontSize: "13px",
                          }}>
                            Nightly rate
                          </p>
                          <strong style={{
                            color: "#17643b",
                            fontSize: "27px",
                          }}>
                            {price != null ? `£${price}` : "On request"}
                          </strong>
                          {price != null && (
                            <span style={{
                              color: "#718078",
                              fontSize: "13px",
                            }}> / night</span>
                          )}
                        </div>

                        <Link to={`/property/${property.id}`} style={{
                          display: "inline-block",
                          padding: "13px 18px",
                          background: "#17643b",
                          color: "#ffffff",
                          borderRadius: "10px",
                          textDecoration: "none",
                          fontWeight: 700,
                        }}>
                          View property →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer style={{
          marginTop: "42px",
          padding: "20px 0 0",
          borderTop: "1px solid #e1e9e2",
          color: "#718078",
          fontSize: "13px",
          textAlign: "center",
        }}>
          Static Holidays · Your property, your space.
        </footer>
      </main>
    </div>
  );
}
