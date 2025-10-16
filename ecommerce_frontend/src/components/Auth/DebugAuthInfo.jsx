import React from "react";

export default function DebugAuthInfo() {
  let token = null;
  try {
    token = localStorage.getItem("auth_token");
  } catch {
    token = null;
  }
  if (!token) return null;
  return (
    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
      Auth token present (truncated): {token.slice(0, 12)}...{token.slice(-6)}
    </div>
  );
}
