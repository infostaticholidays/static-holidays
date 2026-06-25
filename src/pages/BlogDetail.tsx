import { useParams } from "react-router-dom";

const posts = {
  1: {
    title: "Top 10 Dog Friendly Holiday Cottages in Cornwall",
    content:
      "Cornwall is one of the UK's best destinations for dog owners. It offers beaches, countryside walks, and plenty of pet-friendly accommodation options. This guide covers the best cottages where dogs are welcome and what to expect when booking."
  },

  2: {
    title: "Best UK Beach Holidays for Families",
    content:
      "Family holidays are all about fun, safety and great beaches. The UK has many coastal destinations that are perfect for children, offering shallow waters, amusement parks, and safe swimming areas."
  },

  3: {
    title: "How To Save Money On Holiday Accommodation",
    content:
      "Booking early and comparing prices can save hundreds. You should also consider off-peak travel, flexible dates, and direct booking with owners to get the best deals."
  }
};

export default function BlogDetail() {
  const { id } = useParams();

  const post = posts[id as keyof typeof posts];

  if (!post) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1>Blog post not found</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 20px"
      }}
    >
      <h1 style={{ color: "#14532d", marginBottom: 20 }}>
        {post.title}
      </h1>

      <p
        style={{
          fontSize: 18,
          lineHeight: 1.8,
          color: "#333"
        }}
      >
        {post.content}
      </p>
    </div>
  );
}
