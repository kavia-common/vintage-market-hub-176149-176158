import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTransactions from "../../api/hooks/useTransactions";
import PaymentWidget from "../../components/checkout/PaymentWidget";

/**
// PUBLIC_INTERFACE
 * Checkout
 * Starts a checkout session for a listing and renders the PaymentWidget with the returned clientSecret.
 * Query params supported (for demo): listingId, amount, currency
 */
export default function Checkout() {
  const nav = useNavigate();
  const { search } = useLocation();
  const { actions, loading, error } = useTransactions();

  const qp = useMemo(() => new URLSearchParams(search), [search]);
  const initial = {
    listingId: qp.get("listingId") || "",
    amount: Number(qp.get("amount") || 0),
    currency: qp.get("currency") || "USD",
  };

  const [form, setForm] = useState(initial);
  const [clientSecret, setClientSecret] = useState("");
  const [txnId, setTxnId] = useState("");

  useEffect(() => {
    // If we have query params pre-filled and amount positive, we can auto-start.
    if (form.listingId && form.amount > 0 && !clientSecret) {
      void handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleStart = async (e) => {
    e?.preventDefault();
    if (!form.listingId || !form.amount) return;
    try {
      const { clientSecret: cs, transactionId } = await actions.startCheckout({
        listingId: form.listingId,
        amount: form.amount,
        currency: form.currency,
      });
      setClientSecret(cs);
      setTxnId(transactionId || "");
    } catch {
      // error state is handled via error var
    }
  };

  const handleSuccess = (payload) => {
    // Navigate to transactions list after success, or show receipt
    // For demo, just go back to Transactions
    nav("/transactions");
  };

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <header className="card accent-gradient" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="h1" style={{ margin: 0 }}>Checkout</h1>
        <a href="/transactions" className="btn btn-ghost">Back to Transactions</a>
      </header>

      {error && <div className="card" role="alert">Error: {String(error.message || error)}</div>}

      {!clientSecret && (
        <form className="card" onSubmit={handleStart} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px", gap: 12 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label>Listing ID</label>
              <input
                className="input"
                placeholder="e.g. mock-1"
                value={form.listingId}
                onChange={(e) => setField("listingId", e.target.value)}
                required
              />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label>Amount</label>
              <input
                className="input"
                type="number"
                min="1"
                step="1"
                value={form.amount || ""}
                onChange={(e) => setField("amount", Number(e.target.value))}
                required
              />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label>Currency</label>
              <select className="input" value={form.currency} onChange={(e) => setField("currency", e.target.value)}>
                <option>USD</option>
                <option disabled>EUR</option>
                <option disabled>GBP</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Starting..." : "Start Checkout"}
            </button>
          </div>
        </form>
      )}

      {!!clientSecret && (
        <div style={{ display: "grid", gap: 12 }}>
          <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="h2" style={{ margin: 0 }}>Payment Session</div>
              <div className="muted" style={{ fontSize: 14 }}>Transaction: {txnId || "N/A"}</div>
            </div>
            <button className="btn btn-ghost" onClick={() => setClientSecret("")}>Restart</button>
          </div>
          <PaymentWidget
            clientSecret={clientSecret}
            amount={form.amount}
            currency={form.currency}
            onSuccess={handleSuccess}
            onError={() => {}}
          />
        </div>
      )}
    </div>
  );
}
