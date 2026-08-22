"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/leaves", label: "Approvals", exact: true },
  { href: "/admin/leaves/allocation", label: "Allocation" },
];

export function AdminLeaveSubnav() {
  const pathname = usePathname();

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "rounded-md bg-[#DBEAFE] px-3 py-1.5 text-sm font-medium text-[#021034]"
                : "rounded-md border border-[#D7E3FC] bg-white px-3 py-1.5 text-sm text-[#64748B]"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
