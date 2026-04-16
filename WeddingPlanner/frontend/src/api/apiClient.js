const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5094";

async function readBody(response) {
  const contentType = response.headers?.get?.("content-type") ?? "application/json";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

export async function apiClient(path, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    getToken,
    baseUrl = DEFAULT_BASE_URL,
  } = options;

  const token = getToken?.();
  const requestHeaders = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await readBody(response);

  if (!response.ok) {
    const error = new Error(
      payload?.message || payload?.title || `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload;
}
