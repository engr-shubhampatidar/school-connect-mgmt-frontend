"use client";
import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-slate-100 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
