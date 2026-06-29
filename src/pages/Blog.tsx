import { Link } from "react-router-dom";

const posts = [
  {
    slug: "dog-friendly-cornwall-guide",
    title: "Dog Friendly Cornwall Guide",
    excerpt:
      "Discover beaches, pubs, restaurants and cottages in Cornwall that welcome dogs.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },

  {
    slug: "best-dog-friendly-beaches-cornwall",
    title: "Best Dog Friendly Beaches in Cornwall",
    excerpt:
      "Explore Cornwall’s most beautiful beaches where dogs are welcome all year round.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },

  {
    slug: "top-dog-friendly-cottages-cornwall",
    title: "Top 10 Dog Friendly Holiday Cottages in Cornwall",
    excerpt:
      "A handpicked selection of the best dog-friendly cottages across Cornwall.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },

  {
    slug: "save-money-cornwall-holiday",
    title: "How To Save Money on a Cornwall Dog Friendly Holiday",
    excerpt:
      "Simple ways to enjoy Cornwall without overspending.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  },
];

export default function Blog() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
      <h1 style={{ textAlign: "center", color: "#14532d" }}>
        Cornwall Dog Friendly Blog
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 30,
          marginTop: 30,
        }}
      >
        {posts.map((post) => (
          <div
            key={post.slug}
            style={{
              background: "white",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={post.image}
              style={{ width: "100%", height: 220, objectFit: "cover" }}
            />

            <div style={{ padding: 20 }}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>

              <Link to={`/blog/${post.slug}`}>
                <button
                  style={{
                    background: "#14532d",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Read Article
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
