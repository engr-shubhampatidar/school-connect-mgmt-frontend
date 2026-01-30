"use client";
import React from "react";
import studentApi from "../../../lib/studentApi";
import { useToast } from "../../../components/ui/use-toast";
import AttendanceSummary from "./components/AttendanceSummary";

export default function Page() {
  return <Inner />;
}

function Inner() {
  const [me, setMe] = React.useState<any>(null);
  const [summary, setSummary] = React.useState<any>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

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
        <section className="pl-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] lg:text-[24px] text-[#021034] font-[600]">
                Welcome, Student
              </h1>
              <p className="mt-1 text-[12px] lg:text-sm text-[#737373]">
                View Your Attendance and Result updates.
              </p>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Class Item */}
          <div className=" col-span-2 border border-[#D7E3FC] grid rounded-xl bg-white w-full mr-6">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-[8px] py-[16px] lg:px-6 py-6 border-b border-[#D7E3FC] last:border-b-0"
              >
                {/* Left */}
                <div className="space-y-2">
                  <p className="font-medium text-[#021034]">Mathematics</p>

                  <div className="flex items-center gap-2 lg:gap-4 text-sm text-[#737373]">
                    <div className="flex items-center gap-1">
                      ⏱ <span>8:00–8:30</span>
                    </div>

                    <div className="flex items-center gap-1">
                      👥 <span>Dr.dhima rao</span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="rounded-full border border-[#D7E3FC] bg-blue-50 px-4 py-1 text-xs font-semibold text-[#021034]">
                  Room 204
                </div>
              </div>
            ))}
          </div>
          <div className="w-full max-w-full flex justify-center items-center">
            <AttendanceSummary
              presentDays={85}
              absentDays={5}
              monthlyPercentage={96}
            />
          </div>
        </div>
        <div className="w-full min-w-full rounded-xl border border-[#D7E3FC] bg-white overflow-hidden mt-6">
          <div className="flex items-start justify-between px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#021034]">
                Recent Updates
              </h2>
              <p className="text-sm text-[#737373]">
                Check complete update at same time.
              </p>
            </div>

            <button className="text-sm text-[#737373] hover:text-blue-600 transition">
              View all activity
            </button>
          </div>

          <div className="border-t border-[#D7E3FC]" />

          <div className="flex items-start justify-between px-6 py-4 border-b border-[#D7E3FC]">
            <div className="flex gap-3">
              <span className="mt-1 h-4 w-4 rounded-full border border-[#D7E3FC] flex items-center justify-center text-[10px] text-blue-600">
                i
              </span>
              <div>
                <p className="text-sm font-medium text-[#021034]">
                  Unit Test Schedule Released
                </p>
                <p className="text-sm text-[#737373]">
                  Mathematics and science test Scheduled for next week
                </p>
              </div>
            </div>
            <span className="text-xs text-[#737373] whitespace-nowrap">
              2 min ago
            </span>
          </div>

          <div className="flex items-start justify-between px-6 py-4 border-b border-[#D7E3FC]">
            <div className="flex gap-3">
              <span className="mt-1 h-4 w-4 rounded-full border border-[#D7E3FC] flex items-center justify-center text-[10px] text-blue-600">
                i
              </span>
              <div>
                <p className="text-sm font-medium text-[#021034]">
                  School Holiday On Friday
                </p>
                <p className="text-sm text-[#737373]">
                  Campus Closed for Independence Day Celebration
                </p>
              </div>
            </div>
            <span className="text-xs text-[#737373] whitespace-nowrap">
              2 hours ago
            </span>
          </div>
          <div className="flex items-start justify-between px-6 py-4">
            <div className="flex gap-3">
              <span className="mt-1 h-4 w-4 rounded-full border border-[#D7E3FC] flex items-center justify-center text-[10px] text-blue-600">
                i
              </span>
              <div>
                <p className="text-sm font-medium text-[#021034]">
                  Fees Due Reminder
                </p>
                <p className="text-sm text-[#737373]">
                  Next payment due by march 15th
                </p>
              </div>
            </div>
            <span className="text-xs text-[#737373] whitespace-nowrap">
              Yesterday
            </span>
          </div>
        </div>

        <div className="w-full maxw-full bg-white rounded-xl border border-[#D7E3FC] p-[20px] mt-6">
          <h2 className="text-lg font-semibold text-[#021034] mb-4">
            Uploaded Documents
          </h2>

          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between border border-[#D7E3FC] rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#D7E3FC]">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-[#021034]">
                    Aadhar Card
                  </p>
                  <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-[#021034] border border-[#D7E3FC] rounded-full">
                    PDF
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#737373] text-sm cursor-pointer hover:text-blue-600">
                👁
                <span>View</span>
              </div>
            </div>

            <div className="flex items-center justify-between border border-[#D7E3FC] rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#D7E3FC]">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-[#021034]">
                    Previous Marksheet
                  </p>
                  <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-[#021034] border border-[#D7E3FC] rounded-full">
                    PDF
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#737373] text-sm cursor-pointer hover:text-blue-600">
                👁
                <span>View</span>
              </div>
            </div>

            <div className="flex items-center justify-between border border-[#D7E3FC] rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#D7E3FC]">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-[#021034]">
                    Birth Certificate
                  </p>
                  <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-[#021034] border border-[#D7E3FC] rounded-full">
                    PDF
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#737373] text-sm cursor-pointer hover:text-blue-600">
                👁
                <span>View</span>
              </div>
            </div>

            <div className="flex items-center justify-between border border-[#D7E3FC] rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#D7E3FC]">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-[#021034]">
                    Transfer Certificate
                  </p>
                  <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-[#021034] border border-[#D7E3FC] rounded-full">
                    PDF
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#737373] text-sm cursor-pointer hover:text-blue-600">
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
