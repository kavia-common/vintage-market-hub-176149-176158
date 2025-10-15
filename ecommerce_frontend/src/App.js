import React, { useEffect } from "react";
import "./App.css";
import "./theme/cosmicEnergy.css";
import AppRouter from "./routes/AppRouter";
import { applyThemeToRoot } from "./theme/tokens";

// PUBLIC_INTERFACE
function App() {
  /**
   * App mounts the router and ensures theme tokens are applied on load.
   */
  useEffect(() => {
    applyThemeToRoot();
  }, []);

  return <AppRouter />;
}

export default App;
