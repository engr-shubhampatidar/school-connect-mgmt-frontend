"use client";
import React from "react";
import { getAttendanceHistory, StudentAttendancePageSkeleton } from "@/modules/students";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/use-toast";
import { ensureSessionReady } from "@/modules/auth";
import { AttendanceStatusBadge } from "@/modules/attendance";
import { DataTableSkeleton } from "@/components/skeletons";

export default function StudentAttendancePage() {
  const [items, setItems] = React.useState<Array<Record<string, unknown>>>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        await ensureSessionReady();
        if (!mounted) return;
        const data = await getAttendanceHistory(page, 10);
        if (!mounted) return;
        setItems(data.items);
        setTotal(data.total);
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String(
                (err as { message?: unknown }).message ??
                  "Failed to load attendance",
              )
            : "Failed to load attendance";
        toastRef.current?.({
          title: "Error",
          description: message,
          type: "error",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [page]);

  const isInitialLoad = loading && items.length === 0;

  if (isInitialLoad) {
    return <StudentAttendancePageSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Attendance History</h2>
            <div className="text-sm text-slate-500">Showing page {page}</div>
          </div>

          {loading ? (
            <div className="animate-pulse" aria-hidden>
              <DataTableSkeleton
                className="border-0"
                showPagination={false}
                rows={8}
                columns={[
                  { headerWidth: "w-24", cellWidth: "w-28" },
                  { headerWidth: "w-20", cellWidth: "w-20" },
                  { headerWidth: "w-40", cellWidth: "w-48" },
                ]}
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left text-sm text-slate-600">
                      <th className="py-2">Date</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={String(it.id || it.date)} className="border-t">
                        <td className="py-3 text-sm">
                          {new Date(String(it.date)).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <AttendanceStatusBadge
                            status={String(it.status || "").toUpperCase()}
                          />
                        </td>
                        <td className="py-3 text-sm text-slate-600">
                          {String(it.note ?? "-")}
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 text-center text-slate-500"
                        >
                          No records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-600">Total: {total}</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded border"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={items.length < 10}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded border"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
