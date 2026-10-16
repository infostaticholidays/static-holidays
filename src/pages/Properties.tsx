
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Properties() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState("Any");
  const navigate = useNavigate();

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("*");

      if (error) {
        console.error("Could not load properties:", error);
      } else {
        setProperties(data || []);
      }

      setLoading(false);
    }

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      String(property.title || "").toLowerCase().includes(term) ||
      String(property.location || "").toLowerCase().includes(term);

    const capacity = Number(
      property.max_guests ?? property.guest_capacity ?? property.sleeps ?? 0
    );

    const matchesGuests =
      guests === "Any" ||
      guests === "4+" ? guests === "Any" || capacity >= 4
        : capacity >= Number(guests);

    return matchesSearch && matchesGuests;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8faf8",
      color: "#172b21",
      fontFamily: "Arial, sans-serif"
    }}>
      <section style={{
        padding: "64px 24px 42px",
        textAlign: "center",
        background: "linear-gradient(180deg, #eff8f0 0%, #ffffff 100%)"
      }}>
        <p style={{
          color: "#287447",
          fontWeight: 700,
          letterSpacing: "2px",
          fontSize: "12px",
          textTransform: "uppercase"
        }}>
          YOUR NEXT ESCAPE STARTS HERE
        </p>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)",
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          margin: "16px auto",
          maxWidth: "760px",
          color: "#153e2a"
        }}>
          Find your perfect holiday stay
        </h1>

        <p style={{
          maxWidth: "620px",
          margin: "0 auto",
          lineHeight: 1.7,
          color: "#607166",
          fontSize: "17px"
        }}>
          Discover welcoming holiday homes, coastal escapes, caravans and
          lodges for your next UK getaway.
        </p>

        <div style={{
          maxWidth: "900px",
          margin: "32px auto 0",
          padding: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          background: "#ffffff",
          border: "1px solid #e1e9e2",
          borderRadius: "18px",
          boxShadow: "0 12px 36px rgba(21, 62, 42, 0.08)"
        }}>
          <input
            aria-label="Search destination or property"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Where would you like to go?"
            style={{
              flex: "2 1 240px",
              minWidth: 0,
              padding: "15px",
              border: "1px solid #e5ebe6",
              borderRadius: "10px",
              fontSize: "15px"
            }}
          />

          <select
            aria-label="Number of guests"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            style={{
              flex: "1 1 140px",
              padding: "15px",
              border: "1px solid #e5ebe6",
              borderRadius: "10px",
              background: "#fff",
              fontSize: "15px"
            }}
          >
            <option value="Any">Any guests</option>
            <option value="1">1+ guest</option>
            <option value="2">2+ guests</option>
            <option value="3">3+ guests</option>
            <option value="4+">4+ guests</option>
          </select>

          <button
            onClick={() => document.getElementById("property-list")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              flex: "1 1 120px",
              padding: "15px 24px",
              border: 0,
              borderRadius: "10px",
              background: "#17643b",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Search stays
          </button>
        </div>
      </section>

      <section id="property-list" style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "28px 24px 72px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px"
        }}>
          <div>
            <p style={{
              color: "#287447",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase"
            }}>
              HANDPICKED FOR YOUR GETAWAY
            </p>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 32px)",
              color: "#153e2a",
              margin: "8px 0"
            }}>
              Explore holiday stays
            </h2>
          </div>

          {!loading && (
            <p style={{ color: "#718078" }}>
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "stay" : "stays"} found
            </p>
          )}
        </div>

        {loading ? (
          <p style={{ padding: "40px 0", color: "#607166" }}>
            Finding holiday stays...
          </p>
        ) : filteredProperties.length === 0 ? (
          <div style={{
            background: "#fff",
            border: "1px solid #e1e9e2",
            borderRadius: "16px",
            padding: "40px 24px",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#153e2a" }}>No stays found</h3>
            <p style={{ color: "#607166" }}>
              Try another destination or change your guest selection.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setGuests("Any");
              }}
              style={{
                padding: "12px 18px",
                background: "#17643b",
                color: "#fff",
                border: 0,
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Clear search
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
            gap: "24px"
          }}>
            {filteredProperties.map((property) => {
              const id = String(property.id);
              const imageUrl =
                property.image_url ||
                property.image ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80";

              return (
                <article key={id} style={{
                  background: "#fff",
                  border: "1px solid #e6ece7",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 6px 24px rgba(21, 62, 42, 0.06)"
                }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={imageUrl}
                      alt={property.title || "Holiday accommodation"}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "230px",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />

                    {property.featured && (
                      <span style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        padding: "7px 11px",
                        borderRadius: "20px",
                        background: "#fff",
                        color: "#17643b",
                        fontWeight: 700,
                        fontSize: "12px"
                      }}>
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <div style={{ padding: "22px" }}>
                    <h3 style={{
                      color: "#153e2a",
                      fontSize: "21px",
                      margin: "0 0 10px"
                    }}>
                      {property.title || "Holiday stay"}
                    </h3>

                    <p style={{
                      color: "#718078",
                      margin: "0 0 18px",
                      minHeight: "22px"
                    }}>
                      📍 {property.location || "United Kingdom"}
                    </p>

                    <div style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "5px",
                      marginBottom: "18px"
                    }}>
                      <strong style={{ color: "#17643b", fontSize: "24px" }}>
                        {property.price_per_night != null
                          ? `£${property.price_per_night}`
                          : "Price on request"}
                      </strong>
                      {property.price_per_night != null && (
                        <span style={{ color: "#718078", fontSize: "13px" }}>
                          / night
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/property/${id}`)}
                      style={{
                        width: "100%",
                        padding: "14px",
                        border: 0,
                        borderRadius: "10px",
                        background: "#17643b",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      View property
                    </button>

                    <button
                      onClick={() => toggleFavorite(id)}
                      aria-pressed={favorites.includes(id)}
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "12px",
                        border: "1px solid #dce7de",
                        borderRadius: "10px",
                        background: favorites.includes(id) ? "#fef2f2" : "#fff",
                        color: favorites.includes(id) ? "#b91c1c" : "#315d43",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {favorites.includes(id)
                        ? "♥ Remove favourite"
                        : "♡ Add to favourites"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
