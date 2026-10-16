import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  title: string | null;
  description?: string | null;
  location: string | null;
  price_per_night?: number | null;
  nightly_price?: number | null;
  images?: string | null;
  cover_image_url?: string | null;
  featured?: boolean | null;
  has_pool?: boolean;
  pet_friendly?: boolean;
  has_hot_tub?: boolean;
  sea_view?: boolean;
  parking?: boolean;
  wifi?: boolean;
  family_friendly?: boolean;
  sleeps?: number | null;
  features?: string[];
  holiday_types?: string[];
  is_published?: boolean;
  status?: string;
};

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState("Any");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [hotTub, setHotTub] = useState(false);
  const [pool, setPool] = useState(false);
  const [seaView, setSeaView] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [familyFriendly, setFamilyFriendly] = useState(false);

  const navigate = useNavigate();

  
  const location = useLocation();

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);

      let query = supabase
  .from("properties")
  .select("*")
  .eq("is_published", true)
  .eq("status", "published");

      if (location.pathname === "/my-properties") {
        const { data: { user }, error: userError } =
          await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Could not identify the logged-in owner:", userError);
          setProperties([]);
          setLoading(false);
          return;
        }

        query = query.eq("owner_id", user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Could not load properties:", error);
        setProperties([]);
      } else {
        setProperties((data || []) as Property[]);
      }

      setLoading(false);
    }

    fetchProperties();
  }, [location.pathname]);


  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const filteredProperties = properties.filter((property) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      String(property.title || "").toLowerCase().includes(term) ||
      String(property.location || "").toLowerCase().includes(term) ||
      String(property.description || "").toLowerCase().includes(term);

    const capacity = Number(property.sleeps || 0);

    return (
      matchesSearch &&
      (guests === "Any" ||
        (guests === "4+" ? capacity >= 4 : capacity >= Number(guests))) &&
      (!hotTub || property.has_hot_tub === true) &&
      (!pool || property.has_pool === true || property.pool_type !== "none") &&
      (!seaView || property.sea_view === true) &&
      (!petFriendly || property.pet_friendly === true) &&
      (!wifi || property.wifi === true) &&
      (!parking || property.parking === true) &&
      (!familyFriendly || property.family_friendly === true)
    );
  });

  function clearFilters() {
    setSearch("");
    setGuests("Any");
    setCheckIn("");
    setCheckOut("");
    setHotTub(false);
    setPool(false);
    setSeaView(false);
    setPetFriendly(false);
    setWifi(false);
    setParking(false);
    setFamilyFriendly(false);
  }

  const activeFilterCount = [
    hotTub,
    pool,
    seaView,
    petFriendly,
    wifi,
    parking,
    familyFriendly,
  ].filter(Boolean).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8faf8",
      color: "#172b21",
      fontFamily: "Arial, sans-serif",
    }}>
      <header style={{
        padding: "20px 24px",
        background: "#ffffff",
        borderBottom: "1px solid #e3ebe4",
      }}>
        <div style={{
          maxWidth: "1240px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link to="/" aria-label="Static Holidays homepage" style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#153e2a",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "22px",
          }}>
            <span style={{
              display: "grid",
              placeItems: "center",
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: "#17643b",
              color: "#ffffff",
              fontSize: "24px",
            }}>⌂</span>
            Static Holidays
          </Link>

          <Link to="/" style={{
            color: "#17643b",
            textDecoration: "none",
            fontWeight: 600,
          }}>
            ← Home
          </Link>
        </div>
      </header>

      <section style={{
        padding: "54px 24px 40px",
        textAlign: "center",
        background: "linear-gradient(180deg, #eff8f0 0%, #ffffff 100%)",
      }}>
        <p style={{
          color: "#287447",
          fontWeight: 700,
          letterSpacing: "2px",
          fontSize: "12px",
        }}>
          YOUR NEXT UK GETAWAY
        </p>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 50px)",
          lineHeight: 1.12,
          letterSpacing: "-1px",
          margin: "14px auto",
          maxWidth: "760px",
          color: "#153e2a",
        }}>
          Find your perfect holiday stay
        </h1>

        <p style={{
          maxWidth: "620px",
          margin: "0 auto",
          lineHeight: 1.7,
          color: "#607166",
          fontSize: "17px",
        }}>
          Discover welcoming holiday homes, coastal escapes, caravans and
          lodges for your next UK getaway.
        </p>

        <div style={{
          maxWidth: "1000px",
          margin: "30px auto 0",
          padding: "14px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          background: "#ffffff",
          border: "1px solid #e1e9e2",
          borderRadius: "18px",
          boxShadow: "0 12px 36px rgba(21, 62, 42, 0.08)",
          textAlign: "left",
        }}>
          <label style={{ flex: "2 1 200px", color: "#315d43", fontSize: "12px", fontWeight: 700 }}>
            DESTINATION
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Where would you like to go?"
              style={{
                display: "block",
                boxSizing: "border-box",
                width: "100%",
                marginTop: "7px",
                padding: "13px",
                border: "1px solid #e1e9e2",
                borderRadius: "9px",
                fontSize: "14px",
              }}
            />
          </label>

          <label style={{ flex: "1 1 140px", color: "#315d43", fontSize: "12px", fontWeight: 700 }}>
            CHECK-IN
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                if (checkOut && event.target.value >= checkOut) setCheckOut("");
              }}
              style={{
                display: "block",
                boxSizing: "border-box",
                width: "100%",
                marginTop: "7px",
                padding: "13px",
                border: "1px solid #e1e9e2",
                borderRadius: "9px",
                fontSize: "14px",
              }}
            />
          </label>

          <label style={{ flex: "1 1 140px", color: "#315d43", fontSize: "12px", fontWeight: 700 }}>
            CHECK-OUT
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              style={{
                display: "block",
                boxSizing: "border-box",
                width: "100%",
                marginTop: "7px",
                padding: "13px",
                border: "1px solid #e1e9e2",
                borderRadius: "9px",
                fontSize: "14px",
              }}
            />
          </label>

          <label style={{ flex: "1 1 125px", color: "#315d43", fontSize: "12px", fontWeight: 700 }}>
            GUESTS
            <select
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              style={{
                display: "block",
                boxSizing: "border-box",
                width: "100%",
                marginTop: "7px",
                padding: "13px",
                border: "1px solid #e1e9e2",
                borderRadius: "9px",
                background: "#ffffff",
                fontSize: "14px",
              }}
            >
              <option value="Any">Any guests</option>
              <option value="1">1+ guest</option>
              <option value="2">2+ guests</option>
              <option value="3">3+ guests</option>
              <option value="4+">4+ guests</option>
            </select>
          </label>

          <button
            onClick={() => {
              if (checkIn && checkOut && checkOut <= checkIn) {
                alert("Check-out must be after check-in.");
                return;
              }
              document.getElementById("property-list")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              alignSelf: "end",
              flex: "1 1 130px",
              padding: "14px 20px",
              border: 0,
              borderRadius: "10px",
              background: "#17643b",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Search stays
          </button>
        </div>

        <div style={{ maxWidth: "1000px", margin: "12px auto 0", textAlign: "left" }}>
          <button
            type="button"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((open) => !open)}
            style={{
              padding: "10px 14px",
              border: "1px solid #dce7de",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#17643b",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
           More filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""} {showFilters ? "▲" : "▼"}
          </button>

          {showFilters && (
            <div style={{
              marginTop: "12px",
              padding: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              background: "#ffffff",
              border: "1px solid #e1e9e2",
              borderRadius: "14px",
              textAlign: "left",
            }}>
              {[
                ["Hot tub", hotTub, setHotTub],
                ["Swimming pool", pool, setPool],
                ["Sea view", seaView, setSeaView],
                ["Pet friendly", petFriendly, setPetFriendly],
                ["Wi-Fi", wifi, setWifi],
                ["Parking", parking, setParking],
                ["Family friendly", familyFriendly, setFamilyFriendly],
              ].map(([label, checked, setter]) => (
                <label key={String(label)} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  color: "#315d43",
                  cursor: "pointer",
                }}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked)}
                    onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)}
                  />
                  {String(label)}
                </label>
              ))}

              <button
                type="button"
                onClick={clearFilters}
                style={{
                  padding: "10px",
                  border: "1px solid #dce7de",
                  borderRadius: "8px",
                  background: "#f8faf8",
                  color: "#17643b",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="property-list" style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "32px 24px 72px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
        }}>
          <div>
            <p style={{
              color: "#287447",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "1.5px",
            }}>
              FIND YOUR SOMEWHERE
            </p>
            <h2 style={{ fontSize: "30px", color: "#153e2a", margin: "8px 0" }}>
              Explore holiday stays
            </h2>
          </div>
          {!loading && (
            <p style={{ color: "#718078" }}>
              {filteredProperties.length} {filteredProperties.length === 1 ? "stay" : "stays"} found
            </p>
          )}
        </div>

        {loading ? (
          <p style={{ padding: "40px 0", color: "#607166" }}>Finding holiday stays...</p>
        ) : filteredProperties.length === 0 ? (
          <div style={{
            padding: "40px 24px",
            textAlign: "center",
            background: "#ffffff",
            border: "1px solid #e1e9e2",
            borderRadius: "16px",
          }}>
            <h3 style={{ color: "#153e2a" }}>No stays match those filters</h3>
            <p style={{ color: "#607166" }}>
              Try another destination or clear some filters.
            </p>
            <button onClick={clearFilters} style={{
              padding: "12px 18px",
              background: "#17643b",
              color: "#ffffff",
              border: 0,
              borderRadius: "8px",
              cursor: "pointer",
            }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
            gap: "24px",
          }}>
            {filteredProperties.map((property) => {
              const id = String(property.id);
              const imageUrl =
                property.cover_image_url ||
                property.images?.split(",")[0]?.trim() ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80";
              const price = property.price_per_night ?? property.nightly_price;

              return (
                <article key={id} style={{
                  background: "#ffffff",
                  border: "1px solid #e6ece7",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 6px 24px rgba(21, 62, 42, 0.06)",
                }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={imageUrl}
                      alt={property.title || "Holiday accommodation"}
                      loading="lazy"
                      style={{ width: "100%", height: "230px", objectFit: "cover", display: "block" }}
                    />
                    {property.featured && (
                      <span style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        padding: "7px 11px",
                        borderRadius: "20px",
                        background: "#ffffff",
                        color: "#17643b",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}>
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <div style={{ padding: "22px" }}>
                    <h3 style={{ color: "#153e2a", fontSize: "21px", margin: "0 0 10px" }}>
                      {property.title || "Holiday stay"}
                    </h3>
                    <p style={{ color: "#718078", margin: "0 0 18px" }}>
                      📍 {property.location || "United Kingdom"}
                    </p>
                    <div style={{ marginBottom: "18px" }}>
                      <strong style={{ color: "#17643b", fontSize: "24px" }}>
                     {price != null ? `£${price}` : "Price on request"}
                      </strong>
                      {price != null && <span style={{ color: "#718078", fontSize: "13px" }}> / night</span>}
                    </div>

                    <button
                    onClick={() => navigate(`/property/${id}`, {
                        state: { checkIn, checkOut, guests },
                      })}
                      style={{
                        width: "100%",
                        padding: "14px",
                        border: 0,
                        borderRadius: "10px",
                        background: "#17643b",
                        color: "#ffffff",
                        fontWeight: 700,
                        cursor: "pointer",
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
                        background: favorites.includes(id) ? "#fef2f2" : "#ffffff",
                        color: favorites.includes(id) ? "#b91c1c" : "#315d43",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {favorites.includes(id) ? "♥ Remove favourite" : "♡ Add to favourites"}
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
