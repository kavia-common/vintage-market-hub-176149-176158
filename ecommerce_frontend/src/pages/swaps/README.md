# Swaps UI

This module provides a lightweight Swaps interface with placeholder API calls.

- Hook: `src/api/hooks/useSwaps.js`
  - fetchSwaps, createSwap, getSwap, updateSwapStatus
  - Falls back to mocked data if backend is not available
- Pages:
  - `Swaps.jsx`: Lists swap proposals with filters (role/status) and pagination
  - `NewSwap.jsx`: Form to propose a new swap between two listing IDs
- Components:
  - `SwapCard.jsx`: Swap preview and action card
  - `SwapForm.jsx`: Form to create a swap

Routing:
- `/swaps` -> Swaps list
- `/swaps/new` -> Propose a new swap

Styling adheres to the "Cosmic Energy" theme and is responsive.
