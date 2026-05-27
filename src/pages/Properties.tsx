import { useListProperties } from "@workspace/api-client-react";
import { PropertyCard } from "@/components/PropertyCard";
import { useState } from "react";

export default function Properties() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListProperties({
    location: search || undefined,
  });

  return (
    <div className="container mx-auto p-6">
      <input
        className="border p-2 w-full mb-6"
        placeholder="Search location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
