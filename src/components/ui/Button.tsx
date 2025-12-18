"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "pill";
};

export function Button({
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-sky-600 text-white hover:bg-sky-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    pill: "bg-gray-200",
  };
  return ( 
    <button
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
}

export default Button;
