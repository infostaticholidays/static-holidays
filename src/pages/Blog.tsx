import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "Top 10 Dog Friendly Holiday Cottages in Cornwall",
    excerpt:
      "Discover some of the best dog-friendly cottages across Cornwall.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    id: 2,
    title: "Best UK Beach Holidays for Families",
    excerpt:
      "Our favourite family-friendly beach destinations around the UK.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    id: 3,
    title: "How To Save Money On Holiday Accommodation",
    excerpt:
      "Simple ways to cut costs without sacrificing quality.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
  },
];

export default function Blog() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1>Static Holidays Blog</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            marginBottom: 30,
            border: "1px solid #ddd",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: "100%",
              height: 250,
              objectFit: "cover",
            }}
          />

          <div style={{ padding: 20 }}>
            <h2>{post.title}</h2>

            <p>{post.excerpt}</p>

            <Link to={`/blog/${post.id}`}>
              <button>Read More</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
