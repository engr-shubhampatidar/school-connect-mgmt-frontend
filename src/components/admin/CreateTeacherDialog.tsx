"use client";
import CreateTeacherForm from "../CreateTeacherForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  // optional subjects provided by parent to avoid duplicate API calls
  subjectsProp?: { id: string; name: string }[];
};

export default function CreateTeacherDialog({
  open,
  onClose,
  onCreated,
}: Props) {
 
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-[777px] p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
          <div className="rounded-lg">
            <div className=" min-h-full">
              <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    Create New Teacher
                  </h3>
                  <p className="text-[14px] font-[400] text-white">
                    Fill in the details below to add a new teacher to the
                    system.
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
              <div className="p-[16px] bg-white overflow-hidden no-scrollbar rounded-b-lg max-h-full overflow-y-auto">
                <CreateTeacherForm
                  onClose={onClose}
                  onCreated={() => {
                    onCreated?.();
                    // onClose();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
