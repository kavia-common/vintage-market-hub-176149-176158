# Integration Preview Notes - Step 4.2

This document captures end-to-end validation results across running previews and any small code/config adjustments applied.

Changes applied
- Listings (frontend)
  - Added mapFormToBackend in useListings to send snake_case and backend-expected fields.
  - ListingForm now supports optional region_id and category_id UUID fields in a developer-only panel. UI continues to use human-readable region/category for now.
- Offers (frontend)
  - Confirmed routes to backend:
    - Create: POST /offers/listings/{listingId}/offers { amount }
    - Counter: POST /offers/{offerId}/counter { amount }
    - Accept: POST /offers/{offerId}/accept
    - Decline: POST /offers/{offerId}/decline
  - Hook already aligned; clarified inline comment that messages endpoint is not present on backend; simulated local message append kept for UX continuity.
- Checkout (frontend)
  - Normalized response mapping to backend CheckoutResponse { client_secret, payment_intent_id, provider, transaction }.

Validated flows
- Listings
  - GET /listings: Frontend tolerates array or {items,total}. Backend returns array; OK.
  - GET /listings/:id: OK.
  - POST /listings: Requires Authorization + region_id/category_id UUIDs. UI provides dev-only fields; when unset, mock path still works.
  - PATCH /listings/:id: Authorization required; payload mapped to backend keys.
- Offers
  - List, create, counter, accept/decline wired to backend paths. Ownership auth is required on backend.
- Checkout
  - POST /transactions/checkout: mapped correctly; response normalized. Mock path still available if backend not reachable.

Remaining gaps / follow-ups
- UUID wiring for Region/Category:
  - UI still presents human-readable options. Need to fetch regions and categories and map selections to UUIDs; then pass region_id/category_id consistently.
- Auth:
  - Backend listings/offers/transactions protected routes require valid Bearer tokens; ensure login/register and token storage are working in the preview environment.
- Images:
  - Backend image upload is stubbed; UI currently manages image URLs only. Complete upload flow and static serving to be implemented later.
- Negotiation messages:
  - Backend lacks message thread storage; UI simulates messages. Add messages model/endpoint if conversational history is required.
- Pagination totals:
  - Backend list endpoints return arrays; UI can show counts but server-side totals would improve UX.

Checklist next
- Implement Regions/Categories fetching hooks and wire to ListingForm selects with UUIDs.
- Add auth guard/redirection on create/update actions.
- Optional: transactions/checkout success view (receipt).

