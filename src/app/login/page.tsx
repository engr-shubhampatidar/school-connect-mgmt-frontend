"use client";
import React, { useState } from "react";
import Image from "next/image";
import UnifiedLoginForm from "../../components/ui/UnifiedLoginForm";
import Button from "../../components/ui/Button";

export default function Page() {
  const [role, setRole] = useState<"admin" | "teacher" | "student">("admin");

  return (
    <>
      <div className="grid lg:grid-cols-2 ">
        <div className="absolute w-1/2  lg:flex items-start justify-start hidden flex-col pl-12 pt-12">
          <div className="w-full flex items-center mb-92">
            <h1 className="font-bold text-2xl text-white max-w-[100px]">
              MAXUSE INSTITUTE
            </h1>
          </div>
          <div className="mb-70"></div>
          <div className="flex flex-col text-white sticky bottom-0">
            <h1 className="text-white text-[48px]  font-[600] leading-[56px] mb-4">
              Sign in to SchoolConnect
            </h1>
            <p>Secure access For Admin, Teachers and Student</p>
          </div>
        </div>
        <Image
          src="/images/Login.png"
          alt="Teacher Login Illustration"
          width={1600}
          height={800}
          className="hidden h-screen lg:flex"
        />
        <div className="flex w-full flex-col items-center justify-between pb-2  px-4 sm:px-6 lg:px-8">
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
                Sign in to{" "}
                {role === "admin"
                  ? " Admin Portal"
                  : role === "teacher"
                    ? " Teacher Portal"
                    : " Student Portal"}
              </h1>
              <p className="mt-1 text-sm text-slate-500 text-center">
                Secure access for Admins, Teachers and Students.
              </p>
            </div>

            <div className="mb-4" role="tablist" aria-label="Login role">
              <div className="flex gap-2 bg-[#EEF4FF] p-1 rounded-lg w-fit">
                {(["admin", "teacher", "student"] as const).map((r) => {
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
