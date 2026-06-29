import { Link } from "react-router-dom";

const posts = [
  {
    slug: "dog-friendly-cornwall-guide",
    title: "Dog Friendly Cornwall Guide",
    excerpt: "Beaches, pubs, walks and cottages that allow dogs",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },

  {
    slug: "best-walks-in-wales",
    title: "Best Walks in Wales (Mountains & Waterfalls)",
    excerpt: "Snowdonia, Brecon Beacons, waterfalls & hidden gems",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },

  {
    slug: "best-family-holidays-uk",
    title: "Best Family Holidays in the UK",
    excerpt: "Theme parks, zoos, attractions & family cottages",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
];

export default function Blog() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
      <h1 style={{ color: "#14532d" }}>Travel Blog</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
          marginTop: 20,
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
                background: "white",
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
