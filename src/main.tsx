import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";
import Adverts from "./pages/Adverts";
import Shop from "./pages/Shop";
import Properties from "./pages/Properties";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/adverts" element={<Adverts />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/properties" element={<Properties />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
