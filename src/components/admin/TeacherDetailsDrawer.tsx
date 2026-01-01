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

  const formatItem = (item: unknown, idx: number) => {
    if (item && typeof item === "object") {
      const it = item as Record<string, unknown>;
      const id = it.id ?? it._id ?? idx;
      const nameVal =
        (typeof it.name === "string" && it.name) ||
        (typeof it.className === "string" && it.className) ||
        (typeof it.subjectName === "string" && it.subjectName) ||
        (typeof it.class === "string" && it.class) ||
        null;
      const section =
        (typeof it.classSection === "string" && it.classSection) ||
        (typeof it.section === "string" && it.section) ||
        null;
      let label = "";
      if (nameVal)
        label = section ? `${nameVal} - ${section}` : String(nameVal);
      else {
        try {
          label = JSON.stringify(it);
        } catch {
          label = String(it as unknown as string);
        }
      }
      return { key: String(id), label };
    }
    return { key: String(item ?? idx), label: String(item ?? "") };
  };

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
                    teacher.subjects.map((s, idx) => {
                      const { key, label } = formatItem(s, idx);
                      return (
                        <span
                          key={key}
                          className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-800"
                        >
                          {label}
                        </span>
                      );
                    })
                  ) : (
                    <div className="text-sm text-slate-600">-</div>
                  )}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-slate-700">
                  Assigned Classes
                </h4>
                <div className="mt-2 space-y-2 text-sm text-slate-800">
                  {(teacher.assignedClasses &&
                    teacher.assignedClasses.length > 0) ||
                  (Array.isArray(teacher.classes) &&
                    teacher.classes.length > 0) ? (
                    // prefer assignedClasses (strings), else raw classes array
                    teacher.assignedClasses &&
                    teacher.assignedClasses.length > 0 ? (
                      teacher.assignedClasses.map((c, idx) => (
                        <div
                          key={`${c}-${idx}`}
                          className="rounded border px-3 py-2"
                        >
                          {c}
                        </div>
                      ))
                    ) : (
                      teacher.classes!.map((c, idx: number) => {
                        const name = c?.className ?? c?.name ?? "";
                        const section = c?.classSection ?? c?.section ?? null;
                        const subject = c?.subjectName ?? null;
                        const label = name
                          ? section
                            ? `${name} - ${section}${
                                subject ? ` (${subject})` : ""
                              }`
                            : `${name}${subject ? ` (${subject})` : ""}`
                          : "-";
                        return (
                          <div
                            key={String(c?.classId ?? c?.id ?? idx)}
                            className="rounded border px-3 py-2"
                          >
                            {label}
                          </div>
                        );
                      })
                    )
                  ) : (
                    <div className="text-sm text-slate-600">-</div>
                  )}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-slate-700">
                  Teacher-Guardian
                </h4>
                <div className="mt-2 text-sm text-slate-800">
                  {teacher.classTeacher ? (
                    <div>
                      {teacher.classTeacher.name}
                      {teacher.classTeacher.section
                        ? ` - ${teacher.classTeacher.section}`
                        : ""}
                    </div>
                  ) : teacher.assignedClasses &&
                    teacher.assignedClasses.length > 0 ? (
                    <div>{teacher.assignedClasses[0]}</div>
                  ) : Array.isArray(teacher.classes) &&
                    teacher.classes.length > 0 ? (
                    (() => {
                      const c = teacher.classes![0];
                      const name = c?.className ?? c?.name ?? "";
                      const section = c?.classSection ?? c?.section ?? null;
                      return (
                        <div>
                          {name
                            ? section
                              ? `${name} - ${section}`
                              : name
                            : "-"}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-sm text-slate-600">None</div>
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
