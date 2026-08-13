"use client";
import React, { useState } from "react";
import Image from "next/image";
import UnifiedLoginForm from "@/modules/auth/components/UnifiedLoginForm";
import type { Role } from "@/types/auth";

const LOGIN_ROLES: Role[] = ["admin", "teacher", "student", "parent"];

function portalTitle(role: Role) {
  switch (role) {
    case "admin":
      return "Admin Portal";
    case "teacher":
      return "Teacher Portal";
    case "student":
      return "Student Portal";
    case "parent":
      return "Parent Portal";
  }
}

export default function Page() {
  const [role, setRole] = useState<Role>("admin");

  return (
    <>
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="relative w-full h-screen lg:flex hidden">
          <Image
            src="/images/Login.png"
            alt="Teacher Login Illustration"
            fill
            className="object-cover lg:flex hidden"
          />

          <div className="absolute w-1/2 lg:flex items-start justify-start hidden flex-col pl-12 pt-12">
            <div className="w-full flex items-center mb-92">
              <h1 className="font-bold text-2xl text-white max-w-[100px]">
                MAXUSE INSTITUTE
              </h1>
            </div>

            <div className="mb-70"></div>

            <div className="flex flex-col text-white sticky bottom-0">
              <h1 className="text-[48px] font-[600] leading-[56px] mb-4">
                Sign in to SchoolConnect
              </h1>
              <p>Secure access for Admin, Teachers, Students and Parents</p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between pb-2 z-50  px-4 sm:px-6 lg:px-8">
          <div className="h-16"></div>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <Image
                src="/images/Avatar.png"
                alt="SchoolConnect Logo"
                width={74}
                height={74}
                className="mx-auto h-16 w-auto mb-5"
              />
              <h1 className="text-xl font-semibold text-slate-900 text-center">
                Sign in to {portalTitle(role)}
              </h1>
              <p className="mt-1 text-sm text-slate-500 text-center">
                Secure access for Admins, Teachers, Students and Parents.
              </p>
            </div>

            <div className="mb-4" role="tablist" aria-label="Login role">
              <div className="flex flex-wrap gap-2 bg-[#EEF4FF] p-1 rounded-lg w-fit justify-center">
                {LOGIN_ROLES.map((r) => {
                  const active = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-3 py-1.5 text-sm ${
                        active ? "shadow-sm bg-white rounded-lg" : ""
                      }`}
                      aria-selected={active}
                      role="tab"
                    >
                      {r[0].toUpperCase() + r.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center ">
              <UnifiedLoginForm key={role} defaultRole={role} />
              <div className="flex items-center justify-center flex-col gap-2 mt-5">
                <p>Having trouble logging in?</p>
                <a href="#" className="text-blue-600 hover:underline text-sm ">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
          <p className=" text-center text-sm text-slate-500 sticky bottom-0 ">
            © 2024 Maxuse Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
