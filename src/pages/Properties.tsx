import { useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { useListProperties } from "@/lib/api";

export default function Properties() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListProperties({
    location: search || undefined,
  });

  return (
    <div className="container mx-auto p-6">
      {/* SEARCH BAR */}
      <input
        className="border p-2 w-full mb-6 rounded-md"
        placeholder="Search location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LOADING */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {data?.properties?.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
