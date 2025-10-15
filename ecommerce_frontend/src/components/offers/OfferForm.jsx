import React, { useState } from "react";

/**
// PUBLIC_INTERFACE
 * OfferForm
 * Form for creating or countering an offer and sending message context.
 * Props:
 *  - initialAmount
 *  - currency (default USD)
 *  - onSubmit: async ({ amount, currency, note/text })
 *  - submitting
 *  - variant: "create" | "counter"
 */
export default function OfferForm({ initialAmount = "", currency = "USD", onSubmit, submitting = false, variant = "create" }) {
  const [amount, setAmount] = useState(initialAmount);
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit?.({ amount: Number(amount), currency, text });
    setText("");
  };

  return (
    <form className="card" onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <div className="h2" style={{ margin: 0 }}>{variant === "counter" ? "Counter Offer" : "Make an Offer"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label>Offer Amount</label>
          <input className="input" type="number" min="0" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <label>Currency</label>
          <select className="input" value={currency} onChange={(e) => {/* currency fixed for simplicity */}}>
            <option>USD</option>
            <option disabled>EUR</option>
            <option disabled>GBP</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label>Message (optional)</label>
        <textarea className="input" rows={3} placeholder="Add a note for the seller..." value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : variant === "counter" ? "Send Counter" : "Send Offer"}
        </button>
      </div>
    </form>
  );
}
