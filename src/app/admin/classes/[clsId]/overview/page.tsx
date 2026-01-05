import React from "react";
import ClassOverviewContainer from "@/components/admin/ClassOverviewContainer";

export const metadata = {
  title: "Class Overview",
};

export default function Page({ params }: { params: { clsId: string } }) {
  const { clsId } = params;
  return (
    <main className="p-8 mx-auto">
      <div className="mb-4 text-sm text-slate-500">Class ID: {clsId}</div>
      <ClassOverviewContainer />
    </main>
  );
}
