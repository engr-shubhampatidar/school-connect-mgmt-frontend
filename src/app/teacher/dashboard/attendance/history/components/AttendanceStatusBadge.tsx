"use client";
import React from "react";

export default function AttendanceStatusBadge({
  complete,
}: {
  complete: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold ${
        complete
          ? "border border-emerald-300 text-emerald-700 bg-emerald-50"
          : "border border-rose-300 text-rose-700 bg-rose-50"
      }`}
    >
      {complete ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3a1 1 0 01-2 0zm1 4a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {complete ? "Complete" : "Incomplete"}
    </span>
  );
}
