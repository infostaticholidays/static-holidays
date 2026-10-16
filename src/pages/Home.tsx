
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
  description?: string | null;
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
  [key: string]: unknown;
};

type HolidayCategory = {
  title: string;
  description: string;
  slug: string;
  image: string;
  keywords: string[];
  flags: string[];
};

const categories: HolidayCategory[] = [
  {
    title: "Dog-friendly stays",
    description: "Bring your four-legged companion along.",
    slug: "dog-friendly",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80",
    keywords: [
      "dog friendly",
      "dog-friendly",
      "pet friendly",
      "pet-friendly",
      "dogs welcome",
      "pets welcome",
      "dogs allowed",
    ],
    flags: [
      "dog_friendly",
      "pet_friendly",
      "pets_allowed",
      "allows_dogs",
      "dogs_allowed",
    ],
  },
  {
    title: "Charming cottages",
    description: "Cosy hideaways and beautiful country homes.",
    slug: "cottages",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80",
    keywords: ["cottage", "holiday cottage", "country cottage"],
    flags: [],
  },
  {
    title: "Hot tub escapes",
    description: "Unwind with a little extra luxury.",
    slug: "hot-tub",
    image:
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=900&q=80",
    keywords: ["hot tub", "hot-tub", "hottub", "jacuzzi"],
    flags: ["hot_tub", "has_hot_tub", "private_hot_tub", "jacuzzi"],
  },
  {
    title: "Equine-friendly stays",
    description: "Find a countryside break for horse lovers.",
    slug: "equine",
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80",
    keywords: [
      "equine friendly",
      "equine-friendly",
      "horse friendly",
      "horse-friendly",
      "equestrian",
      "stables",
      "horses welcome",
    ],
    flags: [
      "equine_friendly",
      "horse_friendly",
      "equestrian_facilities",
      "stables_available",
    ],
  },
];

const destinations = [
  {
    name: "Wales",
    description: "Mountains, countryside and coastal escapes.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Scotland",
    description: "Lochside retreats and Highland hideaways.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Devon",
    description: "Country cottages and peaceful escapes.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Cornwall",
    description: "Coastal villages and seaside holidays.",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80",
  },
];

