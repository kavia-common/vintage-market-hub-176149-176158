import { useCallback, useEffect, useMemo, useState } from "react";
import http from "../client";

/**
// PUBLIC_INTERFACE
 * useOffers
 * Hook to manage offers and negotiation threads with placeholder API calls.
 * Exposes:
 *  - offers, loading, error
 *  - selectedThread, threadMessages
 *  - actions:
 *      fetchOffers({ role, status, page, pageSize })
 *      createOffer({ listingId, amount, currency, note })
 *      getThread(threadId)
 *      sendMessage(threadId, { text, amount })
 * 
 * Endpoints (placeholder):
 *  - GET /offers
 *  - POST /offers
 *  - GET /offers/:threadId
 *  - POST /offers/:threadId/messages
 */
export default function useOffers(initial = {}) {
  const [offers, setOffers] = useState([]);
  const [total, setTotal] = useState(0);
  const [thread, setThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    role: initial.role || "buyer", // buyer | seller | all
    status: initial.status || "all", // open | accepted | declined | all
    page: initial.page || 1,
    pageSize: initial.pageSize || 20,
  });

  const fetchOffers = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);
    const params = { ...filters, ...overrides };
    try {
      // Backend supports status and mine; role !== 'all' -> mine=true
      const q = new URLSearchParams();
      if (params.status && params.status !== "all") q.set("status", params.status);
      if (params.role && params.role !== "all") q.set("mine", "true");

      try {
        const res = await http.get(`/offers?${q.toString()}`);
        const data = Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data)
          ? res.data
          : [];
        setOffers(data);
        setTotal(res.data?.total || data.length);
      } catch {
        const mock = generateMockOffers(params);
        setOffers(mock.items);
        setTotal(mock.total);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createOffer = useCallback(async ({ listingId, amount, currency = "USD", note = "" }) => {
    setLoading(true);
    setError(null);
    try {
      try {
        // Backend route: POST /offers/listings/{listingId}/offers with { amount }
        const res = await http.post(`/offers/listings/${listingId}/offers`, { amount });
        await fetchOffers();
        return res.data;
      } catch {
        // mock create
        const created = {
          id: `thread-${Date.now()}`,
          listing: {
            id: listingId,
            title: "Vintage Item",
            image: `https://picsum.photos/seed/listing-${listingId}/600/600`,
            price: Math.floor((amount || 50) * 1.3),
            currency,
          },
          lastMessage: {
            text: note || "Offer created",
            createdAt: new Date().toISOString(),
          },
          participants: { buyer: { name: "You" }, seller: { name: "Ava" } },
          status: "open",
          latestOffer: { amount, currency, by: "buyer" },
          updatedAt: new Date().toISOString(),
        };
        setOffers(prev => [created, ...prev]);
        setTotal(t => t + 1);
        return created;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOffers]);

  const getThread = useCallback(async (threadId) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.get(`/offers/${threadId}`);
        const offer = res.data;
        // Normalize to thread-like structure for UI
        const t = {
          id: offer.id,
          listing: { id: offer.listing_id, title: "Listing", image: "", price: offer.amount, currency: offer.currency || "USD" },
          participants: {}, // unknown without additional endpoints
          status: offer.status,
          latestOffer: { amount: offer.amount, currency: offer.currency || "USD" },
          updatedAt: offer.updated_at || offer.created_at,
        };
        setThread(t);
        setThreadMessages([]);
        return { thread: t, messages: [] };
      } catch {
        const mock = generateMockThread(threadId);
        setThread(mock.thread);
        setThreadMessages(mock.messages);
        return mock;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptOffer = useCallback(async (offerId) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.post(`/offers/${offerId}/accept`);
        // Refresh current thread if it's the same id
        if (thread && thread.id === offerId) {
          const offer = res.data;
          setThread((prev) => ({
            ...prev,
            status: offer.status,
            latestOffer: { amount: offer.amount, currency: offer.currency || "USD", by: prev?.latestOffer?.by || "buyer" },
            updatedAt: new Date().toISOString(),
          }));
        }
        await fetchOffers();
        return res.data;
      } catch {
        // Mock accept
        setOffers((prev) => prev.map((t) => (t.id === offerId ? { ...t, status: "accepted" } : t)));
        if (thread && thread.id === offerId) {
          setThread((prev) => ({ ...prev, status: "accepted", updatedAt: new Date().toISOString() }));
        }
        return { id: offerId, status: "accepted" };
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOffers, thread]);

  const declineOffer = useCallback(async (offerId) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.post(`/offers/${offerId}/decline`);
        if (thread && thread.id === offerId) {
          const offer = res.data;
          setThread((prev) => ({
            ...prev,
            status: offer.status,
            latestOffer: { amount: offer.amount, currency: offer.currency || "USD", by: prev?.latestOffer?.by || "buyer" },
            updatedAt: new Date().toISOString(),
          }));
        }
        await fetchOffers();
        return res.data;
      } catch {
        // Mock decline
        setOffers((prev) => prev.map((t) => (t.id === offerId ? { ...t, status: "declined" } : t)));
        if (thread && thread.id === offerId) {
          setThread((prev) => ({ ...prev, status: "declined", updatedAt: new Date().toISOString() }));
        }
        return { id: offerId, status: "declined" };
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOffers, thread]);

  const sendMessage = useCallback(async (threadId, { text, amount = null, currency = "USD" }) => {
    setLoading(true);
    setError(null);
    try {
      try {
        // Backend has no messages endpoint. If amount is provided, treat as a counter offer (seller's perspective).
        // In local demo we allow buyer-side to simulate counter for UI continuity.
        if (amount) {
          const res = await http.post(`/offers/${threadId}/counter`, { amount });
          const offer = res.data;
          const message = {
            id: `msg-${Date.now()}`,
            text: text || `Countered to ${amount}`,
            amount,
            currency,
            by: "buyer",
            createdAt: new Date().toISOString(),
          };
          setThreadMessages(prev => [...prev, message]);
          setThread(prev => ({
            ...prev,
            latestOffer: { amount: offer.amount, currency: currency, by: "buyer" },
            updatedAt: message.createdAt,
            lastMessage: { text: message.text, createdAt: message.createdAt },
          }));
          return message;
        }
        // Otherwise, no-op with mock message to keep UI responsive
        const message = {
          id: `msg-${Date.now()}`,
          text,
          amount,
          currency,
          by: "buyer",
          createdAt: new Date().toISOString(),
        };
        setThreadMessages(prev => [...prev, message]);
        setThread(prev => ({
          ...prev,
          latestOffer: amount ? { amount, currency, by: "buyer" } : prev?.latestOffer,
          updatedAt: message.createdAt,
          lastMessage: { text: message.text, createdAt: message.createdAt },
        }));
        return message;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.status, filters.page, filters.pageSize]);

  const setRole = useCallback((role) => setFilters(f => ({ ...f, role, page: 1 })), []);
  const setStatus = useCallback((status) => setFilters(f => ({ ...f, status, page: 1 })), []);
  const setPage = useCallback((page) => setFilters(f => ({ ...f, page })), []);
  const setPageSize = useCallback((pageSize) => setFilters(f => ({ ...f, pageSize })), []);

  const value = useMemo(() => ({
    offers, total, thread, threadMessages, loading, error, filters,
    actions: { fetchOffers, createOffer, getThread, sendMessage, acceptOffer, declineOffer, setRole, setStatus, setPage, setPageSize }
  }), [offers, total, thread, threadMessages, loading, error, filters, fetchOffers, createOffer, getThread, sendMessage, acceptOffer, declineOffer, setRole, setStatus, setPage, setPageSize]);

  return value;
}

function generateMockOffers(params) {
  const roles = ["buyer", "seller"];
  const base = Array.from({ length: 14 }).map((_, i) => {
    const role = roles[i % 2];
    return {
      id: `thread-${i + 1}`,
      listing: {
        id: `mock-${i + 1}`,
        title: ["Vintage Denim Jacket", "Retro Armchair", "Classic Leather Boots", "Mid-century Lamp", "Silk Scarf"][i % 5],
        image: `https://picsum.photos/seed/offers-${i}/600/600`,
        price: [65, 240, 120, 90, 35][i % 5],
        currency: "USD",
      },
      lastMessage: {
        text: ["Is this still available?", "Could you do a better price?", "Can you ship to EU?", "Thanks!"][i % 4],
        createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
      },
      participants: { buyer: { name: "You" }, seller: { name: ["Ava", "Liam", "Mia", "Noah"][i % 4] } },
      status: ["open", "accepted", "declined"][i % 3],
      latestOffer: { amount: [55, 220, 100, 80, 30][i % 5], currency: "USD", by: ["buyer", "seller"][i % 2] },
      updatedAt: new Date(Date.now() - i * 3600_000).toISOString(),
      role,
    };
  });

  let items = base;
  if (params.role !== "all") {
    items = items.filter(t => t.role === params.role);
  }
  if (params.status !== "all") {
    items = items.filter(t => t.status === params.status);
  }
  const start = ((params.page || 1) - 1) * (params.pageSize || 20);
  const page = items.slice(start, start + (params.pageSize || 20));
  return { items: page, total: items.length };
}

function generateMockThread(threadId) {
  const thread = {
    id: threadId,
    listing: {
      id: "mock-1",
      title: "Vintage Denim Jacket",
      image: "https://picsum.photos/seed/offer-thread/800/800",
      price: 75,
      currency: "USD",
    },
    participants: { buyer: { name: "You" }, seller: { name: "Ava" } },
    status: "open",
    latestOffer: { amount: 60, currency: "USD", by: "buyer" },
    updatedAt: new Date().toISOString(),
  };
  const messages = [
    { id: "m1", by: "buyer", text: "Hi! Would you take 60?", amount: 60, currency: "USD", createdAt: new Date(Date.now() - 3600_000).toISOString() },
    { id: "m2", by: "seller", text: "Could you do 68?", amount: 68, currency: "USD", createdAt: new Date(Date.now() - 3200_000).toISOString() },
    { id: "m3", by: "buyer", text: "Meet at 65?", amount: 65, currency: "USD", createdAt: new Date(Date.now() - 3000_000).toISOString() },
  ];
  return { thread, messages };
}
