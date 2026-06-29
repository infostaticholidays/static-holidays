import { Link } from "react-router-dom";

const posts = [
  {
    slug: "dog-friendly-cornwall-guide",
    title: "Dog Friendly Cornwall Guide",
    excerpt: "Best beaches, pubs and cottages for dogs in Cornwall",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    slug: "best-dog-friendly-beaches-cornwall",
    title: "Best Dog Friendly Beaches in Cornwall",
    excerpt: "Explore Cornwall’s most beautiful dog-friendly beaches",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    slug: "top-dog-friendly-cottages-cornwall",
    title: "Top Dog Friendly Cottages in Cornwall",
    excerpt: "Handpicked cottages perfect for dogs and families",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
];

export default function Blog() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
      <h1 style={{ color: "#14532d" }}>Dog Friendly Cornwall Guides</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={post.image}
                style={{ width: "100%", height: 200, objectFit: "cover" }}
              />

              <div style={{ padding: 15 }}>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
