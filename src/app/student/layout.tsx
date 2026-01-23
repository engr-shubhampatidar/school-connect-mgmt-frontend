"use client";
import React from "react";
import { usePathname } from "next/navigation";
import StudentAuthGuard from "../../components/student/AuthGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply auth guard to login page
  if (pathname === "/student/login") {
    return <>{children}</>;
  }
  
  return <StudentAuthGuard>{children}</StudentAuthGuard>;
}
