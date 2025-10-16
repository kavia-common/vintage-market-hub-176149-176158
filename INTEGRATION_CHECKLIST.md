# Integration Checklist - Frontend ↔ Backend

This document captures the verification of environment configuration, CORS, and route path alignment between the React frontend and FastAPI backend.

Status: Verified

1) Frontend .env
- File: ecommerce_frontend/.env
- Current value:
  REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
- Notes:
  The frontend client (src/api/client.js) expects BASE_URL to include the API prefix (/api/v1). The .env file is correct. The .env.example was updated to reflect this so future setups are consistent.

2) Backend .env (CORS)
- File: ecommerce_backend/.env
- Current value:
  CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
- Notes:
  This includes the default CRA dev server origins. FastAPI CORSMiddleware pulls from settings.CORS_ORIGINS and falls back to ["*"] if empty; our explicit list is good. If using a preview host for the frontend, add it to this comma-separated list.

3) API Prefix and Router Inclusion
- File: ecommerce_backend/src/api/main.py
- settings.API_V1_PREFIX = /api/v1
- Routers included with prefix:
  - /auth, /users, /regions, /categories, /listings, /offers, /negotiations, /swaps, /transactions, /webhooks
- Health endpoint is at GET / (not under /api/v1). All other business endpoints are under /api/v1/<router>.

4) Frontend Hooks → Backend Routes Mapping

Base: All paths below are relative to REACT_APP_API_BASE_URL (which already includes /api/v1).

- Auth (src/api/hooks/useAuth.js)
  - POST /auth/login -> backend: POST /api/v1/auth/login ✓
  - POST /auth/register -> backend: POST /api/v1/auth/register ✓
  - GET /auth/me -> backend: GET /api/v1/auth/me ✓
  - Bearer token handling via Authorization header is implemented in client.js ✓

- Listings (src/api/hooks/useListings.js)
  - GET /listings?search=&sort=&page=&page_size= -> backend: GET /api/v1/listings with same query params ✓
    - sort mapping frontend: newest|price_low_high|price_high_low -> backend: new|price_asc|price_desc (conversion implemented) ✓
  - GET /listings/{id} -> backend: GET /api/v1/listings/{id} ✓
  - POST /listings -> backend: POST /api/v1/listings (requires auth and valid region_id/category_id) ✓
  - PATCH /listings/{id} -> backend: PATCH /api/v1/listings/{id} ✓
  - DELETE /listings/{id} -> backend: DELETE /api/v1/listings/{id} ✓

- Offers (src/api/hooks/useOffers.js)
  - GET /offers?role=&status=&page=&pageSize= -> backend: GET /api/v1/offers
    - Mismatch note: Backend supports filters: status, listing_id, mine=true. Frontend uses role and status.
      - Frontend currently attempts to call /offers with role and pageSize; backend will ignore unknown params and return all offers. To filter “mine”, the frontend should pass mine=true when role != all. See MISMATCHES below.
  - POST /offers/listings/{listingId}/offers -> backend: POST /api/v1/offers/listings/{id}/offers ✓
  - GET /offers/{threadId} -> backend: GET /api/v1/offers/{id} ✓
  - POST /offers/{threadId}/counter -> backend: POST /api/v1/offers/{id}/counter ✓
  - Negotiation thread messages:
    - Frontend mock uses sendMessage; backend provides negotiations under /offers/{id}/negotiations (GET/POST). Not currently used by frontend; acceptable as a mock.

- Swaps (src/api/hooks/useSwaps.js)
  - GET /swaps?role=&status= -> backend: GET /api/v1/swaps
    - Mismatch note: Backend supports mine=true and status. Frontend uses role and status. See MISMATCHES.
  - POST /swaps -> backend: POST /api/v1/swaps ✓
  - GET /swaps/{id} -> backend: GET /api/v1/swaps/{id} ✓
  - POST /swaps/{id}/accept -> backend: POST /api/v1/swaps/{id}/accept ✓
  - POST /swaps/{id}/decline -> backend: POST /api/v1/swaps/{id}/decline ✓

- Transactions (src/api/hooks/useTransactions.js)
  - GET /transactions?mine=&page=&page_size= -> backend: GET /api/v1/transactions supports mine, page/page_size are ignored by backend (no pagination) but harmless ✓
  - GET /transactions/{id} -> backend: GET /api/v1/transactions/{id} ✓
  - POST /transactions/checkout -> backend: POST /api/v1/transactions/checkout ✓
    - Frontend normalizes client_secret field name; backend already returns client_secret. ✓

- Regions / Categories (consumers not shown here, but routes exist)
  - GET /regions -> backend: GET /api/v1/regions ✓
  - GET /categories -> backend: GET /api/v1/categories ✓

5) Confirmed Environment/Infra
- Frontend dev server: http://localhost:3000
- Backend expected preview/local: http://localhost:3001
- Frontend REACT_APP_API_BASE_URL includes /api/v1 ensuring client hits correct prefixed routes.

6) Mismatches and Recommendations

- Offers filtering (frontend role vs backend mine):
  - Frontend: role=buyer|seller|all; page/pageSize for pagination
  - Backend: supports mine=true to return offers where current user is buyer or seller; no role dimension and no pagination.
  - Recommendation: when role !== "all", pass mine=true; otherwise omit. Keep status mapping as-is. Accept lack of pagination for now.
  - Current behavior: frontend passes unsupported params (role, pageSize), which backend ignores. Functionally returns unfiltered offers; UI uses mock fallback if errors occur.

- Swaps filtering (frontend role vs backend mine):
  - Frontend: role=mine|theirs|all (conceptually)
  - Backend: supports mine=true; no differentiation between "mine" and "theirs" without additional params.
  - Recommendation: when role !== "all", pass mine=true to at least scope to current user; finer role split requires backend enhancement.

- Negotiation messages:
  - Frontend has sendMessage(threadId, ...) which posts counters to /offers/{id}/counter; backend also supports /offers/{id}/negotiations for messages and counters combined.
  - Recommendation: Consider using /offers/{id}/negotiations for message timeline when building full conversation UI.

No code changes are required for runtime, except .env.example alignment which was updated in this commit. If you deploy to a preview host, update:
- ecommerce_frontend/.env -> REACT_APP_API_BASE_URL=https://<backend-host>/api/v1
- ecommerce_backend/.env -> CORS_ORIGINS=http://localhost:3000,https://<frontend-host>

End of checklist.
