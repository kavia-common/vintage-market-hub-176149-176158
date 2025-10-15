import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  // Placeholder methods
  login: async (_credentials) => {},
  logout: () => {},
  setToken: (_t) => {},
});

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * AuthProvider manages basic auth token state.
   * Persists token in localStorage and exposes setter for hooks/services.
   */
  const [token, setTokenState] = useState(null);

  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auth_token");
      if (saved) setTokenState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setToken = useCallback((t) => {
    try {
      if (t) localStorage.setItem("auth_token", t);
      else localStorage.removeItem("auth_token");
    } catch {
      // ignore
    }
    setTokenState(t || null);
  }, []);

  const login = useCallback(async (credentials) => {
    // Placeholder: individual hooks/services should set real token
    console.info("AuthContext.login called with", credentials);
    // no-op here; token managed by useAuth hook via setToken
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setToken,
    }),
    [token, login, logout, setToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
