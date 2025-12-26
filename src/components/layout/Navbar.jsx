"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { adminNav, studentNav, teacherNav } from "../layout/navConfig";
export default function Navbar() {
  const pathname = usePathname();
  let navItems = [];

  if (pathname.startsWith("/admin")) {
    navItems = adminNav;
  } else if (pathname.startsWith("/teacher")) {
    navItems = teacherNav;
  } else if (pathname.startsWith("/student")) {
    navItems = studentNav;
  } else {
    return null; // No navbar for other routes
  }
  return (
    <div className="flex h-screen bg-slate-50 sticky top-0 left-0 z-10">
      <aside className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200  px-0  py-4 pt-0">
        <div className="flex flex-col h-full">
          <div>
            <div className="text-2xl font-semibold text-slate-900 border-b border-slate-200 pb-8 pt-5 min-h-[85px] flex items-center justify-center">
              Acme Inc.
            </div>
            <nav className="mt-8 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center rounded-md ${
                        pathname === item.href
                          ? "bg-[#DBEAFE] text-blue-700"
                          : "text-slate-700"
                      } px-2 my-2 gap-2 hover:bg-slate-100`}
                    >
                      <Icon className="w-5 h-5" />
                      <SidebarItem
                        label={item.label}
                        active={pathname === item.href}
                      />
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto">
            <div className="border-t border-slate-100 pt-4 px-4 space-y-2">
              <SidebarItem label="Settings" small />
              <SidebarItem label="Get help" small />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SidebarItem({ label, active = false, small = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-2 py-2 rounded-md ${
        active ? " text-blue-700" : "text-slate-700"
      }`}
    >
      <div className={`${small ? "text-sm" : "font-medium"}`}>{label}</div>
    </div>
  );
}
