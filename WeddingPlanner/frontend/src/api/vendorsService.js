import { apiClient } from "./apiClient";
import { getAuthToken } from "./authService";

function authOptions(overrides = {}) {
  return {
    getToken: getAuthToken,
    ...overrides,
  };
}

export function listVendors(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category !== undefined && filters.category !== null && filters.category !== "") {
    params.set("category", filters.category);
  }
  if (filters.city) params.set("city", filters.city);
  if (filters.preferredOnly) params.set("preferredOnly", "true");
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiClient(`/api/vendors${suffix}`, authOptions());
}

export function createVendor(payload) {
  return apiClient("/api/vendors", authOptions({ method: "POST", body: payload }));
}

export function assignVendor(payload) {
  return apiClient("/api/vendors/assign", authOptions({ method: "POST", body: payload }));
}

export function recommendVendors(payload) {
  return apiClient("/api/vendors/recommend", authOptions({ method: "POST", body: payload }));
}
