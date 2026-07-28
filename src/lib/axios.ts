import axios, { AxiosError, type AxiosRequestHeaders } from "axios";
import { BASE_URL } from "./api-routes";
import { getToken, removeToken } from "./auth";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token for admin APIs only
API.interceptors.request.use((config) => {
  try {
    const url = config.url ?? "";
    // attach token if calling admin API endpoints
    let token = getToken("admin");
    // fallback to cookie token if available
    if (!token && typeof document !== "undefined") {
      const m = document.cookie.match(/(?:^|; )token=([^;]+)/);
      if (m) token = decodeURIComponent(m[1]);
    }
    if (token) {
      config.headers = {
        ...((config.headers as AxiosRequestHeaders) ?? {}),
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
  } catch {
    // swallow
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    // Network error
    if (!error.response) {
      return Promise.reject(new Error("Network error"));
    }

    // Unauthorized: clear tokens and redirect to login
    if (error.response.status === 401) {
      try {
        removeToken("admin");
      } catch {
        // ignore
      }
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
    }

    // Propagate original response data so callers can map field errors
    return Promise.reject(error);
  },
);

export default API;
