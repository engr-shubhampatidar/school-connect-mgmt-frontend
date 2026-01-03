"use client";
import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[#D7E3FC] bg-white p-[16px] ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
