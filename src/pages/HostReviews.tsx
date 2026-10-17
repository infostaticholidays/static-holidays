
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Review = {
  id: string;
  rating: number | null;
  review_text: string | null;
  created_at: string | null;
  property_id: string | null;
};

export default function HostReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReviews() {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setErrorMessage("Please sign in to view your guest reviews.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, review_text, created_at, property_id")
        .eq("reviewed_user_id", userData.user.id)
        .eq("review_type", "guest_to_owner")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Could not load host reviews:", error);
        setErrorMessage("We couldn't load your reviews. Please try again later.");
      } else {
        setReviews((data || []) as Review[]);
      }

      setLoading(false);
    }

    loadReviews();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Link to="/host-dashboard">← Back to Host Dashboard</Link>

      <h1 style={{ marginTop: 24 }}>Guest Reviews</h1>
      <p>Reviews guests have left for your properties.</p>

      {loading && <p>Loading reviews…</p>}

      {!loading && errorMessage && (
        <p role="alert">{errorMessage}</p>
      )}

      {!loading && !errorMessage && reviews.length === 0 && (
        <p>You don't have any guest reviews yet.</p>
      )}

      {!loading && !errorMessage && reviews.length > 0 && (
        <div>
          {reviews.map((review) => (
            <article
              key={review.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 18,
                marginTop: 16,
              }}
            >
              <p>
                <strong>Rating:</strong>{" "}
                {review.rating == null
                  ? "Not provided"
                  : `${review.rating}/5`}
              </p>

              {review.created_at && (
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              )}

              <p>{review.review_text || "No written comment was provided."}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
