"use client";
import React from "react";

type Option = { id: string; name: string };

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  disabled,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 ${className}`}
    >
      <option value="">{placeholder ?? "Select"}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  );
}
