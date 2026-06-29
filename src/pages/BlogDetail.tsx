import { useParams } from "react-router-dom";

const posts: Record<string, any> = {
  // 🐶 CORNWALL
  "dog-friendly-cornwall-guide": {
    title: "Dog Friendly Cornwall Guide",
    content: `
🐶 DOG FRIENDLY CORNWALL

Cornwall is one of the UK’s best destinations for dog owners.

🏖 BEACHES THAT ALLOW DOGS
- Perranporth Beach (huge, off-lead)
- Watergate Bay (surf + dog friendly cafes)
- Crantock Beach (scenic walks)
- Holywell Bay (quiet & open)

🍺 DOG FRIENDLY PUBS
- The Watering Hole (on the beach)
- The Merrymoor Inn
- The Blue Anchor, Helston

🏡 COTTAGES NEAR DOG AREAS
- Coastal cottages near Newquay
- St Ives countryside cottages
- Padstow dog-friendly stays

👉 BOOK LINKS (example structure)
- https://www.sykescottages.co.uk
- https://www.hoseasons.co.uk

🐕 LOCAL WALKS
- South West Coast Path
- Bedruthan Steps cliffs
- Padstow to Rock ferry walk

✔ Cornwall is perfect for dogs all year round.
    `,
  },

  // 🏔 WALES
  "best-walks-in-wales": {
    title: "Best Walks in Wales (Mountains & Waterfalls)",
    content: `
🏔 BEST WALKS IN WALES

Wales is famous for dramatic landscapes, mountains, lakes and waterfalls.

⛰ SNOWDONIA (ERYRI NATIONAL PARK)
- Snowdon Summit Walk
- Llyn Idwal circular walk
- Tryfan for experienced hikers

💦 BEST WATERFALL WALKS
- Four Waterfalls Walk (Brecon Beacons)
- Henrhyd Falls (Batman cave location)
- Swallow Falls (Betws-y-Coed)

🏘 LOCAL SMALL BUSINESSES TO VISIT
- Betws-y-Coed cafés & bakeries
- Llanberis mountain shops
- Local Welsh craft shops in Beddgelert

🍽 PUBS & FOOD STOPS
- The Heights, Snowdon
- Ye Olde Bull’s Head Inn
- Riverside cafés in Conwy

🏡 NEARBY COTTAGES
- Snowdonia log cabins
- Brecon Beacons farm stays
- Riverside cottages in Betws-y-Coed

🌄 PERFECT FOR:
- Hiking
- Photography
- Waterfall walks
- Nature lovers
    `,
  },

  // 👨‍👩‍👧 FAMILY HOLIDAYS
  "best-family-holidays-uk": {
    title: "Best Family Holidays in the UK",
    content: `
👨‍👩‍👧 BEST FAMILY HOLIDAYS IN THE UK

Perfect places for kids, attractions and family fun.

🎢 THEME PARKS
- Legoland Windsor
- Alton Towers
- Thorpe Park

🐘 ZOOS & ANIMAL PARKS
- Chester Zoo
- Edinburgh Zoo
- Paignton Zoo

🎠 FAMILY ATTRACTIONS
- Warwick Castle
- Blackpool Pleasure Beach
- Eden Project (Cornwall)

🏡 FAMILY COTTAGES NEARBY
- Windsor cottages near Legoland
- Cheshire cottages near Chester Zoo
- Cornwall family beach cottages

🍦 FUN FOR KIDS
- Ice cream farms
- Adventure parks
- Soft play centres
- Coastal beaches

✔ Best for school holidays & weekend trips
    `,
  },
};

export default function BlogDetail() {
  const { slug } = useParams();

  const post = slug ? posts[slug] : null;

  if (!post) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Blog not found</h1>
        <p>Slug: {slug}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 850, margin: "0 auto", padding: 40 }}>
      <h1 style={{ color: "#14532d" }}>{post.title}</h1>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: 17,
          lineHeight: 1.8,
        }}
      >
        {post.content}
      </pre>
    </div>
  );
}
