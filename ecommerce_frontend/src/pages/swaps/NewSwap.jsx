import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useSwaps from "../../api/hooks/useSwaps";
import SwapForm from "../../components/swaps/SwapForm";

/**
// PUBLIC_INTERFACE
 * NewSwap
 * Page to propose a new swap using SwapForm.
 */
export default function NewSwap() {
  const { actions } = useSwaps();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ myListingId, theirListingId, note }) => {
    setSubmitting(true);
    try {
      const created = await actions.createSwap({ myListingId, theirListingId, note });
      // After creation, return to Swaps list for simplicity
      nav(`/swaps`);
      return created;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <div className="card accent-gradient" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="h1" style={{ margin: 0 }}>Propose Swap</h1>
        <Link to="/swaps" className="btn btn-ghost">Back</Link>
      </div>
      <SwapForm onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
