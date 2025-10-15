import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
export default function BottomNav() {
  /** Mobile bottom navigation inspired by modern marketplaces */
  const items = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/listings", label: "Listings", icon: "🛍️" },
    { to: "/offers", label: "Offers", icon: "💬" },
    { to: "/swaps", label: "Swaps", icon: "🔄" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="bottomnav surface bottomnav-bar">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-item ${isActive ? "active" : ""}`}
          end={item.to === "/"}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
