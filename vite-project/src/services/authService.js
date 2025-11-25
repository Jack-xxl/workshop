// src/services/authService.js
const API_BASE = "http://localhost:3100/api/auth";

export async function register(username, password) {
  const resp = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(data.error || "注册失败");
  }
  saveAuth(data);
  return data;
}

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

function saveAuth(data) {
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  if (data.user) {
    localStorage.setItem("currentUser", JSON.stringify(data.user));
  }
}
