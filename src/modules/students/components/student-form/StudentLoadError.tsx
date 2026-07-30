"use client";

import React from "react";
import Button from "@/components/ui/Button";

type Props = {
  message: string;
  onRetry: () => void;
  onClose: () => void;
};

export default function StudentLoadError({
  message,
  onRetry,
  onClose,
}: Props) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <div className="font-semibold">Failed to load student</div>
      <div className="mt-1">{message}</div>
      <div className="mt-3 flex gap-2">
        <Button onClick={onRetry}>Retry</Button>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
