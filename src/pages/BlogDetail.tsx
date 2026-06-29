import { useParams } from "react-router-dom";

const posts: Record<string, any> = {
  "dog-friendly-cornwall-guide": {
    title: "Dog Friendly Cornwall Guide",
    content:
      "Cornwall is perfect for dog owners. Beaches, cliffs, pubs, walking trails...",
  },

  "best-dog-friendly-beaches-cornwall": {
    title: "Best Dog Friendly Beaches in Cornwall",
    content:
      "Perranporth, Watergate Bay and Fistral Beach are top dog beaches...",
  },

  "top-dog-friendly-cottages-cornwall": {
    title: "Top Dog Friendly Cottages in Cornwall",
    content:
      "Cornwall has hundreds of cottages with enclosed gardens and sea views...",
  },
};

export default function BlogDetail() {
  const { slug } = useParams();

  const post = slug ? posts[slug] : null;

  if (!post) {
    return <h1 style={{ padding: 40 }}>Not found</h1>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
      <h1 style={{ color: "#14532d" }}>{post.title}</h1>

      <p style={{ fontSize: 18, lineHeight: 1.8 }}>
        {post.content}
      </p>
    </div>
  );
}
