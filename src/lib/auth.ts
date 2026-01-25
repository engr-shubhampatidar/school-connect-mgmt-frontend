export type Role = "admin" | "student" | "teacher";

const PREFIX = "sc:auth";

function keyFor(role: Role, tokenType = "access") {
  return `${PREFIX}:${role}:${tokenType}`;
}

function profileKey(role: Role) {
  return `${PREFIX}:${role}:profile`;
}

export function setToken(role: Role, token: string, tokenType = "access") {
  try {
    localStorage.setItem(keyFor(role, tokenType), token);
    document.cookie = `token=${token}; path=/;`;
    // store role in a cookie so server-side middleware can read it
    document.cookie = `role=${role}; path=/;`;
    console.log("Token set in cookie for role:", role);
    console.log("Current cookies:", document.cookie);
  } catch {
    /* ignore storage errors (SSR or privacy settings) */
  }
}

export function getToken(role: Role, tokenType = "access") {
  try {
    return localStorage.getItem(keyFor(role, tokenType));
  } catch {
    return null;
  }
}

export function removeToken(role: Role, tokenType = "access") {
  try {
    localStorage.removeItem(keyFor(role, tokenType));
  } catch {
    /* ignore */
  }
}

export function setUser(role: Role, user: unknown) {
  try {
    localStorage.setItem(profileKey(role), JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function getUser<T = any>(role: Role): T | null {
  try {
    const v = localStorage.getItem(profileKey(role));
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

export function getAccessToken() {
  return getToken("admin");
}

export function setAccessToken(token: string) {
  return setToken("admin", token);
}

export function clearAuthTokens() {
  removeToken("admin");
  removeUser("admin");
}

const auth = {
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  removeUser,
  getAccessToken,
  setAccessToken,
  clearAuthTokens,
};

export default auth;
