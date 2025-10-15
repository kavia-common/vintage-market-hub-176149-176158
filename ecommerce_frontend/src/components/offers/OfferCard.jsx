import React from "react";
import { Link } from "react-router-dom";

/**
// PUBLIC_INTERFACE
 * OfferCard
 * Displays a negotiation thread summary with listing image, title, last message, latest offer, status.
 * Props:
 *  - thread: {
 *      id, listing: { id, title, image, price, currency },
 *      lastMessage: { text, createdAt },
 *      latestOffer: { amount, currency, by },
 *      status: "open" | "accepted" | "declined",
 *      participants: { buyer, seller }
 *    }
 */
export default function OfferCard({ thread }) {
  if (!thread) return null;
  const { id, listing, lastMessage, latestOffer, status } = thread;
  const statusColor =
    status === "accepted" ? "var(--color-success)" :
    status === "declined" ? "var(--color-error)" :
    "var(--color-primary)";

  return (
    <article className="surface offer-card fade-in" style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 12, padding: 12 }}>
      <Link to={`/listings/${listing?.id}`} className="offer-thumb" aria-label={`View ${listing?.title}`}>
        <img src={listing?.image} alt={listing?.title} style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 12, border: "1px solid var(--color-border)" }} />
      </Link>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <Link to={`/offers/${id}`} className="title" style={{ fontWeight: 600, color: "var(--color-text)" }}>
            {listing?.title}
          </Link>
          <span className="muted" style={{ fontSize: 12 }}>{new Date(thread.updatedAt || Date.now()).toLocaleString()}</span>
        </div>

        <div className="muted" style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {lastMessage?.text || "No messages yet"}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge" style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(79,70,229,0.08)", color: "var(--color-primary)", fontSize: 12 }}>
              Latest: {latestOffer?.currency || "USD"} {Number(latestOffer?.amount || 0).toFixed(0)}
            </span>
            <span className="muted" style={{ fontSize: 12 }}>Listed: {listing?.currency || "USD"} {Number(listing?.price || 0).toFixed(0)}</span>
          </div>
          <span style={{ fontWeight: 600, color: statusColor, textTransform: "capitalize" }}>{status}</span>
        </div>
      </div>
    </article>
  );
}
