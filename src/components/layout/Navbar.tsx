"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { adminNav, studentNav, teacherNav, managementNav, parentNav } from "./navConfig";
import { useState } from "react";
import { Settings, HeartHandshake, PanelRight } from "lucide-react";
import { getUser } from "@/modules/auth";
import { roleFromPath } from "@/lib/roleFromPath";

export default function Navbar() {
  const pathname = usePathname();
  let navItems = [];
  let managementNavItems: typeof managementNav = [];
  const [openSidebar, setOpenSidebar] = useState(false);

  const [userName] = useState<string | null>(() => {
    try {
      const role = roleFromPath(pathname) ?? "student";
      const u = getUser(role);
      return (u && (u.school?.name ?? u.name)) || null;
    } catch {
      return null;
    }
  });

  const handleSideBar = () => setOpenSidebar((v) => !v);

  if (pathname.startsWith("/admin")) {
    navItems = adminNav;
    managementNavItems = managementNav;
  } else if (pathname.startsWith("/teacher")) {
    navItems = teacherNav;
  } else if (pathname.startsWith("/student")) {
    navItems = studentNav;
  } else if (pathname.startsWith("/parent")) {
    navItems = parentNav;
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
        <div className="flex flex-col min-h-full h-screen justify-between">
          <div>
            <div className="text-2xl font-semibold text-slate-900 border-b border-slate-200 min-h-[85px] flex items-center justify-center">
              {openSidebar ? (
                <div className="flex items-center justify-center  font-semibold text-xl ">
                  <PanelRight
                    onClick={handleSideBar}
                    className="w-6 h-6 inline-block mr-2 text-slate-600 cursor-pointer"
                  />
                  {userName ?? "School."}
                </div>
              ) : (
                <PanelRight
                  onClick={handleSideBar}
                  className="w-6 h-6 text-slate-600 cursor-pointer"
                />
              )}
            </div>
            <nav className="mt-8 px-4 space-y-1 gap-2">
              {openSidebar && (
                <p className="text-[12px] font-[500] text-[#64748B] mb-2 ml-2">
                  Overview....
                </p>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    item.href !== "/teacher/dashboard" &&
                    item.href !== "/student/dashboard" &&
                    item.href !== "/parent/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center rounded-md ${
                        active
                          ? `${
                              openSidebar
                                ? "bg-[#DBEAFE]  text-[#021034]"
                                : "text-[#021034]"
                            }`
                          : "text-[#737373]"
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
                          active={active}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
              {openSidebar && (
                <p className="text-[12px] font-[500] text-[#64748B] mb-2 ml-2">
                  {pathname.startsWith("/admin") ? "Management" : ""}
                </p>
              )}
              {managementNavItems.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center rounded-md ${
                        active
                          ? `${
                              openSidebar
                                ? "bg-[#DBEAFE] text-[#021034]"
                                : "text-[#021034]"
                            }`
                          : "text-[#737373]"
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
                          active={active}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto sticky bottom-0 ">
            <div className="border-t-2 border-slate-100 pt-4 px-4 space-y-2 sticky bottom-0 bg-white">
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
        active ? " text-[#021034]" : "text-[#737373] font-[400]"
      }`}
    >
      <div className={`${small ? "text-sm" : "font-medium"}`}>{label}</div>
    </div>
  );
}
