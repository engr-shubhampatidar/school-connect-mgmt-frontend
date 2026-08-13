import type { Role } from "@/types/auth";

export type { Role };

const PREFIX = "sc:auth";
const ACTIVE_ROLE_KEY = `${PREFIX}:activeRole`;
const ROLES: Role[] = ["admin", "teacher", "student", "parent"];

/** Access token lives in memory only (not localStorage). */
let accessToken: string | null = null;

/** Resolves once AuthBootstrap has attempted silent refresh (success or fail). */
let resolveSessionReady: (() => void) | null = null;
let sessionReadySettled = false;
export const sessionReady: Promise<void> = new Promise((resolve) => {
  resolveSessionReady = () => {
    sessionReadySettled = true;
    resolve();
  };
});

export function markSessionReady() {
  if (sessionReadySettled) return;
  resolveSessionReady?.();
}

export async function ensureSessionReady() {
  if (sessionReadySettled) return;
  await sessionReady;
}

function refreshKey(role: Role) {
  return `${PREFIX}:${role}:refresh`;
}

function profileKey(role: Role) {
  return `${PREFIX}:${role}:profile`;
}

function expireCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getActiveRole(): Role | null {
  try {
    const role = localStorage.getItem(ACTIVE_ROLE_KEY);
    if (
      role === "admin" ||
      role === "teacher" ||
      role === "student" ||
      role === "parent"
    ) {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

export function getRefreshToken(role?: Role | null): string | null {
  const r = role ?? getActiveRole();
  if (!r) return null;
  try {
    return localStorage.getItem(refreshKey(r));
  } catch {
    return null;
  }
}

export function setUser(role: Role, user: unknown) {
  try {
    localStorage.setItem(profileKey(role), JSON.stringify(user));
  } catch {
    /* ignore storage errors (SSR or privacy settings) */
  }
}

export function getUser<T = any>(role?: Role | null): T | null {
  const r = role ?? getActiveRole();
  if (!r) return null;
  try {
    const v = localStorage.getItem(profileKey(r));
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function removeUser(role: Role) {
  try {
    localStorage.removeItem(profileKey(role));
  } catch {
    /* ignore */
  }
}

export type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  role: Role;
  user?: unknown;
};

/** Persist session after login or successful token refresh. */
export function setSession({
  accessToken: access,
  refreshToken,
  role,
  user,
}: SessionPayload) {
  accessToken = access;
  try {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
    localStorage.setItem(refreshKey(role), refreshToken);
    if (user !== undefined) {
      setUser(role, user);
    }
    setCookie("sc_session", "1");
    setCookie("role", role);
    // Clear legacy JWT cookie if present
    expireCookie("token");
  } catch {
    /* ignore storage errors */
  }
}

/** Update tokens after refresh (keeps active role + profile). */
export function updateTokens(access: string, refresh: string) {
  const role = getActiveRole();
  accessToken = access;
  if (!role) return;
  try {
    localStorage.setItem(refreshKey(role), refresh);
    setCookie("sc_session", "1");
    setCookie("role", role);
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  accessToken = null;
  try {
    const active = getActiveRole();
    localStorage.removeItem(ACTIVE_ROLE_KEY);
    for (const role of ROLES) {
      localStorage.removeItem(refreshKey(role));
      localStorage.removeItem(profileKey(role));
    }
    // Also clear any legacy access keys
    if (active) {
      localStorage.removeItem(`${PREFIX}:${active}:access`);
    }
    for (const role of ROLES) {
      localStorage.removeItem(`${PREFIX}:${role}:access`);
    }
  } catch {
    /* ignore */
  }
  expireCookie("sc_session");
  expireCookie("role");
  expireCookie("token");
}

/**
 * Compat: returns in-memory access token when `role` matches the active session.
 * Prefer `getAccessToken()` for new code.
 */
export function getToken(role: Role, tokenType = "access"): string | null {
  if (tokenType === "refresh") {
    return getRefreshToken(role);
  }
  if (getActiveRole() !== role) return null;
  return accessToken;
}

/** @deprecated Use setSession instead */
export function setToken(role: Role, token: string, tokenType = "access") {
  if (tokenType === "refresh") {
    try {
      localStorage.setItem(refreshKey(role), token);
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    } catch {
      /* ignore */
    }
    return;
  }
  accessToken = token;
  try {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
    setCookie("sc_session", "1");
    setCookie("role", role);
    expireCookie("token");
  } catch {
    /* ignore */
  }
}

/** @deprecated Use clearSession instead */
export function removeToken(_role: Role, _tokenType = "access") {
  clearSession();
}

/** @deprecated Use clearSession instead */
export function clearAuthTokens() {
  clearSession();
}

const auth = {
  setSession,
  updateTokens,
  clearSession,
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  getActiveRole,
  ensureSessionReady,
  markSessionReady,
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  removeUser,
  clearAuthTokens,
};

export default auth;
