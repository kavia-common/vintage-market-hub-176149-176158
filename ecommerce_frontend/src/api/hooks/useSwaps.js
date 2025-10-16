import { useCallback, useEffect, useMemo, useState } from "react";
import http from "../client";

/**
// PUBLIC_INTERFACE
 * useSwaps
 * Hook to manage swap proposals and threads with placeholder API calls.
 *
 * Exposes:
 *  - swaps, total, loading, error, filters
 *  - actions:
 *      fetchSwaps({ role, status, page, pageSize })
 *      createSwap({ myListingId, theirListingId, note })
 *      getSwap(id)
 *      updateSwapStatus(id, status) // accept | decline | cancel
 *
 * Endpoints (placeholder):
 *  - GET /swaps
 *  - POST /swaps
 *  - GET /swaps/:id
 *  - PATCH /swaps/:id
 */
export default function useSwaps(initial = {}) {
  const [swaps, setSwaps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    role: initial.role || "all", // buyer/seller equivalent -> initiator/recipient -> "mine" | "theirs" | "all"
    status: initial.status || "all", // open | accepted | declined | cancelled | all
    page: initial.page || 1,
    pageSize: initial.pageSize || 20,
  });

  const fetchSwaps = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);
    const params = { ...filters, ...overrides };
    try {
      const q = new URLSearchParams();
      if (params.status && params.status !== "all") q.set("status", params.status);
      if (params.role && params.role !== "all") q.set("mine", "true");

      try {
        // Backend supports mine boolean and status
        const res = await http.get(`/swaps?${q.toString()}`);
        const data = Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data)
          ? res.data
          : [];
        setSwaps(data);
        setTotal(res.data?.total || data.length);
      } catch {
        const mock = generateMockSwaps(params);
        setSwaps(mock.items);
        setTotal(mock.total);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createSwap = useCallback(async ({ myListingId, theirListingId, note = "" }) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.post("/swaps", { proposer_listing_id: myListingId, recipient_listing_id: theirListingId, notes: note });
        await fetchSwaps();
        return res.data;
      } catch {
        // Mock create
        const created = buildMockSwap(`swap-${Date.now()}`, {
          myListingId,
          theirListingId,
          status: "open",
          note,
          role: "mine",
        });
        setSwaps(prev => [created, ...prev]);
        setTotal(t => t + 1);
        return created;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSwaps]);

  const getSwap = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.get(`/swaps/${id}`);
        return res.data;
      } catch {
        return buildMockSwap(id, { status: "open" });
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSwapStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      try {
        let res;
        if (status === "accepted" || status === "accept") {
          res = await http.post(`/swaps/${id}/accept`);
        } else if (status === "declined" || status === "reject" || status === "decline") {
          res = await http.post(`/swaps/${id}/decline`);
        } else {
          // No direct backend route; fall back to mock update
          throw new Error("Unsupported status transition via API");
        }
        await fetchSwaps();
        return res.data;
      } catch {
        // Mock update
        setSwaps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        return { id, status };
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSwaps]);

  useEffect(() => {
    fetchSwaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.status, filters.page, filters.pageSize]);

  const setRole = useCallback((role) => setFilters(f => ({ ...f, role, page: 1 })), []);
  const setStatus = useCallback((status) => setFilters(f => ({ ...f, status, page: 1 })), []);
  const setPage = useCallback((page) => setFilters(f => ({ ...f, page })), []);
  const setPageSize = useCallback((pageSize) => setFilters(f => ({ ...f, pageSize })), []);

  const value = useMemo(() => ({
    swaps, total, loading, error, filters,
    actions: { fetchSwaps, createSwap, getSwap, updateSwapStatus, setRole, setStatus, setPage, setPageSize }
  }), [swaps, total, loading, error, filters, fetchSwaps, createSwap, getSwap, updateSwapStatus, setRole, setStatus, setPage, setPageSize]);

  return value;
}

function buildMockSwap(id, { myListingId = "mock-1", theirListingId = "mock-2", status = "open", note = "", role = "mine" } = {}) {
  const listingA = {
    id: myListingId,
    title: "Vintage Denim Jacket",
    image: `https://picsum.photos/seed/swap-a-${myListingId}/600/600`,
    price: 75,
    currency: "USD",
  };
  const listingB = {
    id: theirListingId,
    title: "Retro Armchair",
    image: `https://picsum.photos/seed/swap-b-${theirListingId}/600/600`,
    price: 240,
    currency: "USD",
  };
  return {
    id,
    mine: role === "mine" ? listingA : listingB,
    theirs: role === "mine" ? listingB : listingA,
    status, // open | accepted | declined | cancelled
    note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateMockSwaps(params) {
  const all = Array.from({ length: 10 }).map((_, i) =>
    buildMockSwap(`swap-${i + 1}`, {
      myListingId: `mock-${(i % 5) + 1}`,
      theirListingId: `mock-${((i + 1) % 5) + 1}`,
      status: ["open", "accepted", "declined", "open"][i % 4],
      role: ["mine", "theirs", "mine", "theirs"][i % 4],
      note: ["Let's trade?", "Looks cool!", "Interested in swapping?", "Can add cash on top."][i % 4],
    })
  );

  let items = all;
  if (params.role !== "all") {
    items = items.filter(s => (params.role === "mine" ? s.mine : s.theirs));
  }
  if (params.status !== "all") {
    items = items.filter(s => s.status === params.status);
  }

  const start = ((params.page || 1) - 1) * (params.pageSize || 20);
  const page = items.slice(start, start + (params.pageSize || 20));
  return { items: page, total: items.length };
}
