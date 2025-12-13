"use client";
import React from "react";
import RegisterSchoolForm from "../../components/RegisterSchoolForm";
import { ToastProvider } from "../../components/ui/use-toast";

export default function RegisterPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="mx-auto max-w-xl">
            <RegisterSchoolForm />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
