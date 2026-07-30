"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  rollNo: string | null;
  password: string | null;
  onDismiss: () => void;
};

export default function StudentCredentialsModal({
  rollNo,
  password,
  onDismiss,
}: Props) {
  const { toast } = useToast();

  const handleCopy = async () => {
    const parts: string[] = [];
    if (rollNo) parts.push(`Roll No: ${rollNo}`);
    if (password) parts.push(`Temporary Password: ${password}`);
    const toCopy = parts.join("\n");
    try {
      await navigator.clipboard.writeText(toCopy);
      toast({ title: "Copied to clipboard", type: "success" });
    } catch {
      toast({ title: "Copy failed", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-md p-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Temporary Password
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Share this password with the student — it will not be shown
                again.
              </p>
            </div>
            <div>
              <button
                aria-label="close"
                onClick={onDismiss}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-slate-700">Roll No</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="font-mono text-lg text-slate-900">
                  {rollNo ?? "-"}
                </div>
                <div>
                  <Button variant="ghost" onClick={handleCopy}>
                    Copy
                  </Button>
                </div>
              </div>

              {password ? (
                <>
                  <div className="mt-4 text-sm text-slate-700">
                    Temporary Password
                  </div>
                  <div className="mt-2 font-mono text-lg text-slate-900">
                    {password}
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={onDismiss}>Close</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
