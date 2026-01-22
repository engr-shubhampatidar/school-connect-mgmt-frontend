"use client";
import React from "react";
import RegisterSchoolForm from "../../components/RegisterSchoolForm";
import { ToastProvider } from "../../components/ui/use-toast";
import RegisterNavbar from "./components/RegisterNavbar";

export default function RegisterPage() {
  return (
    <ToastProvider>
      <RegisterNavbar />
      <div className="min-h-full bg-slate-50 grid grid-cols-1 lg:grid-cols-2 ">
        <div className="w-full hidden lg:flex items-center justify-center p-8 bg-[#EEF4FF]">
          <div className="w-full mx-auto rounded-xl border border-[#D7E3FC] text-white p-6 flex flex-col justify-between min-h-full">
            {/* Top Content */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#021034]">
                Before You Begin
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed">
                In this section, you will provide basic information about the
                school administrator and the institution. This information is
                required to set up secure access and ensure accurate academic
                configuration.
              </p>

              {/* Info Box */}
              <div className="flex gap-3 items-start rounded-lg bg-blue-100 text-blue-900 p-4">
                <div className="mt-0.5">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>

                <div className="text-sm">
                  <p className="font-medium">
                    Are you unsure how to complete this section?
                  </p>
                  <a href="#" className="text-blue-600 hover:underline text-sm">
                    Learn more about required information and acceptable
                    formats.
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Help Section */}
            <div className="space-y-3">
              <div className="rounded-lg bg-amber-100 text-amber-900 p-4">
                <p className="font-semibold text-sm mb-1">Need Help?</p>
                <p className="text-sm text-amber-800">
                  If you have questions while completing this registration,
                  support is available.
                </p>
                <p className="text-sm text-amber-800 mt-2">
                  You may contact the school system support team during business
                  hours or email us using the link below.
                </p>
              </div>

              <div className="text-center">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-sm font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex md:items-center bg-[#EEF4FF]">
          <RegisterSchoolForm />
        </div>
      </div>
    </ToastProvider>
  );
}
