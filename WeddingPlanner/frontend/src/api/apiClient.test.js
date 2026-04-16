import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./apiClient";

describe("apiClient", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("adds bearer token when auth token exists", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    await apiClient("/api/test", {
      getToken: () => "sample-token",
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/test"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      }),
    );
  });

  it("normalizes API errors to include status and message", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid email or password." }),
    });

    await expect(
      apiClient("/api/auth/login", {
        method: "POST",
        body: { email: "bad@example.com", password: "wrong" },
      }),
    ).rejects.toMatchObject({
      status: 401,
      message: "Invalid email or password.",
    });
  });
});
