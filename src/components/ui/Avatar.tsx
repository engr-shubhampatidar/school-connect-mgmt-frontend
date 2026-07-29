import React from "react";
import { cn } from "@/utils/cn";

export default function Avatar({
  name,
  size = 32,
}: {
  name?: string | null;
  size?: number;
}) {
  const initials =
    name && name.length
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
      : "?";

  const className = cn(
    "rounded-full flex items-center justify-center text-xs font-semibold text-slate-700 bg-slate-100"
  );

  return (
    <div
      className={className}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
