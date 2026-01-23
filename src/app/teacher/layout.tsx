"use client";
import React from "react";
import { usePathname } from "next/navigation";
import TeacherAuthGuard from "../../components/teacher/AuthGuard";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply auth guard to login page
  if (pathname === "/teacher/login") {
    return <>{children}</>;
  }
  
  return <TeacherAuthGuard>{children}</TeacherAuthGuard>;
}
