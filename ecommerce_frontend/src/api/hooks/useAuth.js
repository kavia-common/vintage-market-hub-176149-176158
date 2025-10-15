import { useCallback, useEffect, useMemo, useState } from "react";
import http from "../client";
import { AuthContext } from "../../state/AuthContext";
import { useContext } from "react";

/**
// PUBLIC_INTERFACE
 * useAuth
 * Hook that provides authentication helpers wired to the backend API and persists token.
 * Exposes:
 *  - login(email, password)
 *  - register(payload)
 *  - me()
 *  - logout()
 *  - token, isAuthenticated, user, loading, error
 *
 * Behavior:
 *  - Persists token in localStorage under 'auth_token'
 *  - Hydrates token on mount and fetches current user (/auth/me)
 *  - Updates AuthContext to keep app-wide state in sync
 */
export default function useAuth() {
  const authCtx = useContext(AuthContext);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("auth_token");
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  // Keep AuthContext in sync with token changes
  useEffect(() => {
    if (!authCtx) return;
    // Update context token if provider exists
    // We don't have a direct setter, so we can call login/logout placeholders to sync where needed.
    // Alternatively, contexts can read localStorage directly on mount.
  }, [authCtx, token]);

  const persistToken = useCallback((tkn) => {
    try {
      if (tkn) {
        localStorage.setItem("auth_token", tkn);
      } else {
        localStorage.removeItem("auth_token");
      }
    } catch {
      // ignore storage errors
    }
    setToken(tkn || null);
  }, []);

  const me = useCallback(async () => {
    setError(null);
    try {
      const res = await http.get("/auth/me");
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      // If unauthorized, clear token
      if (err && (err.status === 401 || err.status === 403)) {
        persistToken(null);
      }
      setError(err);
      throw err;
    }
  }, [persistToken]);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const res = await http.post("/auth/login", { email, password });
        const tkn = res?.data?.access_token || res?.data?.token || null;
        if (!tkn) throw new Error("No token returned from login");

        persistToken(tkn);

        // Optionally fetch user profile
        try {
          await me();
        } catch {
          // ignore me fetch errors here
        }

        // Inform AuthContext (using its placeholder API)
        if (authCtx?.login) {
          await authCtx.login({ email });
        }

        return { success: true, token: tkn };
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [authCtx, me, persistToken]
  );

  const register = useCallback(
    async (payload) => {
      // payload may include { name, email, password, ... }
      setLoading(true);
      setError(null);
      try {
        const res = await http.post("/auth/register", payload);
        // Some backends auto-login, some return token; handle both:
        const tkn = res?.data?.access_token || res?.data?.token || null;
        if (tkn) {
          persistToken(tkn);
          try {
            await me();
          } catch {
            // ignore
          }
          if (authCtx?.login) {
            await authCtx.login({ email: payload?.email });
          }
        }
        return res.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [authCtx, me, persistToken]
  );

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
    if (authCtx?.logout) {
      authCtx.logout();
    }
  }, [authCtx, persistToken]);

  // Hydrate current user on first mount if token exists
  useEffect(() => {
    let active = true;
    async function init() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await me();
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [token, me]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      user,
      loading,
      error,
      login,
      register,
      me,
      logout,
    }),
    [token, user, loading, error, login, register, me, logout]
  );

  return value;
}
