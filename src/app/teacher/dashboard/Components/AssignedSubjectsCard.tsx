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
    <div className="w-full rounded-[8px] border border-[#D7E3FC] bg-white">
      {/* Header */}
      <div className="flex items-start justify-between border-b p-6">
        <div>
          <h2 className="text-[24px] font-[600] text-[#021034]">{title}</h2>
          <p className="text-[14px] font-[400] text-[#737373]">{subtitle}</p>
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
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034]">
                Class & Section
              </th>
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034]">
                Subject Name
              </th>
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034]">
                Student Count
              </th>
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034] text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((item, index) => (
              <tr key={index} className="border-b last:border-none">
                <td className="px-6 py-4">
                  <span className="rounded-full border border-[#D7E3FC] px-[8px] py-[2px] text-[12px] font-[500] text-[#020617]">
                    {item.classSection}
                  </span>
                </td>

                <td className="px-6 py-4 font-[500] text-[14px] text-[#020617]">
                  {item.subjectName}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[14px] text-[#737373] ">
                    <Users size={16} />
                    <span className="text-[#020617] font-[500]">{item.studentCount}</span>
                  </div>
                </td>

                <td className="px-6 py-4 flex justify-end">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onViewStudents?.(item)}
                      className="text-sm font-medium text-[#737373] hover:text-slate-700"
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
