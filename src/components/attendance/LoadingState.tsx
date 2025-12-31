"use client";
import React from "react";

export default function LoadingState() {
  return (
    <div className="p-6 text-center">
      <div className="h-8 w-8 mx-auto mb-3 rounded-full bg-slate-100 animate-pulse" />
      <div className="text-slate-600">Loading attendance…</div>
    </div>
  );
}
