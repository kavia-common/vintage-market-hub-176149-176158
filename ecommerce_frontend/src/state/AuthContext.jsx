import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  // Placeholder methods
  login: async (_credentials) => {},
  logout: () => {},
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
   * This is a placeholder for real integration with the backend auth API.
   */
  const [token, setToken] = useState(null);

  const login = useCallback(async (credentials) => {
    // TODO: Replace with real API call
    console.info("AuthContext.login called with", credentials);
    // Simulate receiving a token
    const fakeToken = "demo-token";
    setToken(fakeToken);
    return { success: true, token: fakeToken };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
