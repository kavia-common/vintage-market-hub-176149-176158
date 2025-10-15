import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

// PUBLIC_INTERFACE
export const RegionContext = createContext({
  region: "Global",
  setRegion: (_region) => {},
});

// PUBLIC_INTERFACE
export function useRegion() {
  /** Hook to access the current region and setter */
  return useContext(RegionContext);
}

// PUBLIC_INTERFACE
export function RegionProvider({ children }) {
  /**
   * RegionProvider controls the active region of the marketplace.
   * Defaults to "Global". Can be expanded to persist in localStorage.
   */
  const [region, setRegionState] = useState("Global");

  const setRegion = useCallback((next) => {
    setRegionState(next);
  }, []);

  const value = useMemo(() => ({ region, setRegion }), [region, setRegion]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export default RegionProvider;
