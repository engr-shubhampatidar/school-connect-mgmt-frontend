"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui";

const tabs = [
  "Student Dashboard",
  "Teacher Dashboard",
  "Parent Dashboard",
  "Admin Dashboard",
];

export default function DashboardTabs() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-12 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold">
          Everything Your Institution Needs
        </h2>
        <p className="mt-2 text-slate-300 max-w-2xl mx-auto">
          Powerful dashboards and analytics to monitor attendance, performance,
          and administrative workflows from a single pane of glass.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          {tabs.map((t, i) => (
            <Button
              key={t}
              onClick={() => setActive(i)}
              variant={active === i ? "default" : "ghost"}
              className={`rounded-full px-4 py-2 text-sm ${
                active === i ? "shadow-md" : ""
              }`}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
