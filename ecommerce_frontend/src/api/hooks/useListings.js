import { useCallback, useEffect, useMemo, useState } from "react";
import http from "../client";

/**
// PUBLIC_INTERFACE
 * useListings
 * Hook to manage listings CRUD with placeholder API calls.
 * Exposes:
 *  - listings, loading, error, total
 *  - filters: { region, search, sort }
 *  - actions: fetchListings, getListing, createListing, updateListing, deleteListing
 * 
 * This uses /listings endpoints as placeholders. Replace with backend integration as needed.
 */
export default function useListings(initial = {}) {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    region: initial.region || "Global",
    search: initial.search || "",
    sort: initial.sort || "newest",
    page: initial.page || 1,
    pageSize: initial.pageSize || 20,
  });

  const fetchListings = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);
    const params = { ...filters, ...overrides };
    try {
      // Placeholder: try backend; if fails, return mocked data
      const query = new URLSearchParams({
        q: params.search || "",
        region: params.region || "",
        sort: params.sort || "",
        page: String(params.page || 1),
        pageSize: String(params.pageSize || 20),
      }).toString();
      try {
        const res = await http.get(`/listings?${query}`);
        const data = Array.isArray(res.data?.items) ? res.data.items : (Array.isArray(res.data) ? res.data : []);
        setListings(data);
        setTotal(res.data?.total || data.length);
      } catch (apiErr) {
        // mock some data
        const mock = generateMockListings(params);
        setListings(mock.items);
        setTotal(mock.total);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getListing = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.get(`/listings/${id}`);
        return res.data;
      } catch {
        // fallback to mock
        return generateMockListing(id);
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createListing = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.post("/listings", payload);
        await fetchListings();
        return res.data;
      } catch {
        // mock: prepend to current list
        const created = { id: `mock-${Date.now()}`, ...payload, images: payload.images || [], price: Number(payload.price || 0), createdAt: new Date().toISOString(), likes: 0 };
        setListings(prev => [created, ...prev]);
        setTotal(t => t + 1);
        return created;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchListings]);

  const updateListing = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await http.put(`/listings/${id}`, payload);
        await fetchListings();
        return res.data;
      } catch {
        // mock update
        setListings(prev => prev.map(it => it.id === id ? { ...it, ...payload } : it));
        return { id, ...payload };
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchListings]);

  const deleteListing = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      try {
        await http.delete(`/listings/${id}`);
        await fetchListings();
        return true;
      } catch {
        // mock delete
        setListings(prev => prev.filter(it => it.id !== id));
        setTotal(t => Math.max(0, t - 1));
        return true;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchListings]);

  // auto-fetch on mount and when filters change
  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.region, filters.search, filters.sort, filters.page, filters.pageSize]);

  const setRegion = useCallback((region) => setFilters(f => ({ ...f, region, page: 1 })), []);
  const setSearch = useCallback((search) => setFilters(f => ({ ...f, search, page: 1 })), []);
  const setSort = useCallback((sort) => setFilters(f => ({ ...f, sort, page: 1 })), []);
  const setPage = useCallback((page) => setFilters(f => ({ ...f, page })), []);
  const setPageSize = useCallback((pageSize) => setFilters(f => ({ ...f, pageSize })), []);

  const value = useMemo(() => ({
    listings, loading, error, total, filters,
    actions: { fetchListings, getListing, createListing, updateListing, deleteListing, setRegion, setSearch, setSort, setPage, setPageSize }
  }), [listings, loading, error, total, filters, fetchListings, getListing, createListing, updateListing, deleteListing, setRegion, setSearch, setSort, setPage, setPageSize]);

  return value;
}

function generateMockListings(params) {
  const all = Array.from({ length: 24 }).map((_, i) => ({
    id: `mock-${i + 1}`,
    title: ["Vintage Denim Jacket", "Retro Armchair", "Classic Leather Boots", "Mid-century Lamp", "Silk Scarf"][i % 5] + ` #${i + 1}`,
    price: [65, 240, 120, 90, 35][i % 5],
    currency: "USD",
    region: params.region || "Global",
    likes: Math.floor(Math.random() * 200),
    images: [`https://picsum.photos/seed/vintage-${i}/600/600`],
    seller: { id: `seller-${(i % 4) + 1}`, name: ["Ava", "Liam", "Mia", "Noah"][i % 4] },
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    condition: ["Excellent", "Good", "Fair"][i % 3],
    category: ["Clothing", "Furniture", "Accessories"][i % 3],
    description: "A lovely vintage item with character and charm.",
  }));

  let filtered = all;
  if (params.search) {
    filtered = filtered.filter(it => it.title.toLowerCase().includes(params.search.toLowerCase()));
  }
  if (params.sort === "price_low_high") {
    filtered = filtered.slice().sort((a, b) => a.price - b.price);
  } else if (params.sort === "price_high_low") {
    filtered = filtered.slice().sort((a, b) => b.price - a.price);
  } else if (params.sort === "popular") {
    filtered = filtered.slice().sort((a, b) => b.likes - a.likes);
  } else {
    // newest
    filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const start = ((params.page || 1) - 1) * (params.pageSize || 20);
  const items = filtered.slice(start, start + (params.pageSize || 20));

  return { items, total: filtered.length };
}

function generateMockListing(id) {
  return {
    id,
    title: "Vintage Denim Jacket",
    price: 75,
    currency: "USD",
    region: "Global",
    likes: 42,
    images: ["https://picsum.photos/seed/vintage-detail/800/800"],
    seller: { id: "seller-1", name: "Ava" },
    createdAt: new Date().toISOString(),
    condition: "Good",
    category: "Clothing",
    description: "Classic piece from the 80s, well preserved and stylish.",
    measurements: { chest: "40in", length: "25in" },
  };
}
