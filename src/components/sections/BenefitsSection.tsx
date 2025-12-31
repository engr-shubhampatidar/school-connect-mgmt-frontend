"use client";
import React from "react";
import Card from "@/components/ui/Card";
import {
  Users,
  BookOpen,
  Clock,
  DollarSign,
  MessageSquare,
  BarChart2,
} from "lucide-react";

const topCards = [
  {
    title: "For Schools",
    desc: "Optimized workflows for K-12 institutions, attendance automation and parent communications.",
    icon: Users,
  },
  {
    title: "For Colleges",
    desc: "Scale operations across departments with role-based access and advanced reporting.",
    icon: BookOpen,
  },
];

const items = [
  {
    title: "Save Time with Automation",
    desc: "Automate routine tasks and reduce manual overhead.",
    icon: Clock,
  },
  {
    title: "Improve Operational Efficiency",
    desc: "Streamline scheduling, rostering and resource allocation.",
    icon: BarChart2,
  },
  {
    title: "Increase Fee Collection Accuracy",
    desc: "Integrated billing, invoicing and reconciliation tools.",
    icon: DollarSign,
  },
  {
    title: "Parent & Student Engagement",
    desc: "Two-way communication channels and progress reports.",
    icon: MessageSquare,
  },
  {
    title: "Gain Actionable Insights",
    desc: "Built-in analytics to identify at-risk students and trends.",
    icon: BarChart2,
  },
  {
    title: "Scale with Confidence",
    desc: "Enterprise-grade security and 24/7 support to grow safely.",
    icon: Users,
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            Benefits That Simplify Institute Operations
          </h2>
          <p className="mt-2 text-slate-600">
            Designed to reduce administrative burden and improve student
            outcomes through better data and workflows.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {topCards.map((c) => {
              const Icon = c.icon;
              return (
                <Card
                  key={c.title}
                  className="rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {c.desc}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <Card
                  key={it.title}
                  className="rounded-xl hover:shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white text-sky-600 border border-slate-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {it.desc}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
