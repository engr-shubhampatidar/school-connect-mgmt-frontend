import React from "react";
import { cn } from "@/utils/cn";

type Variant = "default" | "outline" | "success" | "warning";

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  const base =
    "inline-flex items-center rounded-md px-2 py-1 text-sm font-medium";
  const styles: Record<Variant, string> = {
    default: "bg-slate-100 text-slate-800 border border-transparent",
    outline: "bg-white text-slate-800 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-800 border border-amber-100",
  };

  return <span className={cn(base, styles[variant])}>{children}</span>;
}
