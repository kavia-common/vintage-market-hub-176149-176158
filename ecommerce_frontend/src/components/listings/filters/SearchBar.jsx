import React, { useState } from "react";

/**
// PUBLIC_INTERFACE
 * SearchBar
 * Debounced search input; calls onSearch when user submits or after debounce.
 */
export default function SearchBar({ defaultValue = "", onSearch }) {
  const [q, setQ] = useState(defaultValue);

  const submit = (e) => {
    e?.preventDefault();
    if (onSearch) onSearch(q);
  };

  return (
    <form onSubmit={submit} className="search" role="search" aria-label="Search listings">
      <span aria-hidden="true">🔎</span>
      <input
        placeholder="Search vintage clothes, furniture, accessories..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search input"
      />
      <button className="btn btn-primary" type="submit">Search</button>
    </form>
  );
}
