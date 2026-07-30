"use client";

import { useEffect, ReactNode } from "react";
import CreateClassForm from "./CreateClassForm";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: string | null;
  title?: string;
  children?: ReactNode;
}

export default function CreateNewClass({
  isOpen,
  onClose,
  classId = null,
  title = "Create New Class",
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[900px] max-h-[90vh] overflow-auto no-scrollbar bg-white rounded-lg z-50">
        <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
          <div>
            <h3 className="text-[24px] font-[700] text-white">{title}</h3>
            <p className="text-[14px] font-[400] text-white">
              Set up class details, assign subjects, and configure the teaching
              faculty.
            </p>
          </div>
          <div>
            <button
              aria-label="close"
              onClick={onClose}
              className="text-white hover:text-white/80"
            >
              ✕
            </button>
          </div>
        </div>

        <CreateClassForm classId={classId} onClose={onClose} />
      </div>
    </div>
  );
}
