"use client";
import React, { useState } from "react";
import Image from "next/image";
import UnifiedLoginForm from "../../components/ui/UnifiedLoginForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Page() {
  const [role, setRole] = useState<"admin" | "teacher" | "student">("admin");

  return (
    <>
      <div className="grid lg:grid-cols-2">
        <div className="overflow-hidden">
          <Image
            src="/images/Login.png"
            alt="Login Illustration"
            width={1920}
            height={1000}
            className="w-full h-full object-cover hidden lg:block"
          />
        </div>
        <div className="flex bg-blue-300 flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
    </>
  );
}
