import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useOffers from "../../api/hooks/useOffers";
import OfferForm from "../../components/offers/OfferForm";

/**
// PUBLIC_INTERFACE
 * NegotiationThread
 * Shows the conversation for a specific offer thread with message history and ability to send message or counter.
 */
export default function NegotiationThread() {
  const { threadId } = useParams();
  const { thread, threadMessages, loading, error, actions } = useOffers();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        await actions.getThread(threadId);
      } finally {
        // noop
      }
    }
    load();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const send = async ({ amount, currency, text }) => {
    setSubmitting(true);
    try {
      await actions.sendMessage(threadId, { text, amount, currency });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !thread) return <div className="container"><div className="card">Loading...</div></div>;
  if (error && !thread) return <div className="container"><div className="card" role="alert">Error: {String(error.message || error)}</div></div>;
  if (!thread) return <div className="container"><div className="card">Thread not found</div></div>;

  const listing = thread.listing;

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <header className="card accent-gradient" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={listing?.image} alt={listing?.title} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 12, border: "1px solid var(--color-border)" }} />
          <div>
            <div className="h2" style={{ margin: 0 }}>{listing?.title}</div>
            <div className="muted">{listing?.currency || "USD"} {Number(listing?.price || 0).toFixed(0)}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/listings/${listing?.id}`} className="btn">View Listing</Link>
          <Link to="/offers" className="btn btn-ghost">Back to Offers</Link>
        </div>
      </header>

      <section className="card" style={{ display: "grid", gap: 12 }}>
        <div className="h2" style={{ margin: 0 }}>Conversation</div>
        <div style={{ display: "grid", gap: 10 }}>
          {threadMessages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {threadMessages.length === 0 && <div className="muted">No messages yet. Start by making an offer.</div>}
        </div>
      </section>

      <OfferForm
        variant="counter"
        initialAmount={thread?.latestOffer?.amount || ""}
        onSubmit={send}
        submitting={submitting}
      />
    </div>
  );
}

function MessageBubble({ msg }) {
  const isBuyer = msg.by === "buyer";
  return (
    <div
      className="surface"
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid var(--color-border)",
        background: isBuyer ? "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(236,72,153,0.06))" : "var(--color-surface)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <strong style={{ color: "var(--color-text)" }}>{isBuyer ? "You" : "Seller"}</strong>
        <span className="muted" style={{ fontSize: 12 }}>{new Date(msg.createdAt).toLocaleString()}</span>
      </div>
      {msg.amount != null && (
        <div className="badge" style={{ marginTop: 6, padding: "4px 8px", borderRadius: 999, background: "rgba(79,70,229,0.08)", color: "var(--color-primary)", display: "inline-block", fontSize: 12 }}>
          Offer: {msg.currency || "USD"} {Number(msg.amount).toFixed(0)}
        </div>
      )}
      {msg.text && <p style={{ marginTop: 8, marginBottom: 0 }}>{msg.text}</p>}
    </div>
  );
}
