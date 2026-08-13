"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  ParentDetailView,
  useParentQuery,
} from "@/modules/parents";

export default function AdminParentDetailPage() {
  const params = useParams();
  const parentId = String(params?.parentId ?? "");

  const { data, isLoading, error, refetch } = useParentQuery(
    parentId || undefined,
  );

  if (error) {
    return (
      <div className="mx-auto px-4 py-6">
        <Card>
          <div className="flex flex-col items-start gap-4">
            <div className="text-sm text-slate-700">
              Error:{" "}
              {error instanceof Error
                ? error.message
                : "Failed to load parent"}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => void refetch()}>Retry</Button>
              <Link href="/admin/parents">
                <Button variant="ghost">Back to list</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/parents"
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ← Back to Parents
          </Link>
          <h1 className="mt-2 text-[24px] font-[600] text-[#021034]">
            Parent Details
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            View profile and manage linked children
          </p>
        </div>
      </div>

      {data ? (
        <ParentDetailView
          parent={data}
          loading={isLoading}
          onChanged={() => void refetch()}
        />
      ) : (
        <ParentDetailView
          parent={{
            id: parentId,
            email: "",
            firstName: "",
            lastName: "",
            fullName: "",
            status: "",
            childrenCount: 0,
            children: [],
          }}
          loading
        />
      )}
    </div>
  );
}
