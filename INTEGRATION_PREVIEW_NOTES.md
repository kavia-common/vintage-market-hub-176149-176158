# Preview Configuration Checklist (Step 4.1)

This document tracks the preview environment configuration between the React frontend and FastAPI backend.

1) Frontend base URL
- File: ecommerce_frontend/.env
- REACT_APP_API_BASE_URL must include the API prefix: /api/v1
- Current: REACT_APP_API_BASE_URL=http://localhost:3001/api/v1 (OK for local dev)

2) Backend CORS origins
- File: ecommerce_backend/.env
- CORS_ORIGINS must include your frontend preview origin(s).
- Current: http://localhost:3000, http://127.0.0.1:3000, https://vscode-internal-15579-beta.beta01.cloud.kavia.ai:3000 (updated)

3) Frontend API hooks path validation
- Hooks call these endpoints relative to REACT_APP_API_BASE_URL:
  - Auth: /auth/login, /auth/register, /auth/me
  - Listings: /listings with query params search, sort, page, page_size (backend also supports region/category UUIDs)
  - Offers: 
    - GET /offers?status=&mine=
    - POST /offers/listings/{listingId}/offers
    - GET /offers/{id}
    - POST /offers/{id}/counter, /accept, /decline
  - Swaps:
    - GET /swaps?status=&mine=
    - POST /swaps
    - GET /swaps/{id}
    - POST /swaps/{id}/accept, /decline
  - Transactions:
    - GET /transactions?mine=
    - GET /transactions/{id}
    - POST /transactions/checkout
- All paths match backend routers under /api/v1. No unsupported params used.

4) Remaining discrepancies / notes
- If backend is not running on localhost:3001 when using cloud previews, update REACT_APP_API_BASE_URL to the backend’s public URL (include /api/v1).
- Offers "thread" view in the frontend normalizes Offer data; there isn’t a separate messages endpoint yet—UI uses mock messages when sending plain text messages without counters.
- Image upload for listings is a stub (/listings/{id}/images) and won’t serve images unless a static mount is added.

Operational tips
- After changing .env files, restart dev servers to pick up new values.
- For Stripe test mode, backend will return a mock client_secret if STRIPE_SECRET_KEY is not configured, allowing UI checkout flows to proceed.
