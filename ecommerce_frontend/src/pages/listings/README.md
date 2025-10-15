# Listings UI

This folder contains pages for listings:
- Listings.jsx: grid with filters (Region, Search, Sort), pagination and create button
- ListingDetail.jsx: detail view with gallery and quick actions
- NewListing.jsx / EditListing.jsx: forms using ListingForm

Components used:
- ProductCard.jsx
- filters/RegionFilter.jsx
- filters/SearchBar.jsx
- filters/SortBar.jsx
- ListingForm.jsx

Data:
- useListings hook under src/api/hooks/useListings.js handles placeholder API calls and provides mocked data when backend endpoints are unavailable. Replace endpoints with real backend integration when available.
