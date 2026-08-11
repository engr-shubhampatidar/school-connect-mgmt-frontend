"use client";

import Link from "next/link";
import {
  CreditCard,
  IndianRupee,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatCardsGridSkeleton } from "@/components/skeletons";
import {
  FeeSubnav,
  formatInr,
  useFeeDashboard,
  useStudentFeeSummaries,
} from "@/modules/fees";

export default function AdminFeesDashboardPage() {
  const { data, isLoading, error, refetch } = useFeeDashboard();
  const overdueQuery = useStudentFeeSummaries({
    page: 1,
    limit: 20,
  });
  const overdueStudents = (overdueQuery.data?.data ?? [])
    .filter((row) => row.statusSummary === "OVERDUE")
    .slice(0, 5);

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Fees & Finance
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Dashboard, collection, and fee configuration
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/fees/collect">
            <Button variant="dark">Collect fees</Button>
          </Link>
          <Link href="/admin/fees/structures">
            <Button variant="ghost">Structures</Button>
          </Link>
        </div>
      </div>

      <FeeSubnav />

      {isLoading ? (
        <StatCardsGridSkeleton count={4} />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3 p-2">
            <p className="text-sm text-slate-700">
              Failed to load fee dashboard.
            </p>
            <Button variant="dark" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total collected"
              value={formatInr(data?.totalCollected ?? 0)}
              icon={IndianRupee}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel={`This month ${formatInr(data?.collectedThisMonth ?? 0)}`}
              progressLabelColor="text-[#16A34A]"
            />
            <StatCard
              label="Outstanding"
              value={formatInr(data?.totalOutstanding ?? 0)}
              icon={CreditCard}
              className="bg-white border-[#FECACA]"
              iconBgColor="bg-[#FECACA]"
              progressLabel={`${data?.pendingFeesCount ?? 0} pending fees`}
              progressLabelColor="text-[#DC2626]"
            />
            <StatCard
              label="Overdue"
              value={data?.overdueCount ?? 0}
              icon={AlertTriangle}
              className="bg-white border-[#FED7AA]"
              iconBgColor="bg-[#FED7AA]"
              progressLabel="Assignments past due"
              progressLabelColor="text-[#EA580C]"
            />
            <StatCard
              label="Payments today"
              value={data?.paymentsToday ?? 0}
              icon={CalendarDays}
              className="bg-white border-[#DDD6FE]"
              iconBgColor="bg-[#DDD6FE]"
              progressLabel="Successful collections"
              progressLabelColor="text-slate-500"
            />
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h3 className="text-base font-semibold text-[#021034]">
                By category
              </h3>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 pr-3">Collected</th>
                      <th className="py-2">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.byCategory ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-slate-500">
                          No category data yet
                        </td>
                      </tr>
                    ) : (
                      data?.byCategory.map((row) => (
                        <tr key={row.categoryId} className="border-t">
                          <td className="py-2 pr-3">{row.categoryName}</td>
                          <td className="py-2 pr-3">
                            {formatInr(row.collected)}
                          </td>
                          <td className="py-2">
                            {formatInr(row.outstanding)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#021034]">
                  Overdue fees
                </h3>
                <Link
                  href="/admin/fees/collect"
                  className="text-sm text-blue-700 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2 pr-3">Student</th>
                      <th className="py-2 pr-3">Fee</th>
                      <th className="py-2">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueStudents.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-slate-500">
                          No overdue fees
                        </td>
                      </tr>
                    ) : (
                      overdueStudents.map((fee) => (
                        <tr key={fee.studentUserId} className="border-t">
                          <td className="py-2 pr-3">
                            <Link
                              href={`/admin/fees/students/${fee.studentUserId}`}
                              className="text-blue-700 hover:underline"
                            >
                              {fee.studentName ?? fee.studentUserId}
                            </Link>
                            <div className="text-xs text-slate-500">
                              {fee.className ?? ""} ·{" "}
                              {formatInr(fee.totalOutstanding)}
                            </div>
                          </td>
                          <td className="py-2 pr-3">
                            {fee.pendingInstallmentCount} installment
                            {fee.pendingInstallmentCount === 1 ? "" : "s"} due
                          </td>
                          <td className="py-2">
                            {fee.nextDueDate?.slice(0, 10) ?? "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
