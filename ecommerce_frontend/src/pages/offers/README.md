# Offers & Negotiations UI

This module provides a lightweight Offers and Negotiations UI with placeholder API calls.

- Hook: `src/api/hooks/useOffers.js`
  - fetchOffers, createOffer, getThread, sendMessage
  - Falls back to mocked data if backend is not available
- Pages:
  - `Offers.jsx`: Lists negotiation threads with filters (role/status) and pagination
  - `NegotiationThread.jsx`: Shows a specific thread conversation and allows sending messages/counter offers
- Components:
  - `OfferCard.jsx`: Thread preview card
  - `OfferForm.jsx`: Create or counter offer form

Routing:
- `/offers` -> Offers list
- `/offers/:threadId` -> Conversation thread

Styling adheres to the "Cosmic Energy" theme.
