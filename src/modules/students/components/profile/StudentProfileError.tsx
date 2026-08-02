"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function StudentProfileError({
  message = "Failed to load student profile",
  onRetry,
}: Props) {
  return (
    <div className="p-3 md:p-6">
      <Card>
        <div className="flex flex-col items-start gap-4">
          <div className="text-sm text-slate-700">{message}</div>
          {onRetry ? <Button onClick={onRetry}>Retry</Button> : null}
        </div>
      </Card>
    </div>
  );
}
