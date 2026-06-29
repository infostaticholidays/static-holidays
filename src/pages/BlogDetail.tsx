import { useParams } from "react-router-dom";

const posts: Record<string, { title: string; content: string }> = {
  "dog-friendly-cornwall-guide": {
    title: "Dog Friendly Cornwall Guide",
    content:
      "Cornwall is one of the UK's best destinations for dog owners. Beaches, pubs, cottages and coastal walks make it perfect for dogs.",
  },

  "best-dog-friendly-beaches-cornwall": {
    title: "Best Dog Friendly Beaches in Cornwall",
    content:
      "Perranporth, Watergate Bay and Fistral Beach are among the most dog-friendly beaches in Cornwall.",
  },

  "top-dog-friendly-cottages-cornwall": {
    title: "Top 10 Dog Friendly Holiday Cottages in Cornwall",
    content:
      "Cornwall offers cottages with enclosed gardens, sea views and dog-friendly stays.",
  },

  "save-money-cornwall-holiday": {
    title: "How To Save Money on a Cornwall Dog Friendly Holiday",
    content:
      "Book early, travel off-season, and compare cottages to save money.",
  },
};

export default function BlogDetail() {
  const { slug } = useParams();

  if (!slug || !posts[slug]) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1>Blog post not found</h1>
      </div>
    );
  }

  const post = posts[slug];

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ color: "#14532d", marginBottom: 20 }}>
        {post.title}
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.8, color: "#333" }}>
        {post.content}
      </p>
    </div>
  );
}
