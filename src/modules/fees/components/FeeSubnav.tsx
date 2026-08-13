"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/fees", label: "Dashboard", exact: true },
  { href: "/admin/fees/categories", label: "Categories" },
  { href: "/admin/fees/structures", label: "Structures" },
  { href: "/admin/fees/collect", label: "Collect" },
  { href: "/admin/fees/payments", label: "Payments" },
  { href: "/admin/fees/reports", label: "Reports" },
];

export function FeeSubnav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              active
                ? "bg-[#DBEAFE] text-[#021034]"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
