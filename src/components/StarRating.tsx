type Props = {
  rating: number;
};

export default function StarRating({ rating }: Props) {
  return (
    <div style={{ color: "#f59e0b", fontSize: "24px" }}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </div>
  );
}
