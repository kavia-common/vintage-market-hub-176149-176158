import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "../components/Nav/TopNav";
import SideNav from "../components/Nav/SideNav";
import BottomNav from "../components/Nav/BottomNav";

// Simple placeholder screens
function Screen({ title, description }) {
  return (
    <div className="container">
      <div className="card accent-gradient" style={{ padding: 24, marginTop: 16 }}>
        <h1 className="h1">{title}</h1>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  /**
   * Sets up routing and renders basic shell with Top/Side/Bottom navigation.
   */
  return (
    <BrowserRouter>
      <div className="app-shell">
        <TopNav />
        <SideNav />
        <main className="content" role="main" style={{ padding: "16px" }}>
          <Routes>
            <Route path="/" element={<Screen title="Home" description="Discover vintage treasures curated by your region." />} />
            <Route path="/listings" element={<Screen title="Listings" description="Browse all items for sale in your chosen region." />} />
            <Route path="/offers" element={<Screen title="Offers" description="Negotiate and manage your price offers." />} />
            <Route path="/swaps" element={<Screen title="Swaps" description="Propose and manage item swaps with other users." />} />
            <Route path="/transactions" element={<Screen title="Transactions" description="Track purchases and sales across regions." />} />
            <Route path="/profile" element={<Screen title="Profile" description="Manage your profile, preferences, and settings." />} />
            <Route path="/login" element={<Screen title="Login" description="Access your account and start exploring." />} />
            <Route path="/register" element={<Screen title="Register" description="Create an account to list, buy, and swap items." />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
