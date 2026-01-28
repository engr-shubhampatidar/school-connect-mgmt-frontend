"use client";

import Link from "next/link";
// import { Button } from "@/components/ui/button";

export default function RegisterNavbar() {
  return (
    <header className="w-full bg-gradient-to-r from-[#061a44] to-[#0a2a6b] text-white">
      <div className="mx-auto px-4 lg:px-20">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <span className="inline-block h-3 w-3 rounded-full border border-white" />
              Acme Inc.
            </span>

            {/* Divider */}
            <span className="hidden sm:inline-block h-4 w-px bg-white/40" />

            {/* Text */}
            <span className="hidden sm:block text-white/90">
              Use this form to register your school and create the primary
              administrator account.
            </span>
          </div>

          {/* Right Section */}
          <div className="text-sm">
            <span className="text-white/80 hidden sm:inline">
              Already have an account?
            </span>{" "}
            <Link
              href="/login"
              className="font-medium text-blue-300 hover:text-blue-200 underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
