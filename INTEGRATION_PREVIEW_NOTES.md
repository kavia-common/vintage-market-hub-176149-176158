# Integration Preview Notes

This document captures the verified integration contracts between the React frontend and FastAPI backend to support end-to-end manual validation in running previews.

Backend API base prefix:
- All backend routes are mounted under: {API_V1_PREFIX}, e.g. `/api/v1`
- Ensure the frontend `.env` has:
  - `REACT_APP_API_BASE_URL=http://<backend-host>:<port>/api/v1`

Auth
- Endpoints:
  - POST /auth/register => UserRead (no token returned)
    - payload: { email, username, full_name?, password }
  - POST /auth/login => { access_token, refresh_token, token_type: "bearer" }
    - payload: { email, password }
  - POST /auth/refresh => { access_token, refresh_token, token_type }
    - payload: { refresh_token }
  - GET /auth/me => UserRead (requires Authorization: Bearer <access_token>)
- Frontend:
  - src/api/client.js injects `Authorization: Bearer ${localStorage.auth_token}`
  - src/api/hooks/useAuth.js:
    - Persists received token under localStorage key `auth_token`
    - On login reads `access_token` into token storage; also fetches /auth/me

Listings
- Endpoints:
  - GET /listings with filters: search, region (UUID), category (UUID), price_min/max (decimal), sort=new|price_asc|price_desc, page, page_size
  - GET /listings/{id}
  - POST /listings (auth required)
    - payload ListingCreate: includes region_id and category_id as UUIDs
  - PATCH /listings/{id} (auth required, seller only)
  - DELETE /listings/{id} (auth required, seller only)
- Notes:
  - region_id and category_id must be valid UUIDs that exist (seeded)
  - If not present, backend responds 404 Region/Category not found

Offers
- Endpoints:
  - POST /offers/listings/{listing_id}/offers (auth) -> OfferRead
    - payload: { amount: Decimal }
  - GET /offers?status=&listing_id=&mine= (mine requires auth)
  - GET /offers/{id} (auth; buyer or listing seller)
  - POST /offers/{id}/counter (seller) payload: { amount }
  - POST /offers/{id}/accept (party)
  - POST /offers/{id}/decline (party)

Swaps
- Endpoints:
  - POST /swaps (auth) -> SwapRead
    - payload: { proposer_listing_id: UUID, recipient_listing_id: UUID, notes? }
  - GET /swaps?mine=&status=
  - GET /swaps/{id}
  - POST /swaps/{id}/accept (counterparty only)
  - POST /swaps/{id}/decline (counterparty only)

Transactions (Checkout)
- Endpoint:
  - POST /transactions/checkout (auth) -> { provider, client_secret?, payment_intent_id, transaction }
    - payload: { listing_id?: UUID, amount: Decimal, currency: "USD", metadata?: object }
    - Creates a Transaction with status 'pending'
  - GET /transactions?mine=&status=&listing_id=
  - GET /transactions/{id}
- Notes:
  - If Stripe test key is not set, backend payments service returns a mock client_secret and payment_intent_id; UI can proceed with mock confirmation.

Validation Steps (Preview)
1) Register + Login:
   - Register a new user via UI form; ensure username is derived or provided.
   - Login; verify localStorage.auth_token is set and /auth/me returns user.
2) Create listing:
   - Obtain a valid region_id and category_id UUID from seeded data (via UI or backend listing/region/category endpoints).
   - Create a listing; verify it appears in the grid and can be fetched by detail view.
3) Offer flow:
   - As a different user, create an offer on the listing (/offers/listings/{id}/offers).
   - As seller, use counter (/offers/{offer_id}/counter).
   - As buyer or seller, accept or decline; verify status updates accordingly.
4) Swap flow:
   - As user A (owner of listing A), propose swap with listing B owned by user B via /swaps (payload requires proposer_listing_id A and recipient_listing_id B).
   - As user B (counterparty), accept or decline; verify Swap status transitions.
5) Checkout flow:
   - Start checkout for a listing with amount/currency; ensure response includes provider and client_secret (mock/stripe-like) and Transaction status is 'pending'.
   - UI should reflect pending status in Transactions list; subsequent webhook-based updates are out of scope and mocked.

Observed/Aligned Contracts
- Frontend useAuth expects login to return access_token; backend provides {access_token, refresh_token}. Token storage OK.
- /auth/me works with Bearer token from localStorage 'auth_token' injected by client.js.
- Listing create requires region_id/category_id (UUID). ListingForm should pass UUIDs, not names.
- Offers routes in backend use '/offers/listings/{id}/offers' for creation and '/offers/{id}/counter|accept|decline' for follow-up.
- Swaps create payload field names match useSwaps.js expectations (proposer_listing_id, recipient_listing_id).
- Checkout returns client_secret when provider supports it or mock; frontend PaymentWidget treats both.

Known Limits / Next Steps
- Negotiations thread messaging endpoints are not implemented; UI falls back to mock conversation details.
- Listing images upload is a stub `/listings/{id}/images` and not integrated in UI.
- Real payment confirmation is mocked unless Stripe test key configured; no webhook-driven status transition implemented in UI.
