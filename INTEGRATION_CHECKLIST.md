# E2E Integration Checklist - Vintage Market Hub

Prereqs
- Backend running with API_v1 prefix mounted (default: /api/v1)
- Frontend .env configured:
  - REACT_APP_API_BASE_URL=http://<backend-host>:<port>/api/v1
- Backend DB migrated and seeded (regions, categories)

1) Auth
- [ ] Register user A via UI (username is required or derived from email local-part)
- [ ] Login as user A; verify:
  - localStorage.auth_token is present
  - TopNav shows "Auth token present (truncated)" debug chip
  - /auth/me returns current user
- [ ] Register and login user B (separate browser profile/session)

2) Listings
- [ ] Create a listing as user A with valid region_id and category_id UUIDs (from seeded data)
- [ ] Verify listing appears in grid and is viewable in detail page
- [ ] Optionally edit the listing (PATCH) and confirm changes
- [ ] Ensure delete works only for the seller

3) Offers
- [ ] As user B, create an offer on user A’s listing (POST /offers/listings/{listingId}/offers)
- [ ] As user A (seller), counter the offer (POST /offers/{offerId}/counter)
- [ ] As user B, accept or decline; verify Offer status transitions in UI or via GET /offers/{id}
- [ ] Confirm Offers list with mine=true shows relevant offers for current user

4) Swaps
- [ ] Ensure both users have at least one listing each
- [ ] As user A, create a swap proposal (POST /swaps) with payload:
  - proposer_listing_id=<A’s listing UUID>
  - recipient_listing_id=<B’s listing UUID>
- [ ] As user B (counterparty), accept or decline; verify Swap status transitions

5) Checkout / Transactions
- [ ] Start checkout as user B (POST /transactions/checkout) with amount and currency
- [ ] Verify response contains provider, client_secret (mock/stripe-like), and a Transaction with status 'pending'
- [ ] Confirm Transactions page lists the new transaction; status should be pending

6) Notes & Constraints
- Offers messaging/negotiations beyond last_message are mocked in UI
- Listing image upload is stubbed at /listings/{id}/images (not wired in UI)
- Stripe test mode is optional; without keys, mock intents are returned
- CORS origins must include frontend URL

Legend: [x]=done, [~]=partial, [ ]=pending
