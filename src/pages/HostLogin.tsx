export default function HostLogin() {
  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      <h1>Holiday Owner Login</h1>

      <input placeholder="Email" style={{ display: "block", margin: "10px 0" }} />
      <input placeholder="Password" type="password" style={{ display: "block", margin: "10px 0" }} />

      <button style={{ background: "#14532d", color: "white", padding: "10px 20px" }}>
        Login
      </button>
    </div>
  );
}
