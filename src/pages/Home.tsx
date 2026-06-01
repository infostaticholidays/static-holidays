import { useState, useEffect } from "react";

export default function Home() {
  const slides = [
    {
      title: "⭐ Top Rated Coastal Caravan",
      subtitle: "Rated 4.9/5 by guests",
      price: "From £89/night",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      title: "☀️ Summer Half-Term Deal",
      subtitle: "Save up to 35% this summer",
      price: "From £79/night",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
      title: "⭐ Best Reviewed Lake Lodge",
      subtitle: "Perfect for family stays",
      price: "From £120/night",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
    },
  ];

  const [index, setIndex] = useState(0);

  // auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>

      {/* SLIDESHOW */}
      <div
        style={{
          position: "relative",
          height: "420px",
          overflow: "hidden",
          borderRadius: "16px",
          margin: "40px",
        }}
      >
        <img
          src={slides[index].image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* DARK OVERLAY */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "white",
          }}
        >
          <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>
            {slides[index].title}
          </h2>

          <p style={{ fontSize: "18px" }}>
            {slides[index].subtitle}
          </p>

          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            {slides[index].price}
          </p>
        </div>
      </div>

      {/* DOTS */}
      <div style={{ marginBottom: "40px" }}>
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              height: "10px",
              width: "10px",
              margin: "5px",
              display: "inline-block",
              borderRadius: "50%",
              background: i === index ? "#16a34a" : "#ccc",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
