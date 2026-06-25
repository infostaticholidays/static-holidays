import { useParams } from "react-router-dom";

const posts = {
  1: {
    title: "Top 10 Dog Friendly Holiday Cottages in Cornwall",
    content:
      "Cornwall is one of the UK's best destinations for dog owners...",
  },

  2: {
    title: "Best UK Beach Holidays for Families",
    content:
      "Family holidays are all about fun, safety and great beaches...",
  },

  3: {
    title: "How To Save Money On Holiday Accommodation",
    content:
      "Booking early and comparing prices can save hundreds...",
  },
};

export default function BlogDetail() {
  const { id } = useParams();

  const post = posts[id as keyof typeof posts];

  if (!post) {
    return <h1>Blog post not found</h1>;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1>{post.title}</h1>

      <p
        style={{
          fontSize: 18,
          lineHeight: 1.8,
        }}
      >
        {post.content}
      </p>
    </div>
  );
}
