import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./state/AuthContext";
import { RegionProvider } from "./state/RegionContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RegionProvider>
        <App />
      </RegionProvider>
    </AuthProvider>
  </React.StrictMode>
);
