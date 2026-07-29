"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/Button";

export type Allocation = {
  grade: string;
  section: string;
  subject: string;
  role: "Class Teacher" | "Subject Teacher";
};

type Props = {
  data: Allocation[];
  onAssign?: () => void;
  onChangeRole?: (item: Allocation) => void;
  onRemove?: (item: Allocation) => void;
};

export default function ClassSubjectAllocationTable({
  data,
  onAssign,
  onChangeRole,
  onRemove,
}: Props) {
  return (
    <div className="w-full bg-white border border-[#D7E3FC] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-[#D7E3FC]">
        <h2 className="text-[24px] font-semibold text-[#021034]">
          Class & Subject Allocation
        </h2>

        <Button onClick={onAssign} variant="dark">
          + Assign new Class & Subject
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-white ">
            <TableHead className="px-4 py-4">Class</TableHead>
            <TableHead className="px-4 py-4">Section</TableHead>
            <TableHead className="py-4">Subject Allocate</TableHead>
            <TableHead className="py-4">Role Allocate</TableHead>
            <TableHead className="text-right pr-4 py-4">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium px-4">{item.grade}</TableCell>

              <TableCell>
                <span className="px-3 py-1 text-xs border border-[#D7E3FC] rounded-full text-[#021034] bg-[#FFFFFF]">
                  {item.section}
                </span>
              </TableCell>

              <TableCell>{item.subject}</TableCell>

              <TableCell>
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${
                    item.role === "Class Teacher"
                      ? "border-[#6930B3] text-[#6930B3] bg-purple-50"
                      : "border-[#D7E3FC] text-[#021034] bg-blue-50"
                  }`}
                >
                  {item.role}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={() => onChangeRole?.(item)}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    Change Role
                  </button>

                  <Button variant="dark" onClick={() => onRemove?.(item)}>
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
