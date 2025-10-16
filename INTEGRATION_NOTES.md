# Frontend/Backend Integration Notes

- Base URL:
  - Frontend expects REACT_APP_API_BASE_URL to include the API prefix (e.g., http://localhost:3001/api/v1).
  - Set in ecommerce_frontend/.env.

- CORS:
  - Backend .env allows local frontend origins: http://localhost:3000, http://127.0.0.1:3000 via CORS_ORIGINS.
  - Adjust for deployed preview hosts as needed.

- Auth:
  - Frontend hooks use:
    - POST /auth/login
    - GET /auth/me
    - POST /auth/register
  - Backend provides these under /api/v1/auth/*.

- Listings:
  - Frontend GET /listings with query params: search, sort (new|price_asc|price_desc), page, page_size.
  - POST /listings (create), PATCH /listings/{id} (update), DELETE /listings/{id}, GET /listings/{id}.
  - Backend returns arrays for list endpoints (no {items,total} envelope) — frontend handles both.

- Offers:
  - Create offer: POST /offers/listings/{listingId}/offers with { amount }.
  - List offers: GET /offers with optional filters (status, listing_id, mine).
  - Get offer: GET /offers/{id}.
  - Counter offer: POST /offers/{id}/counter with { amount }.
  - Accept/Decline: POST /offers/{id}/accept or /decline.
  - Backend does not expose a messages endpoint; frontend sendMessage:
    - If amount is provided, uses /offers/{id}/counter.
    - Otherwise, falls back to a UI-only mock message.

- Swaps:
  - Create: POST /swaps with { proposer_listing_id, recipient_listing_id, notes }.
  - List: GET /swaps?mine=true&status=...
  - Get: GET /swaps/{id}
  - Accept/Decline: POST /swaps/{id}/accept or /decline.

- Transactions:
  - Checkout: POST /transactions/checkout with { listing_id, amount, currency }.
  - List: GET /transactions?mine=true&page=...&page_size=...
  - Get: GET /transactions/{id}
  - Returned shape includes client_secret and provider identifiers when applicable.

- OpenAPI:
  - An interfaces/openapi.json exists but appears minimal (only health check). Until a full OpenAPI export is generated, the frontend uses the manual endpoints above. When a full spec is exported, consider generating a typed client and refactoring hooks accordingly.
