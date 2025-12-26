"use client";
import React from "react";
import Card from "../ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  className: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function StatCard({
  label,
  value,
  className,
  icon: IconComp,
}: StatCardProps) {
  return (
    <div
      className={`${className} rounded-lg border p-6`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{label}</div>
        {IconComp ? (
          <div className="rounded-full">
            <IconComp className="h-6 w-6 text-slate-700" />
          </div>
        ) : null}
      </div>
      <div className="mt-4 text-3xl font-bold">{value}</div>
      <div className="mt-3 text-sm text-slate-600">
        <span className="text-orange-500">• Work in progress</span>
      </div>
    </div>
  );
}

export default StatCard;
