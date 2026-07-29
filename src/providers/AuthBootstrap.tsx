"use client";

import { useEffect } from "react";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  markSessionReady,
} from "@/modules/auth/api/session";
import { refreshAccessToken } from "@/services/axios";

/**
 * Restores the in-memory access token from a persisted refresh token on load.
 * Must mount once near the app root.
 */
export default function AuthBootstrap() {
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (!getAccessToken() && getRefreshToken()) {
          await refreshAccessToken();
        }
      } catch {
        if (!cancelled) clearSession();
      } finally {
        // Always settle — Strict Mode remounts must not leave waiters hanging
        markSessionReady();
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
