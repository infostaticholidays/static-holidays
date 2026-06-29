import StarRating from "./StarRating";

const reviews = [
  {
    id: 1,
    name: "Sarah",
    rating: 5,
    review: "Beautiful cottage. Very clean and would definitely return.",
  },
  {
    id: 2,
    name: "John",
    rating: 4,
    review: "Great location and excellent communication.",
  },
];

export default function ReviewsList() {
  return (
    <div style={{ marginTop: 40 }}>
      <h2>Guest Reviews</h2>

      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h3>{review.name}</h3>

          <StarRating rating={review.rating} />

          <p>{review.review}</p>
        </div>
      ))}
    </div>
  );
}
