"use client";
import React from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error";
};

const ToastContext = React.createContext<{
  toast: (t: Toast) => void;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = (t: Toast) => {
    const id = t.id ?? Math.random().toString(36).slice(2);
    setToasts((s) => [...s, { ...t, id }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000);
    return id;
  };

  const dismiss = (id: string) =>
    setToasts((s) => s.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[320px] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md p-3 shadow ${
              t.type === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            {t.title && <div className="font-medium text-sm">{t.title}</div>}
            {t.description && (
              <div className="text-sm text-slate-700">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default useToast;
