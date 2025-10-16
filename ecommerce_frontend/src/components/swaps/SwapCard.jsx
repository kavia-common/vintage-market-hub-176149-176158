import React from "react";

/**
// PUBLIC_INTERFACE
 * SwapCard
 * Displays a swap proposal between two listings with status and quick actions.
 *
 * Props:
 *  - swap: {
 *      id, mine: { id, title, image, price, currency },
 *      theirs: { id, title, image, price, currency },
 *      status: "open" | "accepted" | "declined" | "cancelled",
 *      updatedAt
 *    }
 *  - onAccept(id)
 *  - onDecline(id)
 *  - onCancel(id)
 */
export default function SwapCard({ swap, onAccept, onDecline, onCancel }) {
  if (!swap) return null;
  const { id, mine, theirs, status, updatedAt } = swap;

  const statusColor =
    status === "accepted" ? "var(--color-success)" :
    status === "declined" ? "var(--color-error)" :
    status === "cancelled" ? "var(--color-text-muted)" :
    "var(--color-primary)";

  return (
    <article className="surface fade-in" style={{ display: "grid", gap: 12, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div className="h2" style={{ margin: 0 }}>Swap Proposal</div>
        <span className="muted" style={{ fontSize: 12 }}>{new Date(updatedAt || Date.now()).toLocaleString()}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", gap: 12, alignItems: "center" }}>
        <ListingMini item={mine} label="Yours" />
        <div style={{ textAlign: "center", color: "var(--color-primary)" }}>↔️</div>
        <ListingMini item={theirs} label="Theirs" />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ fontWeight: 600, color: statusColor, textTransform: "capitalize" }}>{status}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {status === "open" && (
            <>
              <button className="btn btn-primary" onClick={() => onAccept?.(id)}>Accept</button>
              <button className="btn" onClick={() => onDecline?.(id)}>Decline</button>
              <button className="btn btn-ghost" onClick={() => onCancel?.(id)}>Cancel</button>
            </>
          )}
          {status !== "open" && (
            <button className="btn btn-ghost" onClick={() => onCancel?.(id)}>Close</button>
          )}
        </div>
      </div>
    </article>
  );
}

function ListingMini({ item, label }) {
  return (
    <div className="surface" style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, padding: 8, borderRadius: 12, border: "1px solid var(--color-border)" }}>
      <img
        src={item?.image}
        alt={item?.title}
        style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, border: "1px solid var(--color-border)" }}
      />
      <div style={{ display: "grid", gap: 4 }}>
        <div className="muted" style={{ fontSize: 12 }}>{label}</div>
        <div style={{ fontWeight: 600, color: "var(--color-text)" }}>{item?.title}</div>
        <div className="muted" style={{ fontSize: 12 }}>{item?.currency || "USD"} {Number(item?.price || 0).toFixed(0)}</div>
      </div>
    </div>
  );
}
