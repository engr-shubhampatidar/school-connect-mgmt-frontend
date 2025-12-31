"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { adminNav, studentNav, teacherNav } from "./navConfig";
import { useState } from "react";
import { Settings, HeartHandshake, PanelRight } from "lucide-react";
import { getUser } from "../../lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  let navItems = [];
  const [openSidebar, setOpenSidebar] = useState(true);

  const [userName] = useState<string | null>(() => {
    try {
      const u = getUser("admin");
      return (u && (u.fullName ?? u.name)) || null;
    } catch {
      return null;
    }
  });

  const handleSideBar = () => setOpenSidebar((v) => !v);

  if (pathname.startsWith("/admin")) {
    navItems = adminNav;
  } else if (pathname.startsWith("/teacher")) {
    navItems = teacherNav;
  } else if (pathname.startsWith("/student")) {
    navItems = studentNav;
  } else {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 sticky top-0 left-0 z-10">
      <aside
        className={`${
          openSidebar ? "w-72" : "w-20"
        } h-screen sticky top-0 bg-white border-r border-slate-200  px-0  py-4 pt-0`}
      >
        <div className="flex flex-col h-full">
          <div>
            <div className="text-2xl font-semibold text-slate-900 border-b border-slate-200 pb-8 pt-5 min-h-[85px] flex items-center justify-center">
              {openSidebar ? (
                <div className="flex items-center justify-center ">
                  <PanelRight
                    onClick={handleSideBar}
                    className="w-6 h-6 inline-block mr-2 text-slate-600 cursor-pointer"
                  />
                  {userName ?? "Acme Inc."}
                </div>
              ) : (
                <PanelRight
                  onClick={handleSideBar}
                  className="w-6 h-6 text-slate-600 cursor-pointer"
                />
              )}
            </div>
            <nav className="mt-8 px-4 space-y-1 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center rounded-md ${
                        pathname === item.href
                          ? `${
                              openSidebar
                                ? "bg-[#DBEAFE]  text-blue-700"
                                : "text-blue-700"
                            }`
                          : "text-slate-700"
                      } px-2 my-2 gap-2 ${
                        openSidebar
                          ? "hover:bg-slate-100"
                          : "justify-center py-2"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {openSidebar && (
                        <SidebarItem
                          label={item.label}
                          active={pathname === item.href}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto">
            <div className="border-t-2 border-slate-100 pt-4 px-4 space-y-2">
              <div
                className={`flex items-center ${
                  openSidebar ? "justify-start" : "justify-center py-2"
                }`}
              >
                <Settings
                  className={`w-5 h-5 inline-block mr-2 text-slate-600`}
                />
                {openSidebar && <SidebarItem label="Settings" />}
              </div>
              <div
                className={`flex items-center ${
                  openSidebar ? "justify-start" : "justify-center py-2"
                }`}
              >
                <HeartHandshake className="w-5 h-5 inline-block mr-2 text-slate-600" />
                {openSidebar && <SidebarItem label="Get help" />}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SidebarItem({
  label,
  active = false,
  small = false,
}: {
  label: string;
  active?: boolean;
  small?: boolean;
}) {
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
