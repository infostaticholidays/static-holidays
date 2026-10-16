
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  title?: string;
  name?: string;
  location?: string;
  price_per_night?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  bedrooms?: number;
  max_guests?: number;
};

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select("*");

      if (!error && data) {
        setProperties(data as Property[]);
      }

      setLoading(false);
    }

    loadProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const title = property.title || property.name || "";
    const location = property.location || "";
    const price = property.price_per_night ?? 0;

    const matchesSearch =
      `${title} ${location}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());

    const matchesGuests =
      !guests || (property.max_guests ?? 0) >= Number(guests);

    const matchesPrice =
      !maxPrice || price <= Number(maxPrice);

    return matchesSearch && matchesGuests && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#222820]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#faf9f6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Static Holidays
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link to="/properties" className="font-medium">
              Explore stays
            </Link>
            <Link to="/login" className="text-[#656960] hover:text-black">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#7b806f]">
            Find your next escape
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-6xl">
            Somewhere special
            <br />
            is waiting.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#686b62] md:text-lg">
            Discover welcoming places to stay, from peaceful countryside
            retreats to memorable coastal escapes.
          </p>
        </div>

        <section className="mt-10 rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
            <label className="block text-sm font-medium">
              Destination
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Where would you like to go?"
                className="mt-2 w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 font-normal outline-none transition focus:border-[#626b50]"
              />
            </label>

            <label className="block text-sm font-medium">
              Guests
              <select
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 font-normal outline-none focus:border-[#626b50]"
              >
                <option value="">Any number</option>
                <option value="1">1+ guests</option>
                <option value="2">2+ guests</option>
                <option value="4">4+ guests</option>
                <option value="6">6+ guests</option>
                <option value="8">8+ guests</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Max per night
              <select
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 font-normal outline-none focus:border-[#626b50]"
              >
                <option value="">Any price</option>
                <option value="100">£100</option>
                <option value="150">£150</option>
                <option value="200">£200</option>
                <option value="300">£300</option>
                <option value="500">£500</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setGuests("");
                setMaxPrice("");
              }}
              className="rounded-xl bg-[#343d2d] px-6 py-3 font-medium text-white transition hover:bg-[#4b5740]"
            >
              Clear filters
            </button>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
                Places to stay
              </h2>
              <p className="mt-2 text-sm text-[#77796f]">
                {loading
                  ? "Finding your next escape..."
                  : `${filteredProperties.length} ${
                      filteredProperties.length === 1
                        ? "stay"
                        : "stays"
                    } to explore`}
              </p>
            </div>

            <Link
              to="/"
              className="hidden text-sm underline underline-offset-4 md:inline"
            >
              Back to home
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-2xl bg-[#e9e8e1]" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-[#e9e8e1]" />
                  <div className="mt-3 h-4 w-1/3 rounded bg-[#e9e8e1]" />
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-medium">
                No stays found just yet
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#77796f]">
                Try another destination or clear your filters to see all
                available properties.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setGuests("");
                  setMaxPrice("");
                }}
                className="mt-6 rounded-xl bg-[#343d2d] px-5 py-3 text-sm font-medium text-white hover:bg-[#4b5740]"
              >
                Show all stays
              </button>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => {
                const title =
                  property.title || property.name || "Holiday stay";
                const image =
                  property.image_url || property.images?.[0];

                return (
                  <Link
                    key={property.id}
                    to={`/property/${property.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e9e8e1]">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#77796f]">
                          Image coming soon
                        </div>
                      )}

                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium">
                        Holiday stay
                      </span>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-medium">
                          {title}
                        </h3>
                        <p className="mt-1 text-sm text-[#77796f]">
                          {property.location || "Location available on request"}
                        </p>
                        {property.bedrooms != null && (
                          <p className="mt-2 text-sm text-[#77796f]">
                            {property.bedrooms}{" "}
                            {property.bedrooms === 1 ? "bedroom" : "bedrooms"}
                            {property.max_guests != null
                              ? ` · Up to ${property.max_guests} guests`
                              : ""}
                          </p>
                        )}
                      </div>

                      {property.price_per_night != null && (
                        <p className="shrink-0 text-sm">
                          <span className="text-lg font-semibold">
                            £{property.price_per_night}
                          </span>
                          <span className="text-[#77796f]"> / night</span>
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-16 border-t border-black/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-[#77796f] sm:flex-row sm:items-center sm:justify-between md:px-8">
          <Link to="/" className="font-medium text-[#222820]">
            Static Holidays
          </Link>
          <p>Find somewhere you'll remember.</p>
        </div>
      </footer>
    </div>
  );
}
