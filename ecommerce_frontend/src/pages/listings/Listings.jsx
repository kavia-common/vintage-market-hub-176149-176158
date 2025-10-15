import React from "react";
import { Link } from "react-router-dom";
import useListings from "../../api/hooks/useListings";
import RegionFilter from "../../components/listings/filters/RegionFilter";
import SearchBar from "../../components/listings/filters/SearchBar";
import SortBar from "../../components/listings/filters/SortBar";
import ProductCard from "../../components/listings/ProductCard";

/**
// PUBLIC_INTERFACE
 * Listings Page
 * Displays filters and a responsive grid of product cards.
 */
export default function Listings() {
  const { listings, loading, error, total, filters, actions } = useListings();

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <header className="card accent-gradient" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 className="h1" style={{ margin: 0 }}>Explore Listings</h1>
          <Link to="/listings/new" className="btn btn-primary">+ New Listing</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          <SearchBar defaultValue={filters.search} onSearch={actions.setSearch} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <RegionFilter value={filters.region} onChange={actions.setRegion} />
            <SortBar value={filters.sort} onChange={actions.setSort} />
          </div>
        </div>
      </header>

      {error && <div className="card" role="alert">Error: {String(error.message || error)}</div>}

      <section className="grid-list">
        {loading && <div className="card">Loading...</div>}
        {!loading && listings.length === 0 && <div className="card">No items found.</div>}
        {!loading && listings.map((item) => <ProductCard key={item.id} item={item} />)}
      </section>

      <footer className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="muted">Total: {total}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => actions.setPage(Math.max(1, filters.page - 1))} disabled={filters.page <= 1}>Prev</button>
          <span className="muted" style={{ display: "inline-flex", alignItems: "center" }}>Page {filters.page}</span>
          <button className="btn" onClick={() => actions.setPage(filters.page + 1)} disabled={listings.length < filters.pageSize}>Next</button>
        </div>
      </footer>
    </div>
  );
}
