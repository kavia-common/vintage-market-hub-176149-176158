import React from "react";
import { Link } from "react-router-dom";
import { useRegion } from "../../state/RegionContext";
import DebugAuthInfo from "../Auth/DebugAuthInfo";

// PUBLIC_INTERFACE
export default function TopNav() {
  /** Top navigation with brand, search, and region selector */
  const { region, setRegion } = useRegion();

  return (
    <header className="topnav surface topnav-bar">
      <div className="container topnav-inner">
        <Link to="/" className="brand" aria-label="Vintage Market Hub Home">
          VintageHub
        </Link>

        <div className="search" role="search">
          <span aria-hidden="true">🔎</span>
          <input
            className=""
            placeholder="Search vintage clothes, furniture, accessories..."
            aria-label="Search"
          />
        </div>

        <div className="region">
          <select
            className="input"
            aria-label="Select region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option>Global</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia</option>
            <option>Oceania</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </div>
          <DebugAuthInfo />
        </div>
      </div>
    </header>
  );
}
