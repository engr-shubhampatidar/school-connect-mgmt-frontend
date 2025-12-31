"use client";
import React from "react";
import StudentAuthGuard from "../../../components/student/AuthGuard";
import studentApi from "../../../lib/studentApi";
import { Card } from "../../../components/ui/Card";
import { useToast } from "../../../components/ui/use-toast";

export default function Page() {
  return (
    <StudentAuthGuard>
      <Inner />
    </StudentAuthGuard>
  );
}

function Badge({ status }: { status: string }) {
  const cls =
    status === "PRESENT"
      ? "bg-green-100 text-green-800"
      : status === "ABSENT"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";
  return (
    <span className={`px-2 py-1 rounded-full text-sm ${cls}`}>{status}</span>
  );
}

function Inner() {
  const [items, setItems] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await studentApi.get(
          `/api/student/attendance?page=${page}&limit=10`
        );
        if (!mounted) return;
        setItems(res.data?.items ?? res.data ?? []);
        setTotal(res.data?.total ?? res.data?.length ?? 0);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message ?? "Failed to load attendance",
          type: "error",
        });
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [page, toast]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Attendance History</h2>
            <div className="text-sm text-slate-500">Showing page {page}</div>
          </div>

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
                  <tr key={it.id || it.date} className="border-t">
                    <td className="py-3 text-sm">
                      {new Date(it.date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Badge status={(it.status || "").toUpperCase()} />
                    </td>
                    <td className="py-3 text-sm text-slate-600">
                      {it.note ?? "-"}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-500">
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
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded border"
              >
                Prev
              </button>
              <button
                disabled={items.length < 10}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
