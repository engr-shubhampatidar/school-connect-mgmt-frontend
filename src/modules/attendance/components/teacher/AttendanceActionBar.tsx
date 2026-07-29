"use client";

export default function AttendanceActionBar({
  submitting,
  attendanceExists,
  onSave,
}: {
  submitting: boolean;
  attendanceExists: boolean;
  onSave: () => void;
}) {
  return (
    <div className=" border-t bg-white fixed bottom-0 left-0 w-full  md:pl-64 lg:pl-72">
      <div className="mx-auto sticky  bottom-0 flex max-h-20 items-center justify-between px-6 py-4">
        {/* Left Info */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span>Attendance can be edited by today only</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={submitting || attendanceExists}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer"
          >
            {submitting
              ? "Saving…"
              : attendanceExists
                ? "Already marked"
                : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
