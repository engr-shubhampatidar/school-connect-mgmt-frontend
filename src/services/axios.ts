import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { AUTH_API, BASE_URL, PUBLIC_API_PATHS } from "@/config/api-routes";
import {
  clearSession,
  ensureSessionReady,
  getAccessToken,
  getRefreshToken,
  updateTokens,
} from "@/modules/auth/api/session";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** Bare client for refresh — no interceptors, avoids recursion. */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function normalizePath(url?: string): string {
  if (!url) return "";
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return new URL(url).pathname;
    }
  } catch {
    /* fall through */
  }
  const path = url.split("?")[0] ?? "";
  return path.startsWith("/") ? path : `/${path}`;
}

function isPublicPath(url?: string): boolean {
  const path = normalizePath(url);
  if (path.startsWith("/public/")) return true;
  return PUBLIC_API_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (path === "/login" || path.startsWith("/login/")) return;
  window.location.href = "/login";
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await refreshClient.post<{
    accessToken?: string;
    refreshToken?: string;
  }>(AUTH_API.REFRESH, { refreshToken });

  const access = res.data?.accessToken;
  const nextRefresh = res.data?.refreshToken ?? refreshToken;
  if (!access) {
    throw new Error("Refresh response missing accessToken");
  }

  updateTokens(access, nextRefresh);
  return access;
}

API.interceptors.request.use(async (config) => {
  if (isPublicPath(config.url)) {
    return config;
  }

  // Wait for AuthBootstrap silent refresh after hard reload
  if (!getAccessToken() && getRefreshToken()) {
    await ensureSessionReady();
  }

  const token = getAccessToken();
  if (token) {
    config.headers = {
      ...((config.headers as AxiosRequestHeaders) ?? {}),
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new Error("Network error"));
    }

    const original = error.config as RetryConfig | undefined;
    const status = error.response.status;

    if (status !== 401 || !original) {
      return Promise.reject(error);
    }

    // Login/refresh failures or already-retried → force logout
    if (isPublicPath(original.url) || original._retry) {
      clearSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (!token) return Promise.reject(error);
        original.headers = {
          ...((original.headers as AxiosRequestHeaders) ?? {}),
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
        return API(original as AxiosRequestConfig);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      original.headers = {
        ...((original.headers as AxiosRequestHeaders) ?? {}),
        Authorization: `Bearer ${newToken}`,
      } as AxiosRequestHeaders;
      return API(original as AxiosRequestConfig);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { refreshAccessToken };
export default API;
