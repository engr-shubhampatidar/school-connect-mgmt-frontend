"use client";
import React, { useState } from "react";
import Image from "next/image";
import UnifiedLoginForm from "../../components/ui/UnifiedLoginForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Page() {
  const [role, setRole] = useState<"admin" | "teacher" | "student">("admin");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-md">
          <div className="flex items-start gap-6">
            <div className="hidden sm:flex items-center justify-center w-28">
              <Image
                src="/images/TeacherLoginImg.png"
                alt="Login Illustration"
                width={160}
                height={112}
                className="object-contain opacity-70"
              />
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-slate-900">
                  Sign in to SchoolConnect
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Secure access for Admins, Teachers and Students.
                </p>
              </div>

              <div className="mb-4" role="tablist" aria-label="Login role">
                <div className="flex gap-2">
                  {(["admin", "teacher", "student"] as const).map((r) => {
                    const active = role === r;
                    return (
                      <Button
                        key={r}
                        onClick={() => setRole(r)}
                        variant={active ? "default" : "ghost"}
                        className={`px-3 py-1.5 text-sm ${
                          active ? "shadow-sm" : ""
                        }`}
                        aria-selected={active}
                        role="tab"
                      >
                        {r[0].toUpperCase() + r.slice(1)}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full">
                <UnifiedLoginForm key={role} defaultRole={role} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
