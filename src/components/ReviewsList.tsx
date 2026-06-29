import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import StarRating from "./StarRating";

type Review = {
  id: string;
  property_id: string;
  rating: number;
  review_text: string;
};

type Props = {
  propertyId: string;
};

export default function ReviewsList({ propertyId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  async function fetchReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  }

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Guest Reviews</h2>

      {reviews.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            background: "#fafafa",
          }}
        >
          <h3>No reviews yet</h3>
          <p>Be the first guest to review this property after your stay.</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <StarRating rating={review.rating} />

            <p style={{ marginTop: 10 }}>{review.review_text}</p>
          </div>
        ))
      )}
    </div>
  );
}
