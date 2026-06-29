import { useParams } from "react-router-dom";

const posts: Record<string, { title: string; content: string }> = {
  "dog-friendly-cornwall-guide": {
    title: "Dog Friendly Cornwall Guide",
    content: `
Cornwall is one of the best places in the UK for dog-friendly holidays.

🏖 Beaches:
- Perranporth Beach
- Watergate Bay
- Crantock Beach

🍺 Pubs:
- The Watering Hole
- The Merrymoor Inn

🏡 Cottages:
Cornwall has thousands of dog-friendly cottages with enclosed gardens.

🐕 Why Cornwall is perfect:
- Coastal walks
- Dog-friendly attractions
- Open beaches all year round

It is one of the best destinations for dog owners in the UK.
    `,
  },

  "best-dog-friendly-beaches-cornwall": {
    title: "Best Dog Friendly Beaches in Cornwall",
    content:
      "Perranporth, Watergate Bay and Fistral Beach are the top dog-friendly beaches in Cornwall.",
  },

  "top-dog-friendly-cottages-cornwall": {
    title: "Top Dog Friendly Cottages in Cornwall",
    content:
      "Cornwall offers many cottages with enclosed gardens, sea views and walking access.",
  },
};

export default function BlogDetail() {
  const { slug } = useParams();

  console.log("SLUG:", slug);

  const post = slug ? posts[slug] : undefined;

  if (!post) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Blog not found</h1>
        <p>Slug received: {slug}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ color: "#14532d", marginBottom: 20 }}>
        {post.title}
      </h1>

      <div
        style={{
          fontSize: 18,
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
          color: "#333",
        }}
      >
        {post.content}
      </div>
    </div>
  );
}
