import { useParams } from "react-router-dom";

const posts: Record<string, any> = {
  "dog-friendly-cornwall-guide": {
    title: "Dog Friendly Cornwall Guide",
    content: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        caption: "Cornwall coastline - perfect for dog walks",
      },

      {
        type: "section",
        title: "🏖 Best Dog Friendly Beaches",
        text: `Cornwall has some of the best dog beaches in the UK.`,
        list: [
          {
            name: "Perranporth Beach",
            info: "Huge sandy beach, dogs allowed year-round",
            link: "https://visitcornwall.com",
          },
          {
            name: "Watergate Bay",
            info: "Dog-friendly all year, cafes on the beach",
            link: "https://www.watergatebay.co.uk",
          },
          {
            name: "Crantock Beach",
            info: "Quiet, scenic, great for walks",
            link: "https://www.nationaltrust.org.uk",
          },
        ],
      },

      {
        type: "section",
        title: "🍺 Dog Friendly Pubs",
        list: [
          {
            name: "The Watering Hole (Perranporth)",
            info: "Only pub ON a beach in the UK",
            link: "https://www.thewateringhole.co.uk",
          },
          {
            name: "The Merrymoor Inn",
            info: "Great food, dogs welcome",
            link: "https://www.merrymoor.co.uk",
          },
        ],
      },

      {
        type: "section",
        title: "🏡 Nearby Dog Friendly Cottages",
        list: [
          {
            name: "Cornwall Coastal Cottages",
            info: "Enclosed gardens + sea views",
            link: "https://www.sykescottages.co.uk",
          },
        ],
      },
    ],
  },

  "best-walks-in-wales": {
    title: "Best Walks in Wales (Mountains & Waterfalls)",
    content: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        caption: "Snowdonia mountains",
      },

      {
        type: "section",
        title: "⛰ Snowdonia Walks",
        list: [
          {
            name: "Mount Snowdon",
            info: "Highest peak in Wales",
            link: "https://www.visitwales.com",
          },
          {
            name: "Llyn Idwal",
            info: "Easy circular lake walk",
            link: "https://www.nationaltrust.org.uk",
          },
        ],
      },

      {
        type: "section",
        title: "💦 Waterfalls",
        list: [
          {
            name: "Four Waterfalls Walk",
            info: "One of Wales' most famous hikes",
            link: "https://www.breconbeacons.org",
          },
        ],
      },

      {
        type: "section",
        title: "🏡 Local Stays Nearby",
        list: [
          {
            name: "Snowdonia Cottages",
            info: "Cabins & mountain lodges",
            link: "https://www.hoseasons.co.uk",
          },
        ],
      },
    ],
  },

  "best-family-holidays-uk": {
    title: "Best Family Holidays in the UK",
    content: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        caption: "Family theme park fun",
      },

      {
        type: "section",
        title: "🎢 Theme Parks",
        list: [
          {
            name: "Legoland Windsor",
            info: "Perfect for kids aged 3–12",
            link: "https://www.legoland.co.uk",
          },
          {
            name: "Alton Towers",
            info: "UK’s biggest theme park",
            link: "https://www.altontowers.com",
          },
        ],
      },

      {
        type: "section",
        title: "🐘 Zoos & Attractions",
        list: [
          {
            name: "Chester Zoo",
            info: "One of the UK’s best zoos",
            link: "https://www.chesterzoo.org",
          },
          {
            name: "Eden Project (Cornwall)",
            info: "Huge rainforest domes",
            link: "https://www.edenproject.com",
          },
        ],
      },

      {
        type: "section",
        title: "🏡 Family Cottages Nearby",
        list: [
          {
            name: "Family Holiday Cottages UK",
            info: "Near attractions + beaches",
            link: "https://www.hoseasons.co.uk",
          },
        ],
      },
    ],
  },
};

export default function BlogDetail() {
  const { slug } = useParams();
  const post = slug ? posts[slug] : null;

  if (!post) {
    return <h1 style={{ padding: 40 }}>Blog not found</h1>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
      <h1 style={{ color: "#14532d" }}>{post.title}</h1>

      {post.content.map((block: any, i: number) => {
        if (block.type === "image") {
          return (
            <div key={i} style={{ marginBottom: 30 }}>
              <img
                src={block.src}
                style={{ width: "100%", borderRadius: 12 }}
              />
              <p style={{ fontSize: 14, color: "#666" }}>
                {block.caption}
              </p>
            </div>
          );
        }

        if (block.type === "section") {
          return (
            <div key={i} style={{ marginBottom: 40 }}>
              <h2>{block.title}</h2>

              {block.list.map((item: any, j: number) => (
                <div
                  key={j}
                  style={{
                    padding: 15,
                    marginTop: 10,
                    border: "1px solid #eee",
                    borderRadius: 10,
                  }}
                >
                  <h3>{item.name}</h3>
                  <p>{item.info}</p>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#14532d" }}
                  >
                    Visit / Find Location
                  </a>
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
