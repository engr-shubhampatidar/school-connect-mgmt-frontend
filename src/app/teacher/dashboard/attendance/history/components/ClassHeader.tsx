"use client";
import React from "react";

type ClassMeta = {
  name?: string;
  className?: string;
  section?: string;
  sectionName?: string;
  subject?: string | null;
  [k: string]: unknown;
} | null;

export default function ClassHeader({ klass }: { klass: ClassMeta }) {
  const title = klass?.name ?? klass?.className ?? "";
  const section = klass?.section ?? klass?.sectionName ?? "";
  const subject = klass?.subject ?? null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">Class &amp; Section</div>
        <div className="flex items-center gap-3">
          <h1 className="text-[24px]  font-[600]">
            {title}
            {section ? ` – ${section}` : ""}
          </h1>
          {subject ? (
            <span className="inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-700 bg-white">
              {subject}
            </span>
          ) : null}
        </div>
      </div>

      <div className="text-right text-sm text-slate-600">&nbsp;</div>
    </div>
  );
}
