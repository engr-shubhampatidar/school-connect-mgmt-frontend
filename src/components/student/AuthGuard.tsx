"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../lib/auth";

export default function StudentAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const token = getToken("student");
    if (!token) {
      router.replace("/student/login");
    }
  }, [router]);

  return <>{children}</>;
}
