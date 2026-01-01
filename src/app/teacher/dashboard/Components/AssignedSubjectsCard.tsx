import { Users } from "lucide-react";

type AssignedSubject = {
  classSection: string;
  subjectName: string;
  studentCount: number;
};

type AssignedSubjectsCardProps = {
  title?: string;
  subtitle?: string;
  subjects: AssignedSubject[];
  onExport?: () => void;
  onViewStudents?: (item: AssignedSubject) => void;
  onEnterMarks?: (item: AssignedSubject) => void;
};

export default function AssignedSubjectsCard({
  title = "Assigned Subjects",
  subtitle = "Manage your teaching assignment and mark entry",
  subjects,
  onExport,
  onViewStudents,
  onEnterMarks,
}: AssignedSubjectsCardProps) {
  return (
    <div className="w-full rounded-xl border border-[#D7E3FC] bg-white">
      {/* Header */}
      <div className="flex items-start justify-between border-b p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Export Report
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Class & Section</th>
              <th className="px-6 py-3 font-medium">Subject Name</th>
              <th className="px-6 py-3 font-medium">Student Count</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((item, index) => (
              <tr key={index} className="border-b last:border-none">
                <td className="px-6 py-4">
                  <span className="rounded-md border px-2 py-1 text-xs font-medium text-slate-700">
                    {item.classSection}
                  </span>
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.subjectName}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} />
                    {item.studentCount}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onViewStudents?.(item)}
                      className="text-sm font-medium text-slate-500 hover:text-slate-700"
                    >
                      View Students
                    </button>

                    <button
                      onClick={() => onEnterMarks?.(item)}
                      className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Enter Marks
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
