# E2E Integration Checklist - Vintage Market Hub

1) Listings
- [x] List: Frontend GET /listings matches backend array response.
- [x] Detail: GET /listings/:id works with mock fallback.
- [x] Create: Mapped payload to backend schema; requires region_id/category_id UUIDs.
- [x] Update: PATCH uses snake_case mapping.
- [ ] Region/Category UUID selection: pending hook + UI mapping.
- [ ] Auth guard for create/update: pending integration.

2) Offers
- [x] List offers: GET /offers with optional mine/status.
- [x] Create offer: POST /offers/listings/{listingId}/offers.
- [x] Counter offer: POST /offers/{offerId}/counter.
- [x] Accept/Decline: POST /offers/{offerId}/accept|decline.
- [~] Messages: No backend endpoint; UI simulates history.

3) Swaps
- [~] UI present with mock hooks. Backend endpoints not validated in this pass.

4) Transactions / Checkout
- [x] Start checkout: POST /transactions/checkout; normalized client_secret/payment_intent_id.
- [x] Transactions list: GET /transactions with optional mine=true.
- [ ] Receipt page: optional follow-up.

5) Payments
- [x] Mock provider path supported when Stripe keys absent.
- [ ] Real Stripe test mode: requires STRIPE_SECRET_KEY and webhook handling in local env.

6) Media
- [~] Listing image upload: backend stub implemented; UI uses URL paste. Full static serving TBD.

7) Cross-cutting
- [x] CORS includes frontend origin (per task notes).
- [ ] Error toasts/snackbars: minimal; can be enhanced.

Legend: [x]=done, [~]=partial, [ ]=pending
