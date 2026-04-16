import { apiClient } from "./apiClient";

export const SESSION_STORAGE_KEY = "wedding-planner-session-v2";

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user?.role) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function storeSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getAuthToken() {
  return getStoredSession()?.token ?? null;
}

export async function login(credentials, deps = {}) {
  const client = deps.apiClient ?? apiClient;
  const session = await client("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
  return storeSession(session);
}

export async function getCurrentUser(deps = {}) {
  const client = deps.apiClient ?? apiClient;
  return client("/api/auth/me", {
    getToken,
  });
}

function getToken() {
  return getAuthToken();
}
