import { apiClient } from "./apiClient";
import { getAuthToken } from "./authService";

function authOptions(overrides = {}) {
  return {
    getToken: getAuthToken,
    ...overrides,
  };
}

export function listEmployees() {
  return apiClient("/api/employees", authOptions());
}

export function listTimeEntries(filters = {}) {
  const params = new URLSearchParams();
  if (filters.employeeId) params.set("employeeId", filters.employeeId);
  if (filters.coupleId) params.set("coupleId", filters.coupleId);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiClient(`/api/timeentries${suffix}`, authOptions());
}

export function clockIn(payload) {
  return apiClient("/api/timeentries/clock-in", authOptions({ method: "POST", body: payload }));
}

export function clockOut(timeEntryId) {
  return apiClient("/api/timeentries/clock-out", authOptions({
    method: "PATCH",
    body: { timeEntryId },
  }));
}
