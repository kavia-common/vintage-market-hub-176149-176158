import React from "react";
import { Link } from "react-router-dom";
import useSwaps from "../../api/hooks/useSwaps";
import SwapCard from "../../components/swaps/SwapCard";

/**
// PUBLIC_INTERFACE
 * Swaps
 * Displays list of swap proposals with role/status filters and pagination. Provides quick actions to accept/decline/cancel.
 */
export default function Swaps() {
  const { swaps, total, loading, error, filters, actions } = useSwaps();

  const onAccept = async (id) => actions.updateSwapStatus(id, "accepted");
  const onDecline = async (id) => actions.updateSwapStatus(id, "declined");
  const onCancel = async (id) => actions.updateSwapStatus(id, "cancelled");

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <header className="card accent-gradient" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 className="h1" style={{ margin: 0 }}>Swaps</h1>
          <Link to="/swaps/new" className="btn btn-primary">+ New Swap</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <select className="input" aria-label="Role filter" value={filters.role} onChange={(e) => actions.setRole(e.target.value)}>
            <option value="all">All</option>
            <option value="mine">Proposed by Me</option>
            <option value="theirs">Proposed to Me</option>
          </select>
          <select className="input" aria-label="Status filter" value={filters.status} onChange={(e) => actions.setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </header>

      {error && <div className="card" role="alert">Error: {String(error.message || error)}</div>}

      <section style={{ display: "grid", gap: 12 }}>
        {loading && <div className="card">Loading...</div>}
        {!loading && swaps.length === 0 && <div className="card">No swaps found.</div>}
        {!loading && swaps.map((s) => (
          <SwapCard key={s.id} swap={s} onAccept={onAccept} onDecline={onDecline} onCancel={onCancel} />
        ))}
      </section>

      <footer className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="muted">Total: {total}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => actions.setPage(Math.max(1, filters.page - 1))} disabled={filters.page <= 1}>Prev</button>
          <span className="muted" style={{ display: "inline-flex", alignItems: "center" }}>Page {filters.page}</span>
          <button className="btn" onClick={() => actions.setPage(filters.page + 1)} disabled={swaps.length < filters.pageSize}>Next</button>
        </div>
      </footer>
    </div>
  );
}
