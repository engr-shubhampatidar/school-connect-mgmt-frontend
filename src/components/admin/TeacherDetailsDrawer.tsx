"use client";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "../ui";
import Button from "../ui/Button";
import { Teacher } from "../../lib/adminApi";

type Props = {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
  onResendInvite?: (id: string) => void;
};

export default function TeacherDetailsDrawer({
  isOpen,
  teacher,
  onClose,
  onEdit,
  onResendInvite,
}: Props) {
  const name = teacher?.name ?? "Teacher details";

  function renderSubjectLabel(s: any) {
    if (!s && s !== 0) return "-";
    if (typeof s === "string") return s;
    return s.subjectName ?? s.name ?? s.subject ?? String(s);
  }

  function subjectKey(s: any, idx: number) {
    if (!s && s !== 0) return `sub-${idx}`;
    if (typeof s === "string") return s;
    return s.subjectId ?? s.id ?? `sub-${idx}`;
  }

  function renderClassLabel(c: any) {
    if (!c && c !== 0) return "-";
    if (typeof c === "string") return c;
    const name = c.className ?? c.name ?? c.class ?? null;
    const section = c.classSection ?? c.section ?? null;
    if (!name) return String(c);
    return section ? `${name} - ${section}` : name;
  }

  function classKey(c: any, idx: number) {
    if (!c && c !== 0) return `class-${idx}`;
    if (typeof c === "string") return c;
    return c.classId ?? c.id ?? `class-${idx}`;
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between w-full">
            <DrawerTitle>{name}</DrawerTitle>
            <DrawerClose asChild>
              <button
                aria-label="Close drawer"
                className="rounded p-1 hover:bg-slate-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 8.586L15.95 2.636a1 1 0 111.414 1.414L11.414 10l5.95 5.95a1 1 0 01-1.414 1.414L10 11.414l-5.95 5.95a1 1 0 01-1.414-1.414L8.586 10 2.636 4.05A1 1 0 014.05 2.636L10 8.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          {teacher ? (
            <>
              <section>
                <h4 className="text-sm font-semibold text-slate-700">
                  Contact
                </h4>
                <div className="mt-2 text-sm text-slate-900">
                  <div>{teacher.name ?? "-"}</div>
                  <div className="text-sm text-slate-600">
                    {teacher.email ?? "-"}
                  </div>
                  <div className="text-sm text-slate-600">
                    {teacher.phone ?? "-"}
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-slate-700">
                  Subjects
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {teacher.subjects && teacher.subjects.length > 0 ? (
                    teacher.subjects.map((s, idx) => (
                      <span
                        key={subjectKey(s, idx)}
                        className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-800"
                      >
                        {renderSubjectLabel(s)}
                      </span>
                    ))
                  ) : (
                    <div className="text-sm text-slate-600">-</div>
                  )}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-slate-700">
                  Classes
                </h4>
                <div className="mt-2 space-y-2 text-sm text-slate-800">
                  {teacher.assignedClasses &&
                  teacher.assignedClasses.length > 0 ? (
                    teacher.assignedClasses.map((c, idx) => (
                      <div
                        key={classKey(c, idx)}
                        className="rounded border px-3 py-2"
                      >
                        {renderClassLabel(c)}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-600">-</div>
                  )}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-slate-700">
                  Primary Class
                </h4>
                <div className="mt-2 text-sm text-slate-800">
                  {teacher.assignedClasses &&
                  teacher.assignedClasses.length > 0 ? (
                    <div>
                      Primary class:{" "}
                      {renderClassLabel(teacher.assignedClasses[0])}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">-</div>
                  )}
                </div>
              </section>

              <DrawerFooter>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const n = teacher.name ?? "-";
                      window.alert(`Edit clicked for ${n}`);
                      onEdit?.(teacher.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const n = teacher.name ?? "-";
                      window.alert(`Resend Invite clicked for ${n}`);
                      onResendInvite?.(teacher.id);
                    }}
                  >
                    Resend Invite
                  </Button>
                </div>
              </DrawerFooter>
            </>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
