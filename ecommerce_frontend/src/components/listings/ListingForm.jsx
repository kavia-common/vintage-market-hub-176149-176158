import React, { useState } from "react";

/**
// PUBLIC_INTERFACE
 * ListingForm
 * Reusable form for creating and editing listings.
 * Props:
 *  - initial: initial values
 *  - onSubmit: async function(payload)
 */
export default function ListingForm({ initial = {}, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    price: initial.price || "",
    currency: initial.currency || "USD",
    region: initial.region || "Global",
    condition: initial.condition || "Good",
    category: initial.category || "Clothing",
    description: initial.description || "",
    images: initial.images || [],
  });
  const [imageUrl, setImageUrl] = useState("");

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const addImage = () => {
    if (!imageUrl) return;
    setForm(prev => ({ ...prev, images: [...(prev.images || []), imageUrl] }));
    setImageUrl("");
  };
  const removeImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit?.(form);
  };

  return (
    <form className="card" onSubmit={submit} style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <label>Title</label>
        <input className="input" value={form.title} onChange={(e) => setField("title", e.target.value)} required />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px", gap: 12 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <label>Price</label>
          <input className="input" type="number" step="1" value={form.price} onChange={(e) => setField("price", e.target.value)} required />
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <label>Currency</label>
          <select className="input" value={form.currency} onChange={(e) => setField("currency", e.target.value)}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <label>Region</label>
          <select className="input" value={form.region} onChange={(e) => setField("region", e.target.value)}>
            <option>Global</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia</option>
            <option>Oceania</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <label>Condition</label>
          <select className="input" value={form.condition} onChange={(e) => setField("condition", e.target.value)}>
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <label>Category</label>
          <select className="input" value={form.category} onChange={(e) => setField("category", e.target.value)}>
            <option>Clothing</option>
            <option>Furniture</option>
            <option>Accessories</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <label>Description</label>
        <textarea className="input" rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} />
      </div>

      <div className="card accent-gradient" style={{ display: "grid", gap: 12 }}>
        <label>Images</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 10 }}>
          <input className="input" placeholder="Paste image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button className="btn" type="button" onClick={addImage}>Add Image</button>
        </div>
        {form.images?.length > 0 && (
          <div className="gallery-grid">
            {form.images.map((src, idx) => (
              <div className="gallery-item" key={src + idx}>
                <img src={src} alt={`listing-${idx}`} />
                <button type="button" className="btn btn-ghost" onClick={() => removeImage(idx)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Listing"}</button>
      </div>
    </form>
  );
}
