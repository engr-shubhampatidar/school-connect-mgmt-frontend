"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AdminAuthGuard from "../../components/admin/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply auth guard to login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
