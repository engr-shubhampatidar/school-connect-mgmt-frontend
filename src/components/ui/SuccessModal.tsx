"use client";
import Portal from "@/app/Portal";
import { Check } from "lucide-react";

type SuccessModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
};

export default function SuccessModal({
  open,
  onClose,
  title = "Attendance Saved Successfully",
  description = "All student attendance for today has been recorded. You can review or update entries before the day ends.",
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0  bg-black/10 backdrop-blur" onClick={onClose} />

        {/* Modal */}
        <div className="relative w-full max-w-md rounded-xl bg-white p-12 shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ✕
          </button>

          {/* Icon */}
          <div className="flex justify-center p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Check className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
        </div>
      </div>
    </Portal>
  );
}
