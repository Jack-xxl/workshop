// Centralized API configuration with automatic auth token injection
import axios from "axios";
import { getAuthToken } from "./authService";

// Backend base URL: Render in production, localhost in dev (fallback)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3100";

// Helpful for debugging in the browser console
console.log("[API] API_BASE =", API_BASE);

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function for fetch requests with auth token
// `url` can be:
// - absolute ("http://..." or "https://...")
// - or backend-relative ("/api/xxx")
export async function fetchWithAuth(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isAbsolute = /^https?:\/\//i.test(url);
  const fullUrl = isAbsolute ? url : `${API_BASE}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Handle 401 errors
  if (response.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
}

export default api;

// Export base URL for other modules if needed
export { API_BASE };

