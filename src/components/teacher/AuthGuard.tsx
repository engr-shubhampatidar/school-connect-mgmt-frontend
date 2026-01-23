"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../lib/auth";

export default function TeacherAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    const token = getToken("teacher");
    if (!token) {
      router.replace("/teacher/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
