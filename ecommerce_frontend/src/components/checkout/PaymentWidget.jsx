import React, { useEffect } from "react";

/**
// PUBLIC_INTERFACE
 * PaymentWidget
 * Placeholder payment widget container that expects a clientSecret prop and renders a mock payment UI.
 * Replace this with a real payment provider integration (e.g., Stripe Elements) when available.
 *
 * Props:
 *  - clientSecret: string (required) - token used by the payment provider to render/confirm the payment
 *  - amount?: number
 *  - currency?: string
 *  - onSuccess?: (payload) => void
 *  - onError?: (error) => void
 */
export default function PaymentWidget({ clientSecret, amount, currency = "USD", onSuccess, onError }) {
  useEffect(() => {
    // In a real integration, initialize provider here using the clientSecret.
    if (!clientSecret) return;
    // eslint-disable-next-line no-console
    console.info("PaymentWidget initialized with clientSecret:", clientSecret);
  }, [clientSecret]);

  if (!clientSecret) {
    return <div className="card" role="alert">Missing clientSecret. Start checkout again.</div>;
  }

  const simulatePayment = async () => {
    try {
      // Simulate network/process delay
      await new Promise((res) => setTimeout(res, 800));
      onSuccess?.({
        status: "succeeded",
        clientSecret,
        amount,
        currency,
        id: `pi_${Math.random().toString(36).slice(2, 8)}`,
      });
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <div className="card" style={{ display: "grid", gap: 12 }}>
      <div className="h2" style={{ margin: 0 }}>Secure Payment</div>
      <div className="muted">Pay {currency} {Number(amount || 0).toFixed(0)}</div>
      <div className="surface" style={{ padding: 16, borderRadius: 12 }}>
        <div className="muted" style={{ fontSize: 14 }}>
          This is a placeholder payment widget using the Cosmic Energy style. Replace with a real provider.
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          <input className="input" placeholder="Card number (mock)" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input className="input" placeholder="MM/YY" />
            <input className="input" placeholder="CVC" />
          </div>
          <button className="btn btn-primary" onClick={simulatePayment}>
            Pay {currency} {Number(amount || 0).toFixed(0)}
          </button>
        </div>
      </div>
      <div className="muted" style={{ fontSize: 12 }}>
        clientSecret: {clientSecret}
      </div>
    </div>
  );
}
