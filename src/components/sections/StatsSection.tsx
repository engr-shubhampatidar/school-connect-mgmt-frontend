import React from "react";

const stats = [
  { label: "Institutes", value: "500+" },
  { label: "Students Managed", value: "100k+" },
  { label: "Support", value: "24/7" },
  { label: "Uptime", value: "99.9%" },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-slate-800/60 p-6 text-center shadow-sm"
            >
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="mt-2 text-slate-300">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
