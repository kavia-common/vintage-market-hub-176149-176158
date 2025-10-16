# Integration Notes (Frontend <-> Backend)

Base URL
- Frontend expects: `REACT_APP_API_BASE_URL` includes API prefix, e.g. `http://localhost:8000/api/v1`
- All requests in src/api/client.js are relative to this base.

Auth
- POST /auth/register -> UserRead (no tokens)
  - payload: { email, username, full_name?, password }
- POST /auth/login -> { access_token, refresh_token, token_type }
- GET /auth/me -> UserRead using Authorization: Bearer <access_token>
- Frontend hook: src/api/hooks/useAuth.js handles token persistence (auth_token) and me() hydration.

Listings
- POST /listings (auth)
  - payload: ListingCreate with region_id (UUID) and category_id (UUID)
- GET /listings supports filters: search, region, category, price_min, price_max, sort=new|price_asc|price_desc, paging
- PATCH/DELETE /listings/{id} require seller ownership

Offers
- POST /offers/listings/{listing_id}/offers (auth) -> OfferRead
  - payload: { amount }
- POST /offers/{id}/counter -> { amount }
- POST /offers/{id}/accept, /offers/{id}/decline
- GET /offers?mine= filters to buyer or listing seller when true (requires auth)

Swaps
- POST /swaps (auth) -> SwapRead
  - payload: { proposer_listing_id, recipient_listing_id, notes? }
- POST /swaps/{id}/accept or /decline (counterparty only)
- GET /swaps?mine=

Transactions
- POST /transactions/checkout (auth)
  - payload: { listing_id?, amount, currency="USD", metadata? }
  - response: { provider, client_secret?, payment_intent_id, transaction }
- GET /transactions?mine=

Mock / Test Behavior
- Payments service returns a mock client_secret and intent id when Stripe keys are not configured.
- Negotiations threads are minimal; messaging is not fully implemented.

Required Seeds
- regions and categories must exist; ensure backend seeding has been run.
- Listing creation validates region_id and category_id exist; otherwise returns 404.
