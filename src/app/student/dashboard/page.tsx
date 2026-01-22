"use client";
import React from "react";
import StudentAuthGuard from "../../../components/student/AuthGuard";
import studentApi from "../../../lib/studentApi";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  return (
    <StudentAuthGuard>
      <Inner />
    </StudentAuthGuard>
  );
}

function Inner() {
  const [me, setMe] = React.useState<any>(null);
  const [summary, setSummary] = React.useState<any>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);
  const router = useRouter();

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [r1, r2] = await Promise.all([
          studentApi.get("/api/student/me"),
          studentApi.get("/api/student/attendance"),
        ]);
        if (!mounted) return;
        setMe(r1.data);
        setSummary(r2.data);
      } catch (err: any) {
        toastRef.current?.({
          title: "Error",
          description: err?.message ?? "Failed to load",
          type: "error",
        });
      }
    }
    load();
    return () => {
      mounted = false;
    };
    // run once on mount — toast is referenced via ref to avoid re-running when its identity changes
  }, []);

  return (
    <div className="p-6">
      <div>
        
        {/* Class Item */}
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-6 py-4 border-b border-blue-200 last:border-b-0"
          >
            {/* Left */}
            <div className="space-y-2">
              <p className="font-medium text-[#021034]">Mathematics</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  ⏱ <span>8:00–8:30</span>
                </div>

                <div className="flex items-center gap-1">
                  👥 <span>Dr.dhima rao</span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-[#021034]">
              Room 204
            </div>
          </div>
        ))}
        <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[20px]">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Uploaded Documents
        </h2>

        {/* Document Item */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aadhaar Card */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Aadhar Card</p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>

          {/* Previous Marksheet */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Previous Marksheet
                </p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>

          {/* Birth Certificate */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Birth Certificate
                </p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>

          {/* Transfer Certificate */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Transfer Certificate
                </p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
