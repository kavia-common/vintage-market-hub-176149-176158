import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
export default function SideNav() {
  /** Desktop side navigation listing the primary routes */
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Listings" },
    { to: "/offers", label: "Offers" },
    { to: "/swaps", label: "Swaps" },
    { to: "/transactions", label: "Transactions" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <aside className="sidenav">
      <div className="sidenav-panel">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `navlink ${isActive ? "active" : ""}`
            }
            end={item.to === "/"}
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
