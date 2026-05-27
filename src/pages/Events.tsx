export default function Events() {
  const events = [
    {
      id: 1,
      title: "Cornwall Summer Festival",
      date: "2025-08-10",
      location: "Cornwall",
      county: "Cornwall",
      isFree: true,
      price: 0,
    },
    {
      id: 2,
      title: "Lake District Market",
      date: "2025-08-15",
      location: "Windermere",
      county: "Cumbria",
      isFree: false,
      price: 5,
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1>Events</h1>

      <div style={{ display: "grid", gap: "10px" }}>
        {events.map((event) => (
          <a
            key={event.id}
            href={`/events/${event.id}`}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "black",
            }}
          >
            <h3>{event.title}</h3>
            <p>{event.location}, {event.county}</p>
            <p>{event.date}</p>
            <p>{event.isFree ? "Free" : `£${event.price}`}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
