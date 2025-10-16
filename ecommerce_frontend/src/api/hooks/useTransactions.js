import { useCallback, useMemo, useState } from "react";
import http from "../client";

/**
// PUBLIC_INTERFACE
 * useTransactions
 * Hook to manage transactions and checkout flow with placeholder API calls.
 *
 * Exposes:
 *  - transactions, loading, error, total
 *  - actions:
 *      listTransactions({ page, pageSize, role }) // role: buyer|seller|all
 *      getTransaction(id)
 *      startCheckout({ listingId, amount, currency }) -> { clientSecret, transactionId }
 *
 * Endpoints (placeholder):
 *  - GET /transactions
 *  - GET /transactions/:id
 *  - POST /transactions/checkout
 */
export default function useTransactions(initial = {}) {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    role: initial.role || "all",
    page: initial.page || 1,
    pageSize: initial.pageSize || 20,
  });

  const listTransactions = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      setError(null);
      const params = { ...filters, ...overrides };
      try {
        const query = new URLSearchParams({
          mine: params.role && params.role !== "all" ? "true" : "",
          page: String(params.page),
          page_size: String(params.pageSize),
        }).toString();

        try {
          // Backend supports mine filter; we map role to mine=true if role !== 'all'
          const res = await http.get(`/transactions?${query}`);
          const data = Array.isArray(res.data?.items)
            ? res.data.items
            : Array.isArray(res.data)
            ? res.data
            : [];
          setTransactions(data);
          setTotal(res.data?.total || data.length);
          return { items: data, total: res.data?.total || data.length };
        } catch {
          const mock = generateMockTransactions(params);
          setTransactions(mock.items);
          setTotal(mock.total);
          return mock;
        }
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const getTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.get(`/transactions/${id}`);
        return res.data;
      } catch {
        return buildMockTransaction(id);
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startCheckout = useCallback(async ({ listingId, amount, currency = "USD" }) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.post("/transactions/checkout", { listing_id: listingId, amount, currency });
        // Expecting { clientSecret, transactionId }
        const data = res?.data || {};
        if (!data.clientSecret) {
          // Normalize shape if backend returns something different
          data.clientSecret = res?.data?.client_secret || `mock_secret_${Date.now()}`;
        }
        return data;
      } catch {
        // Mock a checkout response
        return {
          clientSecret: `mock_secret_${Date.now()}`,
          transactionId: `txn_${Math.random().toString(36).slice(2, 9)}`,
          listingId,
          amount,
          currency,
        };
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const setRole = useCallback((role) => setFilters((f) => ({ ...f, role, page: 1 })), []);
  const setPage = useCallback((page) => setFilters((f) => ({ ...f, page })), []);
  const setPageSize = useCallback((pageSize) => setFilters((f) => ({ ...f, pageSize })), []);

  const value = useMemo(
    () => ({
      transactions,
      total,
      loading,
      error,
      filters,
      actions: { listTransactions, getTransaction, startCheckout, setRole, setPage, setPageSize },
    }),
    [transactions, total, loading, error, filters, listTransactions, getTransaction, startCheckout, setRole, setPage, setPageSize]
  );

  return value;
}

function buildMockTransaction(id) {
  return {
    id,
    listing: {
      id: `listing-${(Number(id?.split("_")?.[1]) || 1)}`,
      title: "Vintage Denim Jacket",
      image: "https://picsum.photos/seed/txn/640/640",
      price: 75,
      currency: "USD",
    },
    role: "buyer",
    status: ["processing", "succeeded", "refunded", "failed"][Math.floor(Math.random() * 4)],
    total: 75,
    currency: "USD",
    createdAt: new Date().toISOString(),
  };
}

function generateMockTransactions(params) {
  const base = Array.from({ length: 12 }).map((_, i) => ({
    id: `txn_${i + 1}`,
    listing: {
      id: `mock-${i + 1}`,
      title: ["Vintage Denim Jacket", "Retro Armchair", "Classic Leather Boots", "Mid-century Lamp", "Silk Scarf"][i % 5],
      image: `https://picsum.photos/seed/txn-${i}/600/600`,
      price: [65, 240, 120, 90, 35][i % 5],
      currency: "USD",
    },
    role: ["buyer", "seller"][i % 2],
    status: ["processing", "succeeded", "failed"][i % 3],
    total: [65, 240, 120, 90, 35][i % 5],
    currency: "USD",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  let items = base;
  if (params.role !== "all") {
    items = items.filter((t) => t.role === params.role);
  }
  const start = ((params.page || 1) - 1) * (params.pageSize || 20);
  const page = items.slice(start, start + (params.pageSize || 20));
  return { items: page, total: items.length };
}
