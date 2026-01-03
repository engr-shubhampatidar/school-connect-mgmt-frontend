"use client";
import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../ui/table";
import { ClassItem } from "../../lib/adminApi";
import AssignTeacherModal from "./AssignTeacherModal";

type Props = {
  classes: ClassItem[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onEdit?: (id: string) => void;
  onAssignTeacher?: (id: string) => void;
  onChangeTeacher?: (id: string) => void;
};

export default function ClassesTable({
  classes,
  loading,
  error,
  total = 0,
  page = 1,
  pageSize = 10,
  onRetry,
  onPageChange,
  onEdit,
  onAssignTeacher,
  onChangeTeacher,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClassId, setModalClassId] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<"assign" | "change" | null>(
    null
  );
  const totalPages = Math.max(
    1,
    Math.ceil((total || classes.length) / pageSize)
  );

  if (loading) {
    return (
      <Card>
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="text-left py-2">Class Name</TableHead>
              <TableHead className="text-left py-2">Class Teacher</TableHead>
              <TableHead className="text-right py-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={i} className="border-t">
                <TableCell className="py-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="h-8 w-24 animate-pulse rounded bg-slate-200 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-start gap-4">
          <div className="text-sm text-slate-700">Error: {error}</div>
          <Button onClick={onRetry}>Retry</Button>
        </div>
      </Card>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">
            No classes created yet
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Create a class to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead className="text-left py-2">Class Name</TableHead>
                <TableHead className="text-left py-2">Class Teacher</TableHead>
                <TableHead className="text-right py-2">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {classes.map((c) => (
                <TableRow key={c.id} className="border-t hover:bg-slate-50">
                  <TableCell className="py-4 align-middle max-w-xs">
                    <div className="flex flex-col">
                      <div className="font-medium text-slate-900 truncate">
                        {c.name}
                      </div>
                      <div className="text-sm text-slate-500 truncate">
                        {c.section ? `Section ${c.section}` : "-"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 align-middle">
                    {c.classTeacherName ? (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                          {c.classTeacherName
                            .split(" ")
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {c.classTeacherName}
                          </div>
                          <div className="text-xs text-slate-500">
                            Class Teacher
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">Not Assigned</div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end">
                      {c.classTeacherName ? (
                        <Button
                          variant="ghost"
                          className="px-3 py-1.5 text-sm"
                          onClick={() => {
                            setModalClassId(c.id);
                            setModalAction("change");
                            setModalOpen(true);
                          }}
                        >
                          Change Teacher
                        </Button>
                      ) : (
                        <Button
                          variant="pill"
                          className="px-3 py-1.5 text-sm"
                          onClick={() => {
                            setModalClassId(c.id);
                            setModalAction("assign");
                            setModalOpen(true);
                          }}
                        >
                          Assign Teacher
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableCaption>
              Showing {classes.length} of {total ?? classes.length}
            </TableCaption>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPageChange(Math.max(1, (page || 1) - 1))}
              disabled={(page || 1) <= 1}
            >
              Previous
            </Button>
            <div className="text-sm text-slate-700">
              Page {page} / {totalPages}
            </div>
            <Button
              onClick={() =>
                onPageChange(Math.min(totalPages, (page || 1) + 1))
              }
              disabled={(page || 1) >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
      {modalClassId && (
        <AssignTeacherModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          classId={modalClassId}
          onSuccess={() => {
            if (modalAction === "assign") onAssignTeacher?.(modalClassId);
            if (modalAction === "change") onChangeTeacher?.(modalClassId);
            setModalOpen(false);
            setModalClassId(null);
            setModalAction(null);
          }}
        />
      )}
    </div>
  );
}
