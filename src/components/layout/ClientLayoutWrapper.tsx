"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Topbar from "./Topbar";
import { AuthBootstrap } from "@/providers";

export default function ClientLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/login" ||
    pathname === "/register-school" ||
    pathname === "/" ||
    pathname === "/unauthorized" ||
    pathname === "/contact";

  return (
    <div className="flex">
      <AuthBootstrap />
      {!hideNavbar && <Navbar />}
      <main className="flex-1 bg-[#F5F9FF] ">
        {!hideNavbar && <Topbar />}
        {children}
      </main>
    </div>
  );
}
