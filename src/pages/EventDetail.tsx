export default function EventDetail() {
  const id = window.location.pathname.split("/").pop();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Event #{id}</h1>
      <p>This is a working event detail page.</p>

      <a href="/events">Back to Events</a>
    </div>
  );
}
