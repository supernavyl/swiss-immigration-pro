import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { API_URL as CONFIG_API_URL } from "./config";
import { isTokenExpired } from "./jwt";

// Use config-based URL that handles Cloudflare
const API_URL = CONFIG_API_URL;
const TIMEOUT_MS = 30_000;

const TOKEN_KEY = "sip_token";
const REFRESH_KEY = "sip_refresh";

// ---------- Token helpers ----------

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function setTokens(access: string, refresh?: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, access);
  if (refresh) await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function removeTokens() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

export { isTokenExpired } from "./jwt";

// ---------- API Error ----------

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

// ---------- Refresh state ----------

let refreshing = false;

async function attemptTokenRefresh(): Promise<boolean> {
  if (refreshing) return false;
  refreshing = true;
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.token) {
      await setTokens(data.token, data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  } finally {
    refreshing = false;
  }
}

// ---------- Request ----------

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = {
      "Content-Type": "application/json",
      ...(await authHeaders()),
      ...(options.headers as Record<string, string>),
    };

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    if (res.status === 401 && retry) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) return request<T>(path, options, false);
      await removeTokens();
      router.replace("/(auth)/login");
      throw new ApiError(401, "Session expired");
    }

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        detail = body.detail || body.error || body.message || detail;
      } catch {}
      throw new ApiError(res.status, detail);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Public API ----------

export const api = {
  get<T = unknown>(path: string) {
    return request<T>(path, { method: "GET" });
  },
  post<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "POST",
      body: body != null ? JSON.stringify(body) : undefined,
    });
  },
  put<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PUT",
      body: body != null ? JSON.stringify(body) : undefined,
    });
  },
  delete<T = unknown>(path: string) {
    return request<T>(path, { method: "DELETE" });
  },
};
