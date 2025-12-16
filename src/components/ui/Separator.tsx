"use client";
import React from "react";

export default function Separator({ className = "" }: { className?: string }) {
  return <div className={`my-4 h-px bg-slate-100 ${className}`} />;
}
