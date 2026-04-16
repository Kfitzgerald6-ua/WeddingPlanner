import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearStoredSession,
  getStoredSession,
  login,
  SESSION_STORAGE_KEY,
} from "./authService";

describe("authService", () => {
  const originalLocalStorage = globalThis.localStorage;

  beforeEach(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: vi.fn((key) => store.get(key) ?? null),
      setItem: vi.fn((key, value) => store.set(key, value)),
      removeItem: vi.fn((key) => store.delete(key)),
    };
  });

  afterEach(() => {
    globalThis.localStorage = originalLocalStorage;
    vi.restoreAllMocks();
  });

  it("persists login response as the active session", async () => {
    const session = {
      token: "jwt-token",
      user: {
        id: 2,
        email: "planner@bloomco.com",
        displayName: "Rachel Torres",
        role: "planner",
        employeeId: 1,
        coupleId: null,
      },
    };

    const api = vi.fn().mockResolvedValue(session);

    const result = await login(
      { email: "planner@bloomco.com", password: "Password123!" },
      { apiClient: api },
    );

    expect(result).toEqual(session);
    expect(api).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
    expect(globalThis.localStorage.setItem).toHaveBeenCalledWith(
      SESSION_STORAGE_KEY,
      JSON.stringify(session),
    );
    expect(getStoredSession()).toEqual(session);
  });

  it("clears malformed session payloads instead of reusing them", () => {
    globalThis.localStorage.getItem.mockReturnValue("not-json");

    expect(getStoredSession()).toBeNull();
    expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith(SESSION_STORAGE_KEY);
  });

  it("removes the stored session on logout", () => {
    clearStoredSession();

    expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith(SESSION_STORAGE_KEY);
  });
});
