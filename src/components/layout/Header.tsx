"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui";

export default function Header() {
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="w-full bg-gradient-to-r from-sky-50 to-sky-100 text-sky-800 text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Join Our Personalized Nutrition Demo For Free
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="leading-tight">
              <div className="font-semibold">SchoolConnect</div>
              <div className="text-xs text-slate-500">Institute Management</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-slate-700 hover:text-slate-900"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-slate-700">
              <Phone className="h-4 w-4 text-sky-600" />
              <span className="font-medium">+1 (800) 555-0199</span>
            </div>
            <div className="md:block hidden">
              <Button className="rounded-xl">Request Demo</Button>
            </div>

            <button
              onClick={() => setOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md bg-slate-100"
              aria-label="Toggle menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-slate-700"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-4 py-3 flex flex-col gap-2">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="py-2 px-2 rounded-md text-slate-700 hover:bg-slate-50"
                >
                  {n.label}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-2">
                <Phone className="h-4 w-4 text-sky-600" />
                <span className="text-sm">+1 (800) 555-0199</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
