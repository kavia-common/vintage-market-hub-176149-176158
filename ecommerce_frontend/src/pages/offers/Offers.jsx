import React from "react";
import { Link } from "react-router-dom";
import useOffers from "../../api/hooks/useOffers";
import OfferCard from "../../components/offers/OfferCard";

/**
// PUBLIC_INTERFACE
 * Offers
 * Displays a list of negotiation threads for buyer/seller with filters for role and status.
 */
export default function Offers() {
  const { offers, total, loading, error, filters, actions } = useOffers();

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <header className="card accent-gradient" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 className="h1" style={{ margin: 0 }}>Offers & Negotiations</h1>
          <Link to="/listings" className="btn">Browse Listings</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <select className="input" aria-label="Role filter" value={filters.role} onChange={(e) => actions.setRole(e.target.value)}>
            <option value="buyer">As Buyer</option>
            <option value="seller">As Seller</option>
            <option value="all">All</option>
          </select>
          <select className="input" aria-label="Status filter" value={filters.status} onChange={(e) => actions.setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </header>

      {error && <div className="card" role="alert">Error: {String(error.message || error)}</div>}

      <section style={{ display: "grid", gap: 12 }}>
        {loading && <div className="card">Loading...</div>}
        {!loading && offers.length === 0 && <div className="card">No negotiations yet.</div>}
        {!loading && offers.map((t) => <OfferCard key={t.id} thread={t} />)}
      </section>

      <footer className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="muted">Total: {total}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => actions.setPage(Math.max(1, filters.page - 1))} disabled={filters.page <= 1}>Prev</button>
          <span className="muted" style={{ display: "inline-flex", alignItems: "center" }}>Page {filters.page}</span>
          <button className="btn" onClick={() => actions.setPage(filters.page + 1)} disabled={offers.length < filters.pageSize}>Next</button>
        </div>
      </footer>
    </div>
  );
}
