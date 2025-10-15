import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useListings from "../../api/hooks/useListings";
import ListingForm from "../../components/listings/ListingForm";

/**
// PUBLIC_INTERFACE
 * NewListing
 * Page to create a listing using ListingForm.
 */
export default function NewListing() {
  const { actions } = useListings();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const created = await actions.createListing(payload);
      nav(`/listings/${created.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <div className="card accent-gradient">
        <h1 className="h1" style={{ margin: 0 }}>Create Listing</h1>
      </div>
      <ListingForm onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
