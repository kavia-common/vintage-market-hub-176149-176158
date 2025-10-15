import React from "react";
import { Link } from "react-router-dom";

/**
// PUBLIC_INTERFACE
 * ProductCard
 * Displays a listing item with image, title, price, likes, and quick actions.
 */
export default function ProductCard({ item }) {
  const { id, title, price, currency = "USD", images = [], likes = 0 } = item || {};
  const img = images[0];

  return (
    <article className="product-card surface fade-in">
      <Link to={`/listings/${id}`} className="product-image" aria-label={`View ${title}`}>
        <img src={img} alt={title} loading="lazy" />
      </Link>
      <div className="product-info">
        <Link to={`/listings/${id}`} className="title">{title}</Link>
        <div className="meta">
          <span className="price">{currency} {Number(price).toFixed(0)}</span>
          <span className="likes" aria-label={`${likes} likes`}>❤️ {likes}</span>
        </div>
        <div className="actions">
          <Link to={`/listings/${id}`} className="btn btn-ghost">View</Link>
          <Link to={`/listings/${id}/edit`} className="btn">Edit</Link>
        </div>
      </div>
    </article>
  );
}
