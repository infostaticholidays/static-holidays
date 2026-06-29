import { useParams } from "react-router-dom";

const posts: Record<
  string,
  { title: string; content: string }
> = {
  "dog-friendly-cornwall-guide": {
    title: "Dog Friendly Cornwall Guide",
    content: `
Cornwall is one of the best destinations in the UK for dog owners.

With miles of coastline, sandy beaches, countryside walks and dog-friendly pubs, it’s perfect for a holiday with your dog.

🐶 WHY CORNWALL IS PERFECT FOR DOGS

Cornwall is extremely dog friendly compared to many UK regions. You’ll find:
- Beaches that allow dogs year-round
- Hundreds of dog-friendly cottages
- Coastal walking paths (South West Coast Path)
- Dog-welcoming pubs and cafes

🏖 BEST DOG FRIENDLY BEACHES

Some of the best beaches for dogs include:

- Perranporth Beach – huge open space, great for long walks
- Watergate Bay – surfing and off-lead areas
- Fistral Beach (seasonal restrictions)
- Holywell Bay – quieter and more relaxed
- Crantock Beach – scenic and spacious

🍺 DOG FRIENDLY PUBS

Cornwall is full of pubs that welcome dogs:
- The Watering Hole (on the beach!)
- The Merrymoor Inn
- The Tartan Fox

Many offer water bowls, treats and outdoor seating.

🏡 DOG FRIENDLY COTTAGES

When booking accommodation, look for:
- Enclosed gardens
- Near-beach location
- Dog-welcome policy (no extra stress)
- Washing facilities for sandy paws

🌄 THINGS TO DO WITH YOUR DOG

- Coastal walks along cliffs
- Visit dog-friendly gardens
- Explore fishing villages like Padstow and St Ives
- Walk sections of the South West Coast Path

🐕 FINAL THOUGHTS

Cornwall is one of the best UK destinations for dog owners. Whether you want beaches, walks or relaxing pubs, it has everything for a perfect dog-friendly holiday.
    `,
  },

  "best-dog-friendly-beaches-cornwall": {
    title: "Best Dog Friendly Beaches in Cornwall",
    content: "Add your beach article here...",
  },

  "top-dog-friendly-cottages-cornwall": {
    title: "Top Dog Friendly Cottages in Cornwall",
    content: "Add your cottages article here...",
  },

  "save-money-cornwall-holiday": {
    title: "How To Save Money on Cornwall Holidays",
    content: "Add your money saving article here...",
  },
};

export default function BlogDetail() {
  const { slug } = useParams();

  const post = slug ? posts[slug] : null;

  if (!post) {
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <h1>Blog post not found</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px",
        fontFamily: "Arial",
        lineHeight: 1.8,
      }}
    >
      <h1 style={{ color: "#14532d", marginBottom: 20 }}>
        {post.title}
      </h1>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: 18,
          color: "#333",
        }}
      >
        {post.content}
      </pre>
    </div>
  );
}
