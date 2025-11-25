// src/services/userStorage.js
import { getCurrentUser } from "./authService";

export function getCurrentUserId() {
  const user = getCurrentUser();
  return user?.id || "guest";
}

export function userKey(base) {
  const id = getCurrentUserId();
  return `${base}_${id}`;
}
