"use client";

import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function FormSectionCard({ title, children }: Props) {
  return (
    <section className="rounded-xl border border-[#E6ECF5] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">{title}</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
