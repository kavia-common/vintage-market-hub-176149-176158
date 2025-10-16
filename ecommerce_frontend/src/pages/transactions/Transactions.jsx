import React, { useEffect } from "react";
import useTransactions from "../../api/hooks/useTransactions";

/**
// PUBLIC_INTERFACE
 * Transactions
 * Displays a list of transactions (as buyer or seller) with filters and pagination.
 */
export default function Transactions() {
  const { transactions, total, loading, error, filters, actions } = useTransactions();

  useEffect(() => {
    actions.listTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.page, filters.pageSize]);

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <header className="card accent-gradient" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 className="h1" style={{ margin: 0 }}>Transactions</h1>
          <a href="/checkout" className="btn btn-primary">Start Checkout</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <select className="input" aria-label="Role filter" value={filters.role} onChange={(e) => actions.setRole(e.target.value)}>
            <option value="all">All</option>
            <option value="buyer">Purchases</option>
            <option value="seller">Sales</option>
          </select>
          <select className="input" aria-label="Page size" value={filters.pageSize} onChange={(e) => actions.setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
          </select>
        </div>
      </header>

      {error && <div className="card" role="alert">Error: {String(error.message || error)}</div>}

      <section style={{ display: "grid", gap: 12 }}>
        {loading && <div className="card">Loading...</div>}
        {!loading && transactions.length === 0 && <div className="card">No transactions found.</div>}
        {!loading &&
          transactions.map((t) => <TransactionRow key={t.id} txn={t} />)}
      </section>

      <footer className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="muted">Total: {total}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => actions.setPage(Math.max(1, filters.page - 1))} disabled={filters.page <= 1}>Prev</button>
          <span className="muted" style={{ display: "inline-flex", alignItems: "center" }}>Page {filters.page}</span>
          <button className="btn" onClick={() => actions.setPage(filters.page + 1)} disabled={transactions.length < filters.pageSize}>Next</button>
        </div>
      </footer>
    </div>
  );
}

function TransactionRow({ txn }) {
  const statusColor =
    txn.status === "succeeded"
      ? "var(--color-success)"
      : txn.status === "failed"
      ? "var(--color-error)"
      : "var(--color-primary)";

  return (
    <article className="surface fade-in" style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 12, padding: 12 }}>
      <img
        src={txn?.listing?.image}
        alt={txn?.listing?.title}
        style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 12, border: "1px solid var(--color-border)" }}
      />
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 600, color: "var(--color-text)" }}>
            {txn?.listing?.title}
          </div>
          <span className="muted" style={{ fontSize: 12 }}>
            {new Date(txn?.createdAt || Date.now()).toLocaleString()}
          </span>
        </div>
        <div className="muted" style={{ fontSize: 14 }}>
          Role: {txn.role} · Status: <span style={{ color: statusColor, fontWeight: 600 }}>{txn.status}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="muted">
            Total: {txn.currency || "USD"} {Number(txn.total || 0).toFixed(0)}
          </div>
          <a href={`/checkout?listingId=${txn?.listing?.id}&amount=${txn?.total || txn?.listing?.price || 0}`} className="btn btn-ghost">Buy again</a>
        </div>
      </div>
    </article>
  );
}
