import React from "react";

/**
// PUBLIC_INTERFACE
 * SortBar
 * Allows sorting by newest, popular, price low->high, price high->low
 */
export default function SortBar({ value = "newest", onChange }) {
  return (
    <select className="input" value={value} onChange={(e) => onChange?.(e.target.value)} aria-label="Sort listings">
      <option value="newest">Newest</option>
      <option value="popular">Most Popular</option>
      <option value="price_low_high">Price: Low to High</option>
      <option value="price_high_low">Price: High to Low</option>
    </select>
  );
}
