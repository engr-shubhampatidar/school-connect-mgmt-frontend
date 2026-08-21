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
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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
                          <td className="py-2">{formatInr(row.outstanding)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="w-full rounded-xl border border-[#D7E3FC] bg-white ">
              <div className="mb-4 flex items-start justify-between p-[16px] pb-0">
                <div>
                  <h2 className="text-[24px] text-[#021034] font-[600] text-slate-900">
                    Overdue{" "}
                  </h2>
                </div>

                <Link
                  href="/admin/fees/collect"
                  className="rounded-lg border px-3 py-[5.5px] text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  View all
                </Link>
              </div>
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-4 pl-6 text-left">
                      Student
                    </TableHead>

                    <TableHead className="py-4 text-left">Class</TableHead>

                    <TableHead className="py-4 text-left">
                      Installments
                    </TableHead>

                    <TableHead className="py-4 text-left">Due Date</TableHead>

                    <TableHead className="py-4 pr-6 text-right">
                      Outstanding
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {overdueStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-sm text-slate-500"
                      >
                        No overdue fees
                      </TableCell>
                    </TableRow>
                  ) : (
                    overdueStudents.map((fee) => (
                      <TableRow
                        key={fee.studentUserId}
                        className="border-t border-[#D7E3FC] text-[14px] text-[#021034] hover:bg-slate-50"
                      >
                        {/* Student */}
                        <TableCell className="py-3 pl-6">
                          <Link
                            href={`/admin/fees/students/${fee.studentUserId}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                              {fee.studentName?.charAt(0)?.toUpperCase() ?? "S"}
                            </div>

                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 hover:text-blue-700">
                                {fee.studentName ?? fee.studentUserId}
                              </span>

                              <span className="text-[12px] text-[#737373]">
                                Id-{fee.studentUserId.slice(0, 8)}
                              </span>
                            </div>
                          </Link>
                        </TableCell>

                        {/* Class */}
                        <TableCell className="py-3">
                          <div className="w-fit text-xs rounded-full border border-[#D7E3FC] px-2 py-1">
                            {fee.className ?? "-"}
                          </div>
                        </TableCell>

                        {/* Installments */}
                        <TableCell className="py-3 text-xs">
                          {fee.pendingInstallmentCount} installment
                          {fee.pendingInstallmentCount === 1 ? "" : "s"} due
                        </TableCell>

                        {/* Due Date */}
                        <TableCell className="py-3 text-xs">
                          {fee.nextDueDate?.slice(0, 10) ?? "—"}
                        </TableCell>

                        {/* Outstanding */}
                        <TableCell className="py-3 pr-6 text-right">
                          <span className="font-medium text-red-600">
                            {formatInr(fee.totalOutstanding)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
