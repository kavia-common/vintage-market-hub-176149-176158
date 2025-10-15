import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useListings from "../../api/hooks/useListings";

/**
// PUBLIC_INTERFACE
 * ListingDetail
 * Shows a single listing with gallery and details.
 */
export default function ListingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { actions } = useListings();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const data = await actions.getListing(id);
        if (active) setItem(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => { active = false; };
  }, [id, actions]);

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  if (!item) return <div className="container"><div className="card">Not found</div></div>;

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <div className="card accent-gradient" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="h1" style={{ margin: 0 }}>{item.title}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/listings/${id}/edit`} className="btn">Edit</Link>
          <button className="btn btn-ghost" onClick={() => nav(-1)}>Back</button>
        </div>
      </div>

      <section className="detail-layout">
        <div className="detail-gallery surface">
          <img src={item.images?.[0]} alt={item.title} />
        </div>
        <div className="detail-info card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="h2">{item.currency || "USD"} {Number(item.price || 0).toFixed(0)}</div>
            <div className="muted">❤️ {item.likes || 0}</div>
          </div>
          <div className="muted">Category: {item.category} · Condition: {item.condition}</div>
          <p className="mt-md">{item.description}</p>

          <div className="mt-md" style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary">Buy Now</button>
            <button className="btn">Make Offer</button>
            <button className="btn btn-ghost">Swap</button>
          </div>

          <div className="card mt-md">
            <div className="muted">Seller</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>{item.seller?.name || "Unknown"}</div>
              <button className="btn btn-ghost">Message</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
