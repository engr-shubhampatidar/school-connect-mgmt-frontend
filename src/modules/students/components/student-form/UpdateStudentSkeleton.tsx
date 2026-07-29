"use client";

import React from "react";

export default function UpdateStudentSkeleton() {
  return (
    <div className="space-y-4 ">
      <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 animate-pulse rounded bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}
