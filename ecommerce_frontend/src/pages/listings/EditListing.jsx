import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useListings from "../../api/hooks/useListings";
import ListingForm from "../../components/listings/ListingForm";

/**
// PUBLIC_INTERFACE
 * EditListing
 * Loads an existing listing and allows editing via ListingForm.
 */
export default function EditListing() {
  const { id } = useParams();
  const nav = useNavigate();
  const { actions } = useListings();
  const [initial, setInitial] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const data = await actions.getListing(id);
        if (active) setInitial(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => { active = false; };
  }, [id, actions]);

  const onSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await actions.updateListing(id, payload);
      nav(`/listings/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  if (!initial) return <div className="container"><div className="card">Not found</div></div>;

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <div className="card accent-gradient">
        <h1 className="h1" style={{ margin: 0 }}>Edit Listing</h1>
      </div>
      <ListingForm initial={initial} onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
