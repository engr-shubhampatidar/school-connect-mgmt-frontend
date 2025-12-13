"use client";
import React from "react";
import Card from "../ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function StatCard({ label, value, icon: IconComp }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="mt-1 text-2xl font-semibold text-slate-900">
          {value}
        </span>
      </div>
      {IconComp ? (
        <div className="rounded-full bg-slate-100 p-2">
          <IconComp className="h-6 w-6 text-slate-700" />
        </div>
      ) : null}
    </Card>
  );
}

export default StatCard;
