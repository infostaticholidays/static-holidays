import { useParams } from "react-router-dom";

const posts: Record<string, { title: string; content: string }> = {
  "dog-friendly-cornwall-guide": {
    title: "Dog Friendly Cornwall Guide",
    content:
      "Cornwall is perfect for dog owners. Beaches, pubs and cottages everywhere.",
  },

  "best-dog-friendly-beaches-cornwall": {
    title: "Best Dog Friendly Beaches in Cornwall",
    content:
      "Perranporth, Watergate Bay and Fistral Beach are top dog beaches.",
  },

  "top-dog-friendly-cottages-cornwall": {
    title: "Top Dog Friendly Cottages in Cornwall",
    content:
      "Cornwall has many cottages with gardens and sea views.",
  },

  "save-money-cornwall-holiday": {
    title: "How To Save Money on Cornwall Holidays",
    content:
      "Book early and travel off-season to save money.",
  },
};

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug;

  // 🔴 DEBUG (IMPORTANT)
  console.log("URL SLUG =", slug);

  const post = slug ? posts[slug] : undefined;

  if (!slug) {
    return <h1 style={{ padding: 40 }}>No slug in URL</h1>;
  }

  if (!post) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Blog not found</h1>
        <p>Slug was: {slug}</p>
      </div>
    );
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
