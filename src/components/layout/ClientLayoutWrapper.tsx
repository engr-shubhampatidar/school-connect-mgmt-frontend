"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Topbar from "./Topbar";
import { ToastProvider } from "../ui/use-toast";

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
    pathname === "/unauthorized";

  return (
    <div className="flex">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 bg-[#F5F9FF] ">
        {!hideNavbar && <Topbar />}
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
