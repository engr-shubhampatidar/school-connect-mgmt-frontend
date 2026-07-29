"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Product", href: "/#product" },
  { label: "Schools", href: "/#schools" },
  { label: "Roles", href: "/#roles" },
  { label: "Contact", href: "/contact" },
];

export default function AksharNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#D7E3FC]/80 bg-[#F3F6FC]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#021034]"
        >
          Akshar
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#021034]/70 transition hover:text-[#021034]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg bg-[#021034] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#021034]/90"
          >
            Sign in
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden text-[#021034]"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#D7E3FC] bg-[#F3F6FC] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#021034]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-[#021034] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Sign in
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
