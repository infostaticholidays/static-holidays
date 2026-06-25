import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "Top 10 Dog Friendly Holiday Cottages in Cornwall",
    excerpt: "Discover some of the best dog-friendly cottages across Cornwall.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },

  {
    id: 2,
    title: "Best UK Beach Holidays for Families",
    excerpt: "Our favourite family-friendly beach destinations around the UK.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },

  {
    id: 3,
    title: "How To Save Money On Holiday Accommodation",
    excerpt: "Simple ways to cut costs without sacrificing quality.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  },
];

export default function Blog() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#14532d",
        }}
      >
        Static Holidays Blog
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "20px" }}>
              <h2>{post.title}</h2>

              <p>{post.excerpt}</p>

              <Link to={`/blog/${post.id}`}>
                <button
                  style={{
                    background: "#14532d",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Read More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
