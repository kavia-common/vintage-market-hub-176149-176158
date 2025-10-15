//
// PUBLIC_INTERFACE
// client.js
// Centralized HTTP client with base URL from environment, Authorization header injection,
// and unified error handling. Designed to be axios-compatible.
//
/**
 * Exports a lightweight axios-like client using fetch under the hood.
 * - Respects process.env.REACT_APP_API_BASE_URL (default: '').
 * - Injects Authorization header from AuthContext/localStorage token if present.
 * - Centralizes JSON parsing and error normalization.
 *
 * Usage:
 *   import http from '../api/client';
 *   const res = await http.get('/auth/me');
 *   const data = await res.data; // already parsed json
 */

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Read token from localStorage. AuthContext should keep this in sync.
 */
function getToken() {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

/**
 * Normalize and throw an error with consistent shape.
 */
async function handleError(response) {
  const status = response.status;
  let message = 'Request failed';
  let details = null;

  try {
    const text = await response.text();
    if (text) {
      try {
        const json = JSON.parse(text);
        message = json.message || json.detail || message;
        details = json;
      } catch {
        // Not JSON, use raw text
        message = text;
      }
    }
  } catch {
    // ignore parsing errors
  }

  const error = new Error(message);
  error.status = status;
  error.details = details;
  error.url = response.url;
  throw error;
}

/**
 * Build request options with Authorization and JSON headers.
 */
function buildOptions(method, body, customConfig = {}) {
  const headers = new Headers(customConfig.headers || {});
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  // If body is provided and not FormData, send as JSON
  let finalBody = body;
  if (body && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    finalBody = JSON.stringify(body);
  }

  return {
    method,
    headers,
    body: finalBody,
    ...customConfig,
  };
}

/**
 * Execute request and return axios-like response { data, status, headers }
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    await handleError(res);
  }

  // Try to parse json; fallback to text/empty
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = text || null;
  }

  return {
    data,
    status: res.status,
    headers: res.headers,
    url: res.url,
  };
}

/**
// PUBLIC_INTERFACE
 * http - axios-like minimal client with get/post/put/patch/delete
 */
const http = {
  get: (path, config) => request(path, buildOptions('GET', undefined, config)),
  delete: (path, config) => request(path, buildOptions('DELETE', undefined, config)),
  post: (path, body, config) => request(path, buildOptions('POST', body, config)),
  put: (path, body, config) => request(path, buildOptions('PUT', body, config)),
  patch: (path, body, config) => request(path, buildOptions('PATCH', body, config)),
};

export default http;
