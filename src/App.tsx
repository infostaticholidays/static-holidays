import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";
import HolidayOwners from "./pages/HolidayOwners";
import HostLogin from "./pages/HostLogin";
import Login from "./pages/Login";
import HostDashboard from "./pages/HostDashboard";
import Signup from "./pages/Signup";
import GuestDashboard from "./pages/GuestDashboard";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);

    window.addEventListener("popstate", syncPath);
    window.addEventListener("pushstate", syncPath); // IMPORTANT FIX

    return () => {
      window.removeEventListener("popstate", syncPath);
      window.removeEventListener("pushstate", syncPath);
    };
  }, []);

  const go = (url: string) => {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new Event("pushstate")); // IMPORTANT FIX
    setPath(url);
  };

  return (
    <div>
      <header>
        <button onClick={() => go("/")}>Home</button>
        <button onClick={() => go("/properties")}>Properties</button>
        <button onClick={() => go("/login")}>Login</button>
        <button onClick={() => go("/signup")}>Signup</button>
      </header>

      {path === "/" && <Home />}
      {path === "/properties" && <Properties />}
      {path === "/adverts" && <Adverts />}
      {path === "/shop" && <Shop />}
      {path === "/holidayowners" && <HolidayOwners />}
      {path === "/host-login" && <HostLogin />}
      {path === "/host-dashboard" && <HostDashboard />}
      {path === "/guest-dashboard" && <GuestDashboard />}
      {path === "/login" && <Login />}
      {path === "/signup" && <Signup />}
    </div>
  );
}
