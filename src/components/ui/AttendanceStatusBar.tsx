import React from "react";
import { Button } from "./Button";
import { Check, X, Clock } from "lucide-react";

export type AttendanceValue = "PRESENT" | "ABSENT" | "LATE";

interface AttendanceStatusBarProps {
  value: AttendanceValue;
  onChange: (v: AttendanceValue) => void;
  className?: string;
  disabled?: boolean;
}

const OPTIONS: {
  value: AttendanceValue;
  label: string;
  Icon: React.ComponentType<any>;
  activeBg: string;
  inactiveText: string;
  inactiveBorder: string;
  hoverBg: string;
  focusRing: string;
}[] = [
  {
    value: "PRESENT",
    label: "Present",
    Icon: Check,
    activeBg: "bg-green-600",
    inactiveText: "text-green-600",
    inactiveBorder: "border-green-200",
    hoverBg: "hover:bg-green-50",
    focusRing: "focus-visible:ring-green-300",
  },
  {
    value: "ABSENT",
    label: "Absent",
    Icon: X,
    activeBg: "bg-red-600",
    inactiveText: "text-red-600",
    inactiveBorder: "border-red-200",
    hoverBg: "hover:bg-red-50",
    focusRing: "focus-visible:ring-red-300",
  },
  {
    value: "LATE",
    label: "Late",
    Icon: Clock,
    activeBg: "bg-amber-500",
    inactiveText: "text-amber-600",
    inactiveBorder: "border-amber-200",
    hoverBg: "hover:bg-amber-50",
    focusRing: "focus-visible:ring-amber-300",
  },
];

export function AttendanceStatusBar({
  value,
  onChange,
  className = "",
  disabled = false,
}: AttendanceStatusBarProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Attendance status"
      className={`inline-flex items-center gap-2 ${className} ${
        disabled ? "opacity-80" : ""
      }`}
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.Icon;
        const base = `group h-8 px-2 rounded-full inline-flex items-center gap-2 text-xs transition-colors duration-150 focus:outline-none border`;
        const stateClasses = active
          ? `${opt.activeBg} text-white border-transparent`
          : `bg-transparent ${opt.inactiveBorder} ${opt.inactiveText} ${
              disabled ? "" : opt.hoverBg
            }`;

        return (
          <Button
            key={opt.value}
            type="button"
            onClick={() => !disabled && onChange(opt.value)}
            aria-pressed={active}
            aria-label={opt.label}
            aria-disabled={disabled}
            disabled={disabled}
            className={`${base} ${stateClasses} ${opt.focusRing} ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          >
            <Icon
              className={`${active ? "text-white" : ""} w-4 h-4`}
              aria-hidden
            />
            <span
              aria-hidden={active ? "false" : "true"}
              className={`whitespace-nowrap overflow-hidden transition-all duration-150 ${
                active
                  ? "max-w-[6rem] opacity-100 ml-1"
                  : "max-w-0 opacity-0 group-hover:max-w-[6rem] group-hover:opacity-100"
              }`}
            >
              {opt.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

export default AttendanceStatusBar;
