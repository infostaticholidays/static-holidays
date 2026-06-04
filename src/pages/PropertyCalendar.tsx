import { useParams } from "react-router-dom";

export default function PropertyCalendar() {
  const { propertyId } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Property Calendar</h1>
      <p>Property ID: {propertyId}</p>
    </div>
  );
}
