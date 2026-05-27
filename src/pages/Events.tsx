import { Link } from "wouter";

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

      {events.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <div
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <h3>{event.title}</h3>
            <p>{event.location}, {event.county}</p>
            <p>{event.date}</p>
            <p>{event.isFree ? "Free" : `£${event.price}`}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
