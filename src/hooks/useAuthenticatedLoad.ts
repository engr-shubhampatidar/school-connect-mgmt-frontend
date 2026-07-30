"use client";

import { useEffect, useRef, useState } from "react";
import {
  ensureSessionReady,
  getAccessToken,
  getActiveRole,
  type Role,
} from "@/modules/auth";
import { useToast } from "@/components/ui/use-toast";

type LoadFn<T> = () => Promise<T>;

type Options = {
  /** When false, skip the fetch (e.g. missing route param). Default true. */
  enabled?: boolean;
  errorTitle?: string;
};

/**
 * Session-ready + role gate + mounted-safe load pattern used across portal pages.
 */
export function useAuthenticatedLoad<T>(
  role: Role,
  loadFn: LoadFn<T>,
  options: Options = {},
) {
  const { enabled = true, errorTitle = "Unable to load" } = options;
  const { toast } = useToast();
  const toastRef = useRef(toast);
  const loadRef = useRef(loadFn);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    loadRef.current = loadFn;
  }, [loadFn]);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);
      await ensureSessionReady();
      if (!mounted) return;

      if (!getAccessToken() || getActiveRole() !== role) {
        setLoading(false);
        return;
      }

      try {
        const result = await loadRef.current();
        if (!mounted) return;
        setData(result);
      } catch (err: unknown) {
        let message = "Unable to load data";
        if (typeof err === "object" && err !== null && "message" in err) {
          const maybeMessage = (err as { message?: unknown }).message;
          if (typeof maybeMessage === "string") message = maybeMessage;
        }
        if (!mounted) return;
        setError(message);
        toastRef.current?.({
          title: errorTitle,
          description: message,
          type: "error",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [role, enabled, errorTitle]);

  return { data, setData, loading, error };
}
