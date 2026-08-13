"use client";

import React from "react";
import { ExternalLink, FileText } from "lucide-react";
import {
  getStudentDocuments,
  type StudentPortalDocument,
} from "@/modules/students";
import { ensureSessionReady } from "@/modules/auth";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { DOCUMENT_TYPES } from "@/modules/documents/constants";

function docTypeLabel(value: string): string {
  return DOCUMENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

function formatSize(size?: number | null): string {
  if (size == null || !Number.isFinite(size)) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StudentDocumentsPage() {
  const [docs, setDocs] = React.useState<StudentPortalDocument[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ensureSessionReady();
      const data = await getStudentDocuments();
      setDocs(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load documents";
      setError(message);
      toastRef.current?.({
        title: "Error",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto px-4 py-6">
        <div className="mb-6 space-y-2">
          <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
        </div>
        <DataTableSkeleton
          rows={5}
          columns={[
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-28", cellWidth: "w-32" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-16", cellWidth: "w-20" },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6 bg-[#F5F9FF] min-h-full">
      <div className="mb-6 flex items-start gap-3">
        <FileText className="mt-1 h-5 w-5 text-[#021034]" />
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Documents</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            View documents linked to your student profile
          </p>
        </div>
      </div>

      {error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">{error}</p>
            <Button variant="dark" onClick={() => void load()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : docs.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-slate-500">
            No documents found. Contact the school office if you need something
            uploaded.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Size</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.id} className="border-t border-slate-100">
                    <td className="py-3 pr-3 font-medium text-[#021034]">
                      {doc.originalName || doc.fileName || "Document"}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="inline-block rounded-full border border-[#D7E3FC] bg-[#F5F9FF] px-2 py-0.5 text-xs font-medium text-[#021034]">
                        {docTypeLabel(doc.documentType)}
                      </span>
                    </td>
                    <td className="hidden py-3 pr-3 md:table-cell text-slate-600">
                      {formatSize(doc.size)}
                    </td>
                    <td className="py-3">
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
                        >
                          View
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
