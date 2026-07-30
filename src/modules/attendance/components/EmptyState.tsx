"use client";
import React from "react";

export default function EmptyState({ message }: { message?: string }) {
  return (
    <div className="p-6 text-center text-slate-600">
      <div className="mb-2 text-sm">{message ?? "No records available."}</div>
    </div>
  );
}
