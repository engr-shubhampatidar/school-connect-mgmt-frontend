"use client";
import React from "react";

export function Form({
  children,
  className = "",
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
}

export function FormField({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-slate-700">{children}</label>
  );
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-red-600">{children}</p>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Form;
