import React, { useState } from "react";

/**
// PUBLIC_INTERFACE
 * SwapForm
 * Simple form to propose a swap between two listings (IDs) with optional note.
 *
 * Props:
 *  - onSubmit: async ({ myListingId, theirListingId, note })
 *  - submitting
 */
export default function SwapForm({ onSubmit, submitting = false }) {
  const [myListingId, setMyListingId] = useState("");
  const [theirListingId, setTheirListingId] = useState("");
  const [note, setNote] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit?.({ myListingId, theirListingId, note });
    setNote("");
  };

  return (
    <form className="card" onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <div className="h2" style={{ margin: 0 }}>Propose a Swap</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label>Your Listing ID</label>
          <input className="input" value={myListingId} onChange={(e) => setMyListingId(e.target.value)} placeholder="e.g. my-listing-123" required />
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <label>Their Listing ID</label>
          <input className="input" value={theirListingId} onChange={(e) => setTheirListingId(e.target.value)} placeholder="e.g. their-listing-456" required />
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <label>Note (optional)</label>
        <textarea className="input" rows={3} placeholder="Add context to your swap proposal..." value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Send Swap Proposal"}
        </button>
      </div>
    </form>
  );
}
