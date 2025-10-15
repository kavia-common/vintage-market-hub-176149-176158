//
// PUBLIC_INTERFACE
// Exports theme tokens for the Cosmic Energy theme as a plain object and a helper to apply them as CSS variables.
/**
 * Cosmic Energy theme tokens: Indigo & pink fusion with modern UI accents.
 * Primary and secondary are used for interactive elements and highlights.
 */
export const cosmicEnergyTokens = {
  name: "Cosmic Energy",
  colors: {
    primary: "#4F46E5",     // Indigo 600
    secondary: "#EC4899",   // Pink 500
    success: "#10B981",     // Emerald 500
    error: "#EF4444",       // Red 500
    background: "#f9fafb",  // Gray 50
    surface: "#ffffff",     // White
    text: "#111827",        // Gray 900
    textMuted: "rgba(17,24,39,0.7)",
    border: "rgba(17,24,39,0.08)",
    shadow: "rgba(2,6,23,0.08)",
  },
  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    round: "9999px",
  },
  spacing: {
    xs: "6px",
    sm: "10px",
    md: "14px",
    lg: "20px",
    xl: "28px",
  },
};

/**
// PUBLIC_INTERFACE
 * applyThemeToRoot
 * Applies theme tokens as CSS variables on :root for global consumption.
 */
export function applyThemeToRoot(tokens = cosmicEnergyTokens) {
  const root = document.documentElement;
  const { colors, radii, spacing } = tokens;

  // Colors
  root.style.setProperty("--color-primary", colors.primary);
  root.style.setProperty("--color-secondary", colors.secondary);
  root.style.setProperty("--color-success", colors.success);
  root.style.setProperty("--color-error", colors.error);
  root.style.setProperty("--color-bg", colors.background);
  root.style.setProperty("--color-surface", colors.surface);
  root.style.setProperty("--color-text", colors.text);
  root.style.setProperty("--color-text-muted", colors.textMuted);
  root.style.setProperty("--color-border", colors.border);
  root.style.setProperty("--shadow-color", colors.shadow);

  // Radii
  root.style.setProperty("--radius-sm", radii.sm);
  root.style.setProperty("--radius-md", radii.md);
  root.style.setProperty("--radius-lg", radii.lg);
  root.style.setProperty("--radius-xl", radii.xl);
  root.style.setProperty("--radius-round", radii.round);

  // Spacing
  root.style.setProperty("--space-xs", spacing.xs);
  root.style.setProperty("--space-sm", spacing.sm);
  root.style.setProperty("--space-md", spacing.md);
  root.style.setProperty("--space-lg", spacing.lg);
  root.style.setProperty("--space-xl", spacing.xl);
}

export default cosmicEnergyTokens;
