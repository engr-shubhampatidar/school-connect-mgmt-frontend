import React from "react";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";

export interface ClassDashboardDetails {
  id: string;
  className: string;
  section: string;
  classTeacherName: string | null;
  totalStudents: number;
}

interface Props {
  data?: ClassDashboardDetails | null;
  isLoading: boolean;
  error?: string | null;
}

export default function ClassOverviewHeader({ data, isLoading, error }: Props) {
  const title = data
    ? `Class ${data.className} – Section ${data.section}`
    : "Class";

  return (
    <Card>
      {error ? <div className="text-sm text-rose-600">{error}</div> : null}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {isLoading ? (
              <div className="h-6 w-64 bg-slate-200 rounded animate-pulse" />
            ) : (
              title
            )}
          </h2>
          <div className="text-sm text-slate-600 mt-1">
            {isLoading ? (
              <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
            ) : (
              `Academic Year: —`
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
            ) : (
              <Avatar name={data?.classTeacherName ?? undefined} size={40} />
            )}

            <div className="text-right">
              <div className="text-sm text-slate-600">Class Teacher</div>
              <div className="text-sm font-medium">
                {isLoading ? (
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse inline-block" />
                ) : (
                  data?.classTeacherName ?? "Not Assigned"
                )}
              </div>
            </div>
          </div>

          <div className="pl-4 border-l border-slate-100">
            <div className="text-sm text-slate-600">Total Students</div>
            <div className="text-xl font-semibold">
              {isLoading ? (
                <div className="h-6 w-12 bg-slate-200 rounded animate-pulse" />
              ) : (
                data?.totalStudents
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
