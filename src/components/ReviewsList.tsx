import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ReviewsList({ propertyId }: { propertyId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (propertyId) fetchReviews();
  }, [propertyId]);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setReviews(data || []);
  }

  return (
    <div style={{ marginTop: 40, padding: 20, border: "2px solid green", borderRadius: 10 }}>
      <h2>⭐ Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet for this property.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} style={{ marginTop: 10 }}>
            <p>⭐ {r.rating}/5</p>
            <p>{r.review_text}</p>
          </div>
        ))
      )}
    </div>
  );
}
