import { Link } from "react-router-dom";

export default function Bookings() {
return (
<main style={{ padding: "40px 24px", maxWidth: 900, margin: "0 auto" }}>
<h1>My Bookings</h1>

  <p>Your bookings will appear here.</p>

  <p>
    <Link to="/">Back to Home</Link>
  </p>
</main>

);
}
