

import { useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  bookingId: string;
  propertyId: string;
  reviewerId: string;
  reviewedUserId: string;
};

export default function OwnerReviewForm({
  bookingId,
  propertyId,
  reviewerId,
  reviewedUserId,
}: Props) {
  const [rating, setRating] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [respect, setRespect] = useState(5);
  const [care, setCare] = useState(5);
  const [reviewText, setReviewText] = useState("");

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId,
      property_id: propertyId,
      reviewer_id: reviewerId,
      reviewed_user_id: reviewedUserId,
      review_type: "owner_to_guest",
      verified_stay: true,
      booking_completed: true,
      rating,
      communication_rating: communication,
      respect_rating: respect,
      cleanliness_rating: care,
      review_text: reviewText,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Thank you for reviewing your guest!");

    setRating(5);
    setCommunication(5);
    setRespect(5);
    setCare(5);
    setReviewText("");
  }

  return (
    <form onSubmit={submitReview}>
      <h2>Review your guest</h2>

      <label>Overall rating (1–5)</label>
      <input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        required
      />

      <label>Communication (1–5)</label>
      <input
        type="number"
        min={1}
        max={5}
        value={communication}
        onChange={(e) => setCommunication(Number(e.target.value))}
        required
      />

      <label>Respect for the property (1–5)</label>
      <input
        type="number"
        min={1}
        max={5}
        value={respect}
        onChange={(e) => setRespect(Number(e.target.value))}
        required
      />

      <label>Care of the property (1–5)</label>
      <input
        type="number"
        min={1}
        max={5}
        value={care}
        onChange={(e) => setCare(Number(e.target.value))}
        required
      />

      <label>Review comments</label>
      <textarea
        rows={5}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <button type="submit">Submit Guest Review</button>
    </form>
  );
}