function getPropertyImage(property: Property): string | undefined {
  if (property.cover_image_url?.trim()) {
    return property.cover_image_url.trim();
  }

  const uploadedImages = [...(property.galleryImages ?? [])].sort(
    (a, b) =>
      Number(b.is_cover) - Number(a.is_cover) ||
      a.position - b.position
  );

  const uploadedPhoto = uploadedImages.find(
    (image) => image.public_url?.trim()
  );

  if (uploadedPhoto) return uploadedPhoto.public_url;

  if (property.images?.trim()) {
    const value = property.images.trim();

    if (/^https?:\/\//i.test(value)) return value;

    try {
      const parsed = JSON.parse(value);
      const firstImage = Array.isArray(parsed) ? parsed[0] : parsed;

      if (
        typeof firstImage === "string" &&
        /^https?:\/\//i.test(firstImage)
      ) {
        return firstImage;
      }

      if (firstImage && typeof firstImage === "object") {
        const imageObject = firstImage as Record<string, unknown>;
        const url =
          imageObject.public_url ||
          imageObject.url ||
          imageObject.image_url;

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

function hasEnabledFlag(property: Property, fields: string[]): boolean {
  return fields.some((field) => {
    const value = property[field];

    return (
      value === true ||
      value === 1 ||
      (typeof value === "string" &&
        ["true", "yes", "1"].includes(value.toLowerCase().trim()))
    );
  });
}

function searchablePropertyText(property: Property): string {
  const fields = [
    property.title,
    property.description,
    property.property_type,
    property.propertyType,
    property.category,
    property.amenities,
    property.features,
    property.tags,
    property.house_rules,
    property.houseRules,
  ];

  return fields
    .map((value) => {
      if (Array.isArray(value)) return value.join(" ");
      if (typeof value === "string") return value;
      return "";
    })
    .join(" ")
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function matchesCategory(
  property: Property,
  category: HolidayCategory
): boolean {
  if (hasEnabledFlag(property, category.flags)) return true;

  const text = searchablePropertyText(property);

  return category.keywords.some((keyword) =>
    text.includes(keyword.toLowerCase().replace(/[_-]+/g, " "))
  );
}

function matchesDestination(
  property: Property,
  destination: string
): boolean {
  const text = [
    property.location,
    property.address,
    property.postcode,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return text.includes(destination.toLowerCase());
}

function PropertyCard({ property }: { property: Property }) {
  const image = getPropertyImage(property);
  const location =
    property.location ||
    property.address ||
    property.postcode ||
    "United Kingdom";
  const price = getPropertyPrice(property);

  return (
   <a
  className="sh-property-card"
  href={"/property/" + property.id}
>
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
          <span className="sh-card-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </a>
  );
}

function PropertyCarousel({
  title,
  description,
  properties,
  link = "/properties",
}: {
  title: string;
  description: string;
  properties: Property[];
  link?: string;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (properties.length === 0) return null;

  function scrollCarousel(direction: number) {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <section className="sh-section">
      <div className="sh-section-heading">
        <div>
          <p className="sh-section-kicker">EXPLORE STATIC HOLIDAYS</p>
          <h2>{title}</h2>
          <p className="sh-section-description">{description}</p>
        </div>

        <div className="sh-section-actions">
          <a className="sh-text-link" href={link}>
            View all <span>→</span>
          </a>

          <div className="sh-carousel-arrows">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollCarousel(-1)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollCarousel(1)}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="sh-carousel-track" ref={carouselRef}>
        {properties.map((property) => (
          <div className="sh-carousel-item" key={property.id}>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
}

function BrowseCategories() {
  return (
    <section className="sh-section">
      <div className="sh-section-heading">
        <div>
          <p className="sh-section-kicker">FIND YOUR KIND OF ESCAPE</p>
          <h2>What does your perfect break look like?</h2>
          <p className="sh-section-description">
            From dog-friendly cottages to hot tub hideaways, discover your
            next favourite place.
          </p>
        </div>
      </div>

      <div className="sh-category-grid">
        {categories.map((category) => (
          <a
            key={category.slug}
            className="sh-category-card"
            href={`/properties?feature=${encodeURIComponent(category.slug)}`}
          >
            <img src={category.image} alt="" loading="lazy" />
            <span className="sh-category-shade" />
            <span className="sh-category-copy">
              <strong>{category.title}</strong>
              <span>{category.description}</span>
              <span className="sh-category-link">Explore stays →</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function DestinationSection() {
  return (
    <section className="sh-section">
      <div className="sh-section-heading">
        <div>
          <p className="sh-section-kicker">EXPLORE THE UK</p>
          <h2>Popular destinations</h2>
          <p className="sh-section-description">
            Find your next escape in some of Britain's favourite regions.
          </p>
        </div>
      </div>

      <div className="sh-destination-grid">
        {destinations.map((destination) => (
          <a
            key={destination.name}
            className="sh-destination-card"
            href={`/properties?destination=${encodeURIComponent(destination.name)}`}
          >
            <img src={destination.image} alt="" loading="lazy" />
            <div className="sh-destination-copy">
              <h3>{destination.name}</h3>
              <p>{destination.description}</p>
              <span>Explore {destination.name} →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function SubscriptionSection() {
  return (
    <section className="sh-subscription-section">
      <div className="sh-subscription-intro">
        <p className="sh-section-kicker">FOR HOLIDAY HOME OWNERS</p>
        <h2>Your property deserves to be discovered.</h2>
        <p>
          Bring your holiday home to Static Holidays and help guests find
          somewhere special to stay.
        </p>
        <a className="sh-primary-button" href="/dashboard">
          Explore owner options →
        </a>
      </div>

      <div className="sh-plan-card">
        <span className="sh-plan-icon">⌂</span>
        <h3>List your property</h3>
        <p>
          Find out about the available subscription options and choose what
          works for your holiday home.
        </p>
        <a href="/dashboard">
          View subscription options <span>→</span>
        </a>
        <p className="sh-plan-note">
          Current prices and plan details are available through your owner
          account.
        </p>
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
          .select(
            "id, property_id, storage_path, public_url, is_cover, position"
          )
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
    return properties.filter((property) => {
      if (property.is_published === false) return false;
      if (property.status && property.status !== "published") return false;
      return true;
    });
  }, [properties]);

  const featuredProperties = useMemo(
    () => publishedProperties.filter((property) => property.featured).slice(0, 12),
    [publishedProperties]
  );

  const latestProperties = useMemo(
    () =>
      [...publishedProperties]
        .sort((a, b) => {
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bDate - aDate;
        })
        .slice(0, 12),
    [publishedProperties]
  );

  const affordableProperties = useMemo(
    () =>
      [...publishedProperties]
        .filter((property) => getPropertyPrice(property) !== null)
        .sort(
          (a, b) =>
            getPropertyPrice(a)! - getPropertyPrice(b)!
        )
        .slice(0, 12),
    [publishedProperties]
  );

  const dogFriendlyProperties = useMemo(
    () =>
      publishedProperties.filter((property) =>
        matchesCategory(property, categories[0])
      ),
    [publishedProperties]
  );

  const cottageProperties = useMemo(
    () =>
      publishedProperties.filter((property) =>
        matchesCategory(property, categories[1])
      ),
    [publishedProperties]
  );

  const hotTubProperties = useMemo(
    () =>
      publishedProperties.filter((property) =>
        matchesCategory(property, categories[2])
      ),
    [publishedProperties]
  );

  const equineProperties = useMemo(
    () =>
      publishedProperties.filter((property) =>
        matchesCategory(property, categories[3])
      ),
    [publishedProperties]
  );

  const walesProperties = useMemo(
    () => publishedProperties.filter((property) => matchesDestination(property, "Wales")),
    [publishedProperties]
  );

  const scotlandProperties = useMemo(
    () =>
      publishedProperties.filter((property) =>
        matchesDestination(property, "Scotland")
      ),
    [publishedProperties]
  );

  const devonProperties = useMemo(
    () => publishedProperties.filter((property) => matchesDestination(property, "Devon")),
    [publishedProperties]
  );

  const cornwallProperties = useMemo(
    () =>
      publishedProperties.filter((property) =>
        matchesDestination(property, "Cornwall")
      ),
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
          width: 100%; min-height: 82px; display: flex; align-items: center;
          justify-content: space-between; gap: 24px; padding: 15px clamp(20px, 5vw, 76px);
          background: #fff; border-bottom: 1px solid #edf0ed;
        }
        .sh-brand { display: flex; align-items: center; gap: 12px; }
        .sh-brand-icon {
          width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center;
          background: var(--sh-green); color: white; font-size: 26px;
        }
        .sh-brand-name { font-size: 20px; line-height: 1.2; font-weight: 750; letter-spacing: -.6px; }
        .sh-brand-caption { margin-top: 4px; color: var(--sh-muted); font-size: 11px; }
        .sh-nav-links { display: flex; align-items: center; gap: clamp(14px, 2.4vw, 34px); }
        .sh-nav-links a { font-size: 13px; font-weight: 600; color: #425449; }
        .sh-nav-links a:hover, .sh-text-link:hover { color: var(--sh-green); }
        .sh-nav-links .sh-nav-dashboard { color: var(--sh-green); }
        .sh-nav-links .sh-sign-in { padding: 11px 18px; border: 1px solid #dce6dd; border-radius: 10px; }
        .sh-hero {
          position: relative; isolation: isolate; overflow: hidden; min-height: 570px;
          display: flex; align-items: center; padding: 68px clamp(20px, 6vw, 88px);
          background-color: #345a42;
          background-image: url("https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=2200&q=85");
          background-size: cover; background-position: center 55%; border-radius: 0 0 26px 26px;
        }
        .sh-hero::before {
          content: ""; position: absolute; inset: 0; z-index: -1;
          background: linear-gradient(90deg, rgba(16,39,27,.86), rgba(20,48,32,.65) 48%, rgba(20,48,32,.12));
        }
        .sh-hero-inner { width: 100%; max-width: 1280px; margin: 0 auto; }
        .sh-hero-copy { max-width: 780px; }
        .sh-eyebrow { display: inline-block; margin-bottom: 18px; color: #e2eee2; font-size: 11px; font-weight: 750; letter-spacing: 2.8px; }
        .sh-hero h1 { margin: 0; color: white; font-size: clamp(44px,6vw,76px); line-height: 1.02; font-weight: 680; letter-spacing: -3.5px; }
        .sh-hero-subtitle { max-width: 470px; margin: 22px 0 32px; color: #f0f5ef; font-size: 17px; line-height: 1.7; }
        .sh-search {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr .8fr auto; align-items: end;
          gap: 8px; max-width: 1160px; padding: 13px; border: 1px solid rgba(255,255,255,.7);
          border-radius: 17px; background: #fff; box-shadow: 0 20px 60px rgba(0,0,0,.19);
        }
        .sh-search label { display: flex; min-width: 0; flex-direction: column; gap: 8px; padding: 7px 10px; }
        .sh-search label span { color: #355b43; font-size: 11px; font-weight: 750; }
        .sh-search input, .sh-search select { width: 100%; min-width: 0; padding: 0; border: 0; outline: 0; background: transparent; color: #263b2e; font: inherit; font-size: 12px; }
        .sh-search button, .sh-primary-button {
          min-height: 48px; padding: 0 20px; border: 0; border-radius: 11px;
          background: var(--sh-green); color: white; font-size: 13px; font-weight: 700;
          cursor: pointer; white-space: nowrap;
        }
        .sh-search button:hover, .sh-primary-button:hover { background: var(--sh-dark-green); }
        .sh-trust-row { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 22px; color: white; font-size: 12px; font-weight: 550; }
        .sh-trust-row span::before { content: "✓"; margin-right: 7px; color: #cde5c8; font-weight: 800; }
        .sh-section { max-width: 1440px; margin: 0 auto; padding: 65px clamp(20px,5vw,76px) 0; }
        .sh-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 25px; }
        .sh-section-kicker { margin: 0 0 10px; color: var(--sh-green); font-size: 10px; font-weight: 800; letter-spacing: 1.8px; }
        .sh-section-heading h2, .sh-subscription-intro h2 { margin: 0; color: #21392b; font-size: clamp(25px,3vw,35px); font-weight: 680; letter-spacing: -1.2px; }
        .sh-section-description { margin: 10px 0 0; color: var(--sh-muted); font-size: 14px; line-height: 1.6; }
        .sh-section-actions { display: flex; align-items: center; gap: 18px; flex-shrink: 0; }
        .sh-text-link { color: #345f43; font-size: 13px; font-weight: 700; white-space: nowrap; }
        .sh-text-link span { margin-left: 5px; }
        .sh-carousel-arrows { display: flex; gap: 8px; }
        .sh-carousel-arrows button {
          display: grid; place-items: center; width: 39px; height: 39px; border-radius: 50%;
          border: 1px solid #dce6dd; background: white; color: var(--sh-green);
          font-size: 21px; cursor: pointer; transition: background .2s, color .2s;
        }
        .sh-carousel-arrows button:hover { background: var(--sh-green); color: white; }
        .sh-carousel-track {
          display: flex; gap: 20px; overflow-x: auto; scroll-behavior: smooth;
          scroll-snap-type: x mandatory; padding: 2px 2px 14px;
          scrollbar-width: thin; scrollbar-color: #c8d8ca transparent;
        }
        .sh-carousel-item { flex: 0 0 calc((100% - 60px) / 4); min-width: 0; scroll-snap-align: start; }
        .sh-property-card {
          height: 100%; min-width: 0; overflow: hidden; display: block; border: 1px solid var(--sh-border);
          border-radius: 16px; background: white; transition: transform .2s, box-shadow .2s;
        }
        .sh-property-card:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(27,64,41,.11); }
        .sh-property-image { position: relative; overflow: hidden; aspect-ratio: 1.22 / 1; background: #edf2ed; }
        .sh-property-image img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s; }
        .sh-property-card:hover .sh-property-image img { transform: scale(1.04); }
        .sh-no-photo { width: 100%; height: 100%; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #718476; font-size: 12px; }
        .sh-no-photo-icon { font-size: 34px; color: #91a797; }
        .sh-featured-label { position: absolute; top: 12px; left: 12px; padding: 7px 10px; border-radius: 7px; background: white; color: var(--sh-dark-green); font-size: 10px; font-weight: 750; }
        .sh-property-info { padding: 16px; }
        .sh-property-location { overflow: hidden; margin: 0 0 7px; color: var(--sh-muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
        .sh-property-info h3 { overflow: hidden; margin: 0; color: #263c2e; font-size: 17px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .sh-property-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 19px; padding-top: 13px; border-top: 1px solid #edf0ed; }
        .sh-property-price { margin: 0; color: #304b38; font-size: 12px; }
        .sh-property-price strong { font-size: 15px; font-weight: 800; }
        .sh-property-price span { color: var(--sh-muted); font-size: 11px; }
        .sh-card-arrow { display: grid; width: 30px; height: 30px; flex-shrink: 0; place-items: center; border-radius: 50%; background: var(--sh-pale-green); color: var(--sh-green); font-size: 16px; }
        .sh-category-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 18px; }
        .sh-category-card { position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: end; min-height: 270px; border-radius: 17px; background: #dfe8df; color: white !important; }
        .sh-category-card img, .sh-destination-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; transition: transform .35s; }
        .sh-category-card:hover img, .sh-destination-card:hover img { transform: scale(1.04); }
        .sh-category-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg,rgba(14,37,24,.86),rgba(14,37,24,.02) 85%); }
        .sh-category-copy { display: flex; flex-direction: column; gap: 8px; padding: 22px; }
        .sh-category-copy strong { font-size: 20px; letter-spacing: -.4px; }
        .sh-category-copy > span:not(.sh-category-link) { font-size: 12px; line-height: 1.5; color: #f1f5f0; }
        .sh-category-link { margin-top: 5px; font-size: 12px; font-weight: 750; }
        .sh-destination-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 18px; }
        .sh-destination-card { position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: end; min-height: 300px; border-radius: 17px; color: white !important; background: #dfe8df; }
        .sh-destination-card::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg,rgba(14,37,24,.88),rgba(14,37,24,.02) 90%); }
        .sh-destination-copy { padding: 22px; }
        .sh-destination-copy h3 { margin: 0 0 8px; font-size: 25px; }
        .sh-destination-copy p { margin: 0 0 15px; color: #f1f5f0; font-size: 12px; line-height: 1.5; }
        .sh-destination-copy span { font-size: 12px; font-weight: 750; }
        .sh-empty, .sh-loading { padding: 32px 20px; color: var(--sh-muted); text-align: center; font-size: 14px; }
        .sh-subscription-section {
          max-width: 1288px; margin: 76px auto 0; padding: 0 clamp(20px,5vw,76px);
          display: grid; grid-template-columns: 1.2fr .8fr; gap: 25px;
        }
        .sh-subscription-intro { padding: clamp(26px,4vw,48px); border-radius: 22px; background: #edf4ed; }
        .sh-subscription-intro h2 { max-width: 500px; }
        .sh-subscription-intro > p:not(.sh-section-kicker) { max-width: 490px; margin: 14px 0 24px; color: #5f7465; font-size: 14px; line-height: 1.7; }
        .sh-primary-button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; }
        .sh-plan-card { padding: clamp(25px,4vw,42px); border: 1px solid var(--sh-border); border-radius: 22px; }
        .sh-plan-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 13px; background: var(--sh-pale-green); color: var(--sh-green); font-size: 25px; }
        .sh-plan-card h3 { margin: 20px 0 10px; font-size: 22px; }
        .sh-plan-card > p { color: var(--sh-muted); font-size: 13px; line-height: 1.7; }
        .sh-plan-card > a { display: inline-block; margin-top: 8px; color: var(--sh-green); font-size: 13px; font-weight: 750; }
        .sh-plan-card > a span { margin-left: 6px; }
        .sh-plan-note { margin-top: 22px; padding-top: 15px; border-top: 1px solid var(--sh-border); font-size: 11px !important; }
        .sh-footer { margin-top: 75px; padding: 38px clamp(20px,5vw,76px); border-top: 1px solid var(--sh-border); }
        .sh-footer-inner { max-width: 1288px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .sh-footer-copy { color: var(--sh-muted); font-size: 12px; line-height: 1.8; }
        .sh-footer-links { display: flex; flex-wrap: wrap; gap: 22px; color: #52675a; font-size: 12px; font-weight: 600; }
        @media (max-width: 1050px) {
          .sh-carousel-item { flex-basis: calc((100% - 40px) / 3); }
          .sh-category-grid, .sh-destination-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .sh-search { grid-template-columns: repeat(2,minmax(0,1fr)); }
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
          .sh-section-heading { align-items: start; flex-direction: column; gap: 15px; }
          .sh-section-actions { width: 100%; justify-content: space-between; }
          .sh-carousel-item { flex-basis: 76%; }
          .sh-carousel-track { gap: 13px; }
          .sh-property-info { padding: 12px; }
          .sh-property-info h3 { font-size: 14px; }
          .sh-property-location { font-size: 10px; }
          .sh-property-price strong { font-size: 13px; }
          .sh-property-price span { display: block; margin-top: 3px; }
          .sh-property-bottom { margin-top: 12px; padding-top: 10px; }
          .sh-featured-label { top: 7px; left: 7px; padding: 6px 7px; font-size: 9px; }
          .sh-category-grid, .sh-destination-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .sh-category-card { min-height: 230px; }
          .sh-category-copy { padding: 14px; }
          .sh-category-copy strong { font-size: 16px; }
          .sh-category-copy > span:not(.sh-category-link) { font-size: 11px; }
          .sh-destination-card { min-height: 230px; }
          .sh-destination-copy { padding: 14px; }
          .sh-destination-copy h3 { font-size: 20px; }
          .sh-subscription-section { grid-template-columns: 1fr; margin-top: 48px; }
          .sh-footer-inner { align-items: start; flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sh-home *, .sh-home *::before, .sh-home *::after { scroll-behavior: auto !important; transition: none !important; }
        }
      `}</style>

      <header className="sh-nav">
     <Link to="/" className="sh-brand" aria-label="Static Holidays homepage">
          <span className="sh-brand-icon">⌂</span>
          <span>
            <span className="sh-brand-name" style={{ display: "block" }}>
              Static Holidays
            </span>
            <span className="sh-brand-caption" style={{ display: "block" }}>
              Your next escape awaits
            </span>
          </span>
       
        </Link>


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

      <BrowseCategories />
      <DestinationSection />

      {loading ? (
        <div className="sh-loading">Discovering lovely places to stay…</div>
      ) : loadError ? (
        <div className="sh-empty">
          We couldn't load the stays right now. Please refresh the page and
          try again.
        </div>
      ) : (
        <>
          {publishedProperties.length === 0 && (
            <div className="sh-empty">
              We're getting more stays ready to welcome you. Explore our
              destinations and check back soon for new listings.
            </div>
          )}

          <PropertyCarousel
            title="Handpicked stays"
            description="Welcoming places for your next UK escape."
            properties={
              featuredProperties.length > 0
                ? featuredProperties
                : latestProperties.slice(0, 8)
            }
          />

          <PropertyCarousel
            title="Dog-friendly stays"
            description="Bring your four-legged companion along."
            properties={dogFriendlyProperties}
            link="/properties?feature=dog-friendly"
          />

          <PropertyCarousel
            title="Charming cottages"
            description="Cosy hideaways and characterful country homes."
            properties={cottageProperties}
            link="/properties?feature=cottages"
          />

          <PropertyCarousel
            title="Hot tub escapes"
            description="Find a little luxury and time to unwind."
            properties={hotTubProperties}
            link="/properties?feature=hot-tub"
          />

          <PropertyCarousel
            title="Equine-friendly stays"
            description="Countryside breaks for horse lovers."
            properties={equineProperties}
            link="/properties?feature=equine"
          />

          <PropertyCarousel
            title="Explore Wales"
            description="Discover stays in Wales, from countryside to coast."
            properties={walesProperties}
            link="/properties?destination=Wales"
          />

          <PropertyCarousel
            title="Discover Scotland"
            description="Find your Highland or lochside escape."
            properties={scotlandProperties}
            link="/properties?destination=Scotland"
          />

          <PropertyCarousel
            title="Lovely stays in Devon"
            description="Find your next countryside or coastal break."
            properties={devonProperties}
            link="/properties?destination=Devon"
          />

          <PropertyCarousel
            title="Cornwall escapes"
            description="Discover charming stays close to the coast."
            properties={cornwallProperties}
            link="/properties?destination=Cornwall"
          />

          <PropertyCarousel
            title="Great stays for less"
            description="Find a lovely place at a price that suits you."
            properties={affordableProperties}
          />

          <PropertyCarousel
            title="Discover more places"
            description="Take a look at the latest published stays."
            properties={latestProperties}
          />
        </>
      )}

      <SubscriptionSection />

      <section className="sh-section">
        <div className="sh-banner-inner">
          <div>
            <h2>Your next chapter starts with a getaway.</h2>
            <p>
              Explore UK holiday homes, peaceful lodges and coastal escapes.
            </p>
          </div>
          <a className="sh-primary-button" href="/properties">
            Explore all stays →
          </a>
        </div>
      </section>

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

