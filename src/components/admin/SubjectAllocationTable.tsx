import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { Edit2, Trash2 } from "lucide-react";

export interface ClassSubjectAllocation {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string | null;
  subjectName: string;
  teacherName: string | null;
}

interface Props {
  items: ClassSubjectAllocation[];
  isLoading: boolean;
  error?: string | null;
  room: string;
}

export default function SubjectAllocationTable({
  items,
  isLoading,
  error,
  room,
}: Props) {
  return (
    <div>
      {error ? <div className="text-sm text-red-600 mb-2">{error}</div> : null}

      <Table>
        <TableHeader>
          <TableRow className="text-left text-sm text-slate-600 border-t">
            <TableHead className="py-2 pl-4">Subject Name</TableHead>
            <TableHead className="py-2">Assigned Teacher</TableHead>
            <TableHead className="py-2">Room No.</TableHead>
            <TableHead className="py-2">Status</TableHead>
            <TableHead className="py-2 pr-4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-slate-800">
          {isLoading ? (
            [1, 2, 3].map((r) => (
              <TableRow key={`skeleton-${r}`}>
                <TableCell className="py-3">
                  <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-sm text-slate-500"
              >
                No subjects assigned to this class yet
              </TableCell>
            </TableRow>
          ) : (
            items.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="py-3 pl-4">{s.subjectName}</TableCell>
                <TableCell className="py-3">
                  {s.teacherName ? (
                    <div className="flex items-center gap-3">
                      <Avatar name={s.teacherName ?? undefined} size={32} />
                      <div className="text-sm">{s.teacherName}</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-500">
                      <Avatar name={undefined} size={32} />
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-3">{room}</TableCell>
                <TableCell className="py-3">
                  <Badge variant={s.teacherId ? "success" : "warning"}>
                    {s.teacherId ? "Active" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-right pr-4">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="px-2 py-1"
                      onClick={() => console.log("replace", s.id)}
                    >
                      <Edit2 size={14} />
                      Replace
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-red-600"
                      onClick={() => console.log("delete", s.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
