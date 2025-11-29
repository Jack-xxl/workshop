// src/services/authService.js
// Use VITE_API_BASE in production (Render), fall back to localhost in dev
const API_BASE =
  (import.meta.env.VITE_API_BASE || "http://localhost:3100") + "/api/auth";

export async function login(username, password) {
  const resp = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(data.error || "登录失败");
  }
  saveAuth(data);
  return data;
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return localStorage.getItem("authToken") || "";
}

export function isAuthenticated() {
  const token = getAuthToken();
  if (!token) return false;
  
  // Basic check - token exists and is not expired
  // Note: Full validation happens on backend
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

function saveAuth(data) {
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  if (data.user) {
    localStorage.setItem("currentUser", JSON.stringify(data.user));
  }
}
