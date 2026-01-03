"use client";
import React from "react";
import Image from "next/image";
import UnifiedLoginForm from "../../components/ui/UnifiedLoginForm";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:flex items-center justify-center pl-12">
            <Image
              src="/images/TeacherLoginImg.png"
              alt="Login Illustration"
              width={800}
              height={560}
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-center">
            <UnifiedLoginForm defaultRole="admin" />
          </div>
        </div>
      </div>
    </div>
  );
}
