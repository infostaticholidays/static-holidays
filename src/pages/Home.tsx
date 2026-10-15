import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

type PropertyImage = {
  id: string;
  property_id: string;
  storage_path: string;
  public_url: string;
  is_cover: boolean;
  position: number;
};

type Property = {
  id: string;
  title?: string | null;
  location?: string | null;
  address?: string | null;
  postcode?: string | null;
  price_per_night?: number | string | null;
  nightly_price?: number | string | null;
  cover_image_url?: string | null;
  images?: string | null;
  created_at?: string | null;
  is_published?: boolean | null;
  status?: string | null;
  featured?: boolean | null;
  galleryImages?: PropertyImage[];
};

function getPropertyImage(property: Property): string | undefined {
  // First choice: the cover image saved on the property.
  if (property.cover_image_url?.trim()) {
    return property.cover_image_url.trim();
  }

  // Second choice: the owner's cover photo in property_images.
  const uploadedImages = [...(property.galleryImages ?? [])].sort(
    (a, b) =>
      Number(b.is_cover) - Number(a.is_cover) ||
      a.position - b.position
  );

  const uploadedPhoto = uploadedImages.find(
    (image) => image.public_url?.trim()
  );

  if (uploadedPhoto) return uploadedPhoto.public_url;

  // Legacy fallback: the existing images text column.
  if (property.images?.trim()) {
    const value = property.images.trim();

    if (/^https?:\/\//i.test(value)) return value;

    try {
      const parsed = JSON.parse(value);
      const firstImage = Array.isArray(parsed) ? parsed[0] : parsed;

      if (typeof firstImage === "string" && /^https?:\/\//i.test(firstImage)) {
        return firstImage;
      }

      if (firstImage && typeof firstImage === "object") {
        const url = firstImage.public_url || firstImage.url || firstImage.image_url;
        if (typeof url === "string" && /^https?:\/\//i.test(url)) {
          return url;
        }
      }
    } catch {
      // Ignore legacy values that are not valid image URLs.
    }
  }

  return undefined;
}

function getPropertyPrice(property: Property): number | null {
  const value = property.price_per_night ?? property.nightly_price;

  if (value === null || value === undefined || value === "") return null;

  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(price);
}

function PropertyCard({ property }: { property: Property }) {
  const image = getPropertyImage(property);
  const location =
    property.location || property.address || property.postcode || "United Kingdom";
  const price = getPropertyPrice(property);

  return (
    <a className="sh-property-card" href={`/property/${property.id}`}>
      <div className="sh-property-image">
        {image ? (
          <img
            src={image}
            alt={property.title || "Holiday accommodation"}
            loading="lazy"
          />
        ) : (
          <div className="sh-no-photo">
            <span className="sh-no-photo-icon">⌂</span>
            <span>Photos coming soon</span>
          </div>
        )}

        {property.featured && (
          <span className="sh-featured-label">Featured stay</span>
        )}
      </div>

      <div className="sh-property-info">
        <p className="sh-property-location">{location}</p>
        <h3>{property.title}</h3>

        <div className="sh-property-bottom">
          <p className="sh-property-price">
            <strong>{formatPrice(price)}</strong>
            {price !== null && <span> / night</span>}
          </p>
          <span className="sh-card-arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </a>
  );
}

function PropertySection({
  title,
  description,
  properties,
  link,
}: {
  title: string;
  description: string;
  properties: Property[];
  link?: string;
}) {
  if (properties.length === 0) return null;

  return (
    <section className="sh-section">
      <div className="sh-section-heading">
        <div>
          <p className="sh-section-kicker">EXPLORE STATIC HOLIDAYS</p>
          <h2>{title}</h2>
          <p className="sh-section-description">{description}</p>
        </div>

        {link && (
          <a className="sh-text-link" href={link}>
            Explore all stays <span>→</span>
          </a>
        )}
      </div>

      <div className="sh-property-grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      setLoading(true);
      setLoadError(false);

      try {
        const { data: propertyData, error: propertyError } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (propertyError) throw propertyError;

        const validProperties = ((propertyData ?? []) as Property[]).filter(
          (property) => property.id && property.title?.trim()
        );

        const { data: imageData, error: imageError } = await supabase
          .from("property_images")
          .select("id, property_id, storage_path, public_url, is_cover, position")
          .order("position", { ascending: true });

        if (imageError) {
          console.warn("Could not load property gallery images:", imageError);
        }

        const images = (imageData ?? []) as PropertyImage[];
        const imageMap = new Map<string, PropertyImage[]>();

        images.forEach((image) => {
          const current = imageMap.get(image.property_id) ?? [];
          current.push(image);
          imageMap.set(image.property_id, current);
        });

        const completeProperties = validProperties.map((property) => ({
          ...property,
          galleryImages: imageMap.get(property.id) ?? [],
        }));

        if (active) setProperties(completeProperties);
      } catch (error) {
        console.error("Could not load homepage properties:", error);
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProperties();

    return () => {
      active = false;
    };
  }, []);

  const publishedProperties = useMemo(() => {
    // Only show explicitly published listings when publication status is set.
    return properties.filter((property) => {
      if (property.is_published === false) return false;
      if (property.status && property.status !== "published") return false;
      return true;
    });
  }, [properties]);

  const featuredProperties = useMemo(
    () => publishedProperties.filter((property) => property.featured).slice(0, 4),
    [publishedProperties]
  );

  const latestProperties = useMemo(
    () => [...publishedProperties]
      .sort((a, b) => {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 8),
    [publishedProperties]
  );

  const affordableProperties = useMemo(
    () => [...publishedProperties]
      .filter((property) => getPropertyPrice(property) !== null)
      .sort(
        (a, b) =>
          getPropertyPrice(a)! - getPropertyPrice(b)!
      )
      .slice(0, 4),
    [publishedProperties]
  );

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (destination.trim()) params.set("destination", destination.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);

    navigate(`/properties?${params.toString()}`);
  }

  return (
    <main className="sh-home">
      <style>{`
        .sh-home {
          --sh-green: #286442;
          --sh-dark-green: #1d472f;
          --sh-pale-green: #edf4ed;
          --sh-text: #20372a;
          --sh-muted: #718076;
          --sh-border: #e6ece6;
          background: #fff;
          color: var(--sh-text);
          min-height: 100vh;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .sh-home * { box-sizing: border-box; }
        .sh-home a { color: inherit; text-decoration: none; }
        .sh-nav {
          width: 100%;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 15px clamp(20px, 5vw, 76px);
          background: #fff;
          border-bottom: 1px solid #edf0ed;
        }
        .sh-brand { display: flex; align-items: center; gap: 12px; }
        .sh-brand-icon {
          width: 44px; height: 44px; border-radius: 13px;
          display: grid; place-items: center;
          background: var(--sh-green); color: white; font-size: 26px;
        }
        .sh-brand-name { font-size: 20px; line-height: 1.2; font-weight: 750; letter-spacing: -0.6px; }
        .sh-brand-caption { margin-top: 4px; color: var(--sh-muted); font-size: 11px; letter-spacing: .3px; }
        .sh-nav-links { display: flex; align-items: center; gap: clamp(14px, 2.4vw, 34px); }
        .sh-nav-links a { font-size: 13px; font-weight: 600; color: #425449; }
        .sh-nav-links a:hover, .sh-text-link:hover { color: var(--sh-green); }
        .sh-nav-links .sh-nav-dashboard { color: var(--sh-green); }
        .sh-nav-links .sh-sign-in {
          padding: 11px 18px; border: 1px solid #dce6dd;
          border-radius: 10px; color: var(--sh-dark-green);
        }
        .sh-hero {
          position: relative; isolation: isolate; overflow: hidden;
          min-height: 590px; display: flex; align-items: center;
          padding: 68px clamp(20px, 6vw, 88px);
          background-color: #345a42;
          background-image: url("https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=2200&q=85");
          background-size: cover; background-position: center 55%;
          border-radius: 0 0 26px 26px;
        }
        .sh-hero::before {
          content: ""; position: absolute; inset: 0; z-index: -1;
          background: linear-gradient(90deg, rgba(16, 39, 27, .86) 0%, rgba(20, 48, 32, .68) 43%, rgba(20, 48, 32, .12) 100%);
        }
        .sh-hero-inner { width: 100%; max-width: 1280px; margin: 0 auto; }
        .sh-hero-copy { max-width: 730px; }
        .sh-eyebrow {
          display: inline-block; margin-bottom: 18px; color: #e2eee2;
          font-size: 11px; font-weight: 750; letter-spacing: 2.8px;
        }
        .sh-hero h1 {
          margin: 0; max-width: 690px; color: white;
          font-size: clamp(44px, 6vw, 76px); line-height: 1.02;
          font-weight: 680; letter-spacing: -3.5px;
        }
        .sh-hero-subtitle {
          max-width: 470px; margin: 22px 0 32px;
          color: #f0f5ef; font-size: 17px; line-height: 1.7;
        }
        .sh-search {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr .8fr auto;
          align-items: end; gap: 8px; max-width: 1160px;
          padding: 13px; border: 1px solid rgba(255,255,255,.7);
          border-radius: 17px; background: #fff;
          box-shadow: 0 20px 60px rgba(0,0,0,.19);
        }
        .sh-search label { display: flex; min-width: 0; flex-direction: column; gap: 8px; padding: 7px 10px; }
        .sh-search label span { color: #355b43; font-size: 11px; font-weight: 750; }
        .sh-search input, .sh-search select {
          width: 100%; min-width: 0; padding: 0; border: 0; outline: 0;
          background: transparent; color: #263b2e; font: inherit; font-size: 12px;
        }
        .sh-search button {
          min-height: 48px; padding: 0 20px; border: 0; border-radius: 11px;
          background: var(--sh-green); color: white; font-size: 13px;
          font-weight: 700; cursor: pointer; white-space: nowrap;
        }
        .sh-search button:hover { background: var(--sh-dark-green); }
        .sh-trust-row {
          display: flex; flex-wrap: wrap; gap: 20px; margin-top: 22px;
          color: white; font-size: 12px; font-weight: 550;
        }
        .sh-trust-row span::before { content: "✓"; margin-right: 7px; color: #cde5c8; font-weight: 800; }
        .sh-section { max-width: 1440px; margin: 0 auto; padding: 70px clamp(20px, 5vw, 76px) 8px; }
        .sh-section-heading {
          display: flex; align-items: end; justify-content: space-between;
          gap: 24px; margin-bottom: 25px;
        }
        .sh-section-kicker { margin: 0 0 10px; color: var(--sh-green); font-size: 10px; font-weight: 800; letter-spacing: 1.8px; }
        .sh-section-heading h2 { margin: 0; color: #21392b; font-size: clamp(25px, 3vw, 35px); font-weight: 680; letter-spacing: -1.2px; }
        .sh-section-description { margin: 10px 0 0; color: var(--sh-muted); font-size: 14px; line-height: 1.6; }
        .sh-text-link { flex-shrink: 0; color: #345f43; font-size: 13px; font-weight: 700; }
        .sh-text-link span { margin-left: 5px; }
        .sh-property-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; }
        .sh-property-card {
          min-width: 0; overflow: hidden; display: block; border: 1px solid var(--sh-border);
          border-radius: 16px; background: #fff; transition: transform .2s ease, box-shadow .2s ease;
        }
        .sh-property-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(27,64,41,.11); }
        .sh-property-image { position: relative; overflow: hidden; aspect-ratio: 1.22 / 1; background: #edf2ed; }
        .sh-property-image img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s ease; }
        .sh-property-card:hover .sh-property-image img { transform: scale(1.04); }
        .sh-no-photo { width: 100%; height: 100%; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #718476; font-size: 12px; }
        .sh-no-photo-icon { font-size: 34px; color: #91a797; }
        .sh-featured-label { position: absolute; top: 12px; left: 12px; padding: 7px 10px; border-radius: 7px; background: white; color: var(--sh-dark-green); font-size: 10px; font-weight: 750; }
        .sh-property-info { padding: 16px; }
        .sh-property-location { overflow: hidden; margin: 0 0 7px; color: var(--sh-muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
        .sh-property-info h3 { overflow: hidden; margin: 0; color: #263c2e; font-size: 17px; font-weight: 700; letter-spacing: -.3px; text-overflow: ellipsis; white-space: nowrap; }
        .sh-property-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 19px; padding-top: 13px; border-top: 1px solid #edf0ed; }
        .sh-property-price { margin: 0; color: #304b38; font-size: 12px; }
        .sh-property-price strong { font-size: 15px; font-weight: 800; }
        .sh-property-price span { color: var(--sh-muted); font-size: 11px; }
        .sh-card-arrow { display: grid; width: 30px; height: 30px; flex-shrink: 0; place-items: center; border-radius: 50%; background: var(--sh-pale-green); color: var(--sh-green); font-size: 16px; }
        .sh-empty { max-width: 1440px; margin: 45px auto 0; padding: 25px clamp(20px, 5vw, 76px); color: var(--sh-muted); font-size: 14px; }
        .sh-loading { padding: 45px 20px; text-align: center; color: var(--sh-muted); font-size: 14px; }
        .sh-banner { max-width: 1288px; margin: 75px auto 0; padding: 0 clamp(20px, 5vw, 76px); }
        .sh-banner-inner {
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
          padding: 38px clamp(24px, 5vw, 54px); border-radius: 22px;
          background: #edf4ed;
        }
        .sh-banner h2 { margin: 0; color: #244a32; font-size: clamp(24px, 3vw, 34px); letter-spacing: -1px; }
        .sh-banner p { margin: 10px 0 0; color: #5f7465; font-size: 14px; line-height: 1.6; }
        .sh-banner-button { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; padding: 14px 20px; border-radius: 10px; background: var(--sh-green); color: white !important; font-size: 13px; font-weight: 700; }
        .sh-footer { margin-top: 75px; padding: 38px clamp(20px, 5vw, 76px); border-top: 1px solid var(--sh-border); }
        .sh-footer-inner { max-width: 1288px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .sh-footer-copy { color: var(--sh-muted); font-size: 12px; line-height: 1.8; }
        .sh-footer-links { display: flex; flex-wrap: wrap; gap: 22px; color: #52675a; font-size: 12px; font-weight: 600; }
        @media (max-width: 1050px) {
          .sh-property-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sh-search { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sh-search button { grid-column: 1 / -1; }
        }
        @media (max-width: 650px) {
          .sh-nav { min-height: 72px; gap: 10px; padding: 12px 16px; }
          .sh-brand-icon { width: 38px; height: 38px; }
          .sh-brand-name { font-size: 17px; }
          .sh-brand-caption { font-size: 10px; }
          .sh-nav-links { gap: 12px; }
          .sh-nav-links a { font-size: 11px; }
          .sh-nav-links .sh-sign-in { padding: 9px 10px; }
          .sh-nav-links .sh-hide-mobile { display: none; }
          .sh-hero { min-height: auto; padding: 64px 17px 30px; background-position: 62% center; }
          .sh-hero h1 { font-size: 47px; letter-spacing: -2px; }
          .sh-hero-subtitle { margin: 18px 0 25px; font-size: 14px; }
          .sh-search { grid-template-columns: 1fr; gap: 8px; padding: 13px; }
          .sh-search label { padding: 8px 9px; border-bottom: 1px solid #edf0ed; }
          .sh-search button { grid-column: auto; }
          .sh-trust-row { gap: 10px 15px; font-size: 10px; }
          .sh-section { padding-top: 48px; }
          .sh-section-heading { align-items: start; flex-direction: column; gap: 13px; }
          .sh-property-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
          .sh-property-info { padding: 11px; }
          .sh-property-info h3 { font-size: 14px; }
          .sh-property-location { font-size: 10px; }
          .sh-property-price strong { font-size: 13px; }
          .sh-property-price span { display: block; margin-top: 3px; }
          .sh-property-bottom { margin-top: 12px; padding-top: 10px; }
          .sh-featured-label { top: 7px; left: 7px; padding: 6px 7px; font-size: 9px; }
          .sh-banner { margin-top: 48px; }
          .sh-banner-inner { align-items: start; flex-direction: column; padding: 27px 22px; }
          .sh-footer-inner { align-items: start; flex-direction: column; }
        }
      `}</style>

      <header className="sh-nav">
        <a href="/" className="sh-brand" aria-label="Static Holidays homepage">
          <span className="sh-brand-icon">⌂</span>
          <span>
            <span className="sh-brand-name" style={{ display: "block" }}>
              Static Holidays
            </span>
            <span className="sh-brand-caption" style={{ display: "block" }}>
              Your next escape awaits
            </span>
          </span>
        </a>

        <nav className="sh-nav-links" aria-label="Main navigation">
          <a className="sh-hide-mobile" href="/properties">Explore stays</a>
          <a className="sh-nav-dashboard" href="/dashboard">Dashboard</a>
          <a className="sh-sign-in" href="/login">Sign in</a>
        </nav>
      </header>

      <section className="sh-hero">
        <div className="sh-hero-inner">
          <div className="sh-hero-copy">
            <span className="sh-eyebrow">YOUR NEXT ESCAPE</span>
            <h1>Find your somewhere.</h1>
            <p className="sh-hero-subtitle">
              Lovely places to stay. Memorable moments to make.
            </p>

            <form className="sh-search" onSubmit={handleSearch}>
              <label>
                <span>DESTINATION</span>
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Where would you like to go?"
                />
              </label>

              <label>
                <span>CHECK-IN</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(event) => setCheckIn(event.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </label>

              <label>
                <span>CHECK-OUT</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(event) => setCheckOut(event.target.value)}
                  min={checkIn || new Date().toISOString().slice(0, 10)}
                />
              </label>

              <label>
                <span>GUESTS</span>
                <select
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5 guests</option>
                  <option value="6">6+ guests</option>
                </select>
              </label>

              <button type="submit">Find a stay →</button>
            </form>

            <div className="sh-trust-row">
              <span>Lovely places across the UK</span>
              <span>Find your perfect escape</span>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="sh-loading">Discovering lovely places to stay…</div>
      ) : loadError ? (
        <div className="sh-empty">
          We couldn't load the stays right now. Please refresh the page and try again.
        </div>
      ) : publishedProperties.length === 0 ? (
        <div className="sh-empty">
          New stays are on their way. Please check back soon.
        </div>
      ) : (
        <>
          <PropertySection
            title="Handpicked stays"
            description="Explore welcoming places for your next UK escape."
            properties={
              featuredProperties.length > 0
                ? featuredProperties
                : latestProperties.slice(0, 4)
            }
            link="/properties"
          />

          <PropertySection
            title="Great stays for less"
            description="Find a lovely place to stay at a price that suits you."
            properties={affordableProperties}
            link="/properties"
          />

          <PropertySection
            title="Discover more places"
            description="Find your next favourite getaway."
            properties={latestProperties}
            link="/properties"
          />

          <section className="sh-banner">
            <div className="sh-banner-inner">
              <div>
                <h2>Your next chapter starts with a getaway.</h2>
                <p>
                  Explore UK holiday homes, peaceful lodges and coastal escapes.
                </p>
              </div>
              <a className="sh-banner-button" href="/properties">
                Explore all stays →
              </a>
            </div>
          </section>
        </>
      )}

      <footer className="sh-footer">
        <div className="sh-footer-inner">
          <div className="sh-footer-copy">
            <strong style={{ color: "#284a34", fontSize: 15 }}>
              Static Holidays
            </strong>
            <br />
            Find your somewhere.
            <br />
            © {new Date().getFullYear()} Static Holidays
          </div>

          <nav className="sh-footer-links" aria-label="Footer navigation">
            <a href="/properties">Explore stays</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/login">Sign in</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
