"use client";

export default function InfoField({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-[#021034]">{value ?? "-"}</div>
    </div>
  );
}
