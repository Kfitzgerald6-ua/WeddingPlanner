import { apiClient } from "./apiClient";
import { getAuthToken } from "./authService";

export function getCouplePortalOverview() {
  return apiClient("/api/couple-portal/overview", {
    getToken: getAuthToken,
  });
}
