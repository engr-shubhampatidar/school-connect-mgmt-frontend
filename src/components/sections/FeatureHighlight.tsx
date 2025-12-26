import React from "react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui";

export default function FeatureHighlight() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 py-12">
      <Card className="rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">
            Centralized Student Management
          </h3>
          <p className="mt-3 text-slate-700">
            Manage student records, enrollment, attendance and performance in
            one secure and auditable system. Role-based access ensures teachers,
            parents and admins see the right information.
          </p>

          <div className="mt-6">
            <Button variant="ghost" className="rounded-xl">
              Read More →
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="h-48 w-full bg-gradient-to-br from-slate-50 to-sky-50 rounded-xl shadow-sm flex items-center justify-center text-slate-400">
            [Management UI Snapshot]
          </div>
        </div>
      </Card>
    </section>
  );
}
