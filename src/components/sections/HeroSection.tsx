"use client";
import React from "react";
import { Button } from "@/components/ui";

export default function HeroSection() {
  return (
    <section id="home" className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Smarter Tools for Student Success
          </h1>
          <p className="mt-4 text-slate-700 max-w-xl">
            One platform to manage attendance, track academic performance, and
            coordinate parent and teacher engagement — built for modern
            institutions that prioritize student outcomes.
          </p>

          <ul className="mt-6 space-y-2 text-slate-600">
            <li>• Reliable attendance & roll-calls</li>
            <li>• Real-time performance tracking</li>
            <li>• Centralized academic records</li>
          </ul>

          <div className="mt-8">
            <Button className="rounded-2xl px-6 py-3 text-lg">
              Get Started →
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="h-72 md:h-96 bg-gradient-to-br from-sky-50 to-slate-100 rounded-2xl shadow-md overflow-hidden flex items-center justify-center">
            <div className="text-slate-400">
              [Student illustration placeholder]
            </div>
          </div>

          <div className="absolute -right-6 top-8 w-40 p-3 rounded-xl bg-white shadow-lg border border-slate-100">
            <div className="text-xs text-slate-500">Attendance</div>
            <div className="font-semibold">98.6%</div>
          </div>

          <div className="absolute -left-6 bottom-10 w-44 p-3 rounded-xl bg-white shadow-lg border border-slate-100">
            <div className="text-xs text-slate-500">GPA Trend</div>
            <div className="font-semibold">+0.4 this term</div>
          </div>
        </div>
      </div>
    </section>
  );
}
