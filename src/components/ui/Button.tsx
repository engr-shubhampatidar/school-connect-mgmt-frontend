"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "pill" | "dark" | "inputType";
  size?: string;
};

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50";

const variants: Record<string, string> = {
  default: "bg-sky-600 text-white hover:bg-sky-700",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  pill: "bg-gray-200",
  inputType:
    "bg-transparent border border-[#D7E3FC] text-[#021034] hover:bg-[#D7E3FC]/50",
  dark: "bg-[#021034] text-white hover:bg-[#021034cc]",
};

export const buttonVariants = ({
  variant = "default",
}: { variant?: ButtonProps["variant"] } = {}) =>
  `${base} ${variants[variant ?? "default"]}`.trim();

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${buttonVariants({ variant })} ${className}`.trim()}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
