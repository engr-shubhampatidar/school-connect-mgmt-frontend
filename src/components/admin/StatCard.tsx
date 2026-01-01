"use client";
import React from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  className: string;
  iconBgColor?: string;
  progressLabel?: string;
  progressLabelColor?: string;
  // tolerate a common misspelling from callers
  progessLabel?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function StatCard({
  label,
  value,
  className,
  iconBgColor,
  progressLabel,
  progressLabelColor,
  icon: IconComp,
}: StatCardProps) {
  const progressText = progressLabel  ?? "~ Work in Progess";
  return (
    <div className={`${className} rounded-lg border p-6`}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{label}</div>
        {IconComp ? (
          <div className={`rounded ${iconBgColor || "bg-slate-100"} p-1.5`}>
            <IconComp className="h-4 w-4 text-slate-700" />
          </div>
        ) : null}
      </div>
      <div className="mt-4 text-3xl font-bold">{value}</div>
      <div className="mt-3 text-sm">
        <p className={`${progressLabelColor || "text-slate-500"}`}>{progressText}</p>
      </div>
    </div>
  );
}

export default StatCard;
