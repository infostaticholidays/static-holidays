import { useState } from "react";
import { supabase } from "../supabaseClient";

type Props = {
  bookingId: string;
  propertyId: string;
  reviewerId: string;
  reviewedUserId: string;
};

export default function GuestReviewForm({
  bookingId,
  propertyId,
  reviewerId,
  reviewedUserId,
}: Props) {
  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [respect, setRespect] = useState(5);
  const [reviewText, setReviewText] = useState("");

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId,
      property_id: propertyId,

      reviewer_id: reviewerId,
      reviewed_user_id: reviewedUserId,

      review_type: "guest_to_owner",

      verified_stay: true,
      booking_completed: true,

      rating,
      cleanliness_rating: cleanliness,
      communication_rating: communication,
      accuracy_rating: accuracy,
      respect_rating: respect,

      review_text: reviewText,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Thank you for your review!");

    setRating(5);
    setCleanliness(5);
    setCommunication(5);
    setAccuracy(5);
    setRespect(5);
    setReviewText("");
  }

  return (
    <form
      onSubmit={submitReview}
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 30,
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <h2>Review your stay</h2>

      <label>Overall Rating</label>
      <input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />

      <label>Cleanliness</label>
      <input
        type="number"
        min={1}
        max={5}
        value={cleanliness}
        onChange={(e) => setCleanliness(Number(e.target.value))}
      />

      <label>Communication</label>
      <input
        type="number"
        min={1}
        max={5}
        value={communication}
        onChange={(e) => setCommunication(Number(e.target.value))}
      />

      <label>Accuracy</label>
      <input
        type="number"
        min={1}
        max={5}
        value={accuracy}
        onChange={(e) => setAccuracy(Number(e.target.value))}
      />

      <label>Respect</label>
      <input
        type="number"
        min={1}
        max={5}
        value={respect}
        onChange={(e) => setRespect(Number(e.target.value))}
      />

      <label>Your Review</label>

      <textarea
        rows={6}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <br />
      <br />

      <button
        type="submit"
        style={{
          background: "#14532d",
          color: "white",
          padding: "12px 25px",
          border: "none",
          borderRadius: 8,
        }}
      >
        Submit Review
      </button>
    </form>
  );
}
