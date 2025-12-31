import axios from "axios";
import { BASE_URL } from "./api-routes";
import { getToken, removeToken } from "./auth";

const studentApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

studentApi.interceptors.request.use((config) => {
  try {
    const token = getToken("student");
    if (token) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      } as typeof config.headers;
    }
  } catch {
    // ignore
  }
  return config;
});

studentApi.interceptors.response.use(
  (res) => res,
  (error) => {
    // If unauthorized, remove student token and redirect to student login
    if (error?.response?.status === 401) {
      try {
        removeToken("student");
      } catch {}
      if (typeof window !== "undefined") {
        window.location.href = "/student/login";
      }
    }
    return Promise.reject(error);
  }
);

export default studentApi;
