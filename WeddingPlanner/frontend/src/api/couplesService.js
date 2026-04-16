import { apiClient } from "./apiClient";
import { getAuthToken } from "./authService";

function authOptions(overrides = {}) {
  return {
    getToken: getAuthToken,
    ...overrides,
  };
}

export function listCouples() {
  return apiClient("/api/couples", authOptions());
}

export function createCouple(payload) {
  return apiClient("/api/couples", authOptions({ method: "POST", body: payload }));
}

export function updateCoupleStage(id, newStage) {
  return apiClient(`/api/couples/${id}/stage`, authOptions({
    method: "PATCH",
    body: { newStage },
  }));
}

export function getCoupleVendors(id) {
  return apiClient(`/api/couples/${id}/vendors`, authOptions());
}

export function getCoupleTimeSummary(id) {
  return apiClient(`/api/couples/${id}/time-summary`, authOptions());
}
