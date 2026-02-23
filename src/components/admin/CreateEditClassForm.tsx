"use client";

import React, { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import MultiSelect from "./MultiSelect";
import SearchableDropdown from "./SearchableDropdown";
import { Subject, searchSubjects } from "@/services/subject.service";
import { getTeachers, Teacher } from "@/services/teacher.service";
import axios from "@/lib/axios";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  Card,
  Badge,
} from "../ui";
import { Input } from "../ui";
import { X } from "lucide-react";
import { Button } from "../ui";

type Assignment = {
  subjectId: string;
  teacherId?: string | null;
  startTime?: string;
  endTime?: string;
  room?: string;
};

interface Props {
  classId?: string | null;
  onClose: () => void;
  initial?: {
    className?: string;
    section?: string;
    homeRoom?: string;
    classTeacherId?: string | null;
    subjects?: Subject[];
    assignments?: Assignment[];
  };
}

export default function CreateEditClassForm({
  classId = null,
  onClose,
  initial,
}: Props) {
  const [className, setClassName] = useState(initial?.className || "");
  const [section, setSection] = useState(initial?.section || "");
  const [homeRoom, setHomeRoom] = useState(initial?.homeRoom || "");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(
    initial?.subjects || [],
  );
  const [assignments, setAssignments] = useState<Assignment[]>(
    initial?.assignments || [],
  );
  const [classTeacherId, setClassTeacherId] = useState<string | null>(
    initial?.classTeacherId ?? null,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    // ensure assignments exist for selected subjects
    setAssignments((prev) => {
      const byId = new Map(prev.map((p) => [p.subjectId, p]));
      const next = selectedSubjects.map(
        (s) => byId.get(s.id) ?? { subjectId: s.id },
      );
      return next;
    });
  }, [selectedSubjects]);

  function updateAssignment(subjectId: string, patch: Partial<Assignment>) {
    setAssignments((prev) =>
      prev.map((a) => (a.subjectId === subjectId ? { ...a, ...patch } : a)),
    );
  }

  function removeSubject(subjectId: string) {
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setAssignments((prev) => prev.filter((a) => a.subjectId !== subjectId));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!className.trim()) errs.className = "Class name is required";
    if (!section.trim()) errs.section = "Section is required";
    if (!homeRoom.trim()) errs.homeRoom = "Home room is required";
    if (!classTeacherId) errs.classTeacherId = "Class teacher is required";
    if (selectedSubjects.length === 0)
      errs.subjects = "At least one subject is required";
    assignments.forEach((a, idx) => {
      if (!a.teacherId)
        errs[`assignment_${a.subjectId}_teacher`] = "Teacher is required";
      if (!a.startTime)
        errs[`assignment_${a.subjectId}_start`] = "Start time required";
      if (!a.endTime)
        errs[`assignment_${a.subjectId}_end`] = "End time required";
      if (!a.room) errs[`assignment_${a.subjectId}_room`] = "Room is required";
    });
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      // Backend expects subjects as array of assignment objects (subjectId + teacher + times + room)
      const subjectsPayload = assignments.map((a) => ({
        subjectId: a.subjectId,
        teacherId: a.teacherId ?? null,
        startTime: a.startTime ?? null,
        endTime: a.endTime ?? null,
        room: a.room ?? null,
      }));

      const payload = {
        className,
        section,
        homeRoom,
        classTeacherId,
        subjects: subjectsPayload,
      };

      if (classId) {
        await axios.put(`/api/admin/classes/${classId}`, payload);
      } else {
        await axios.post(`/api/admin/classes`, payload);
      }
      onClose();
    } catch (err: any) {
      // Try to extract meaningful error information from API
      if (isAxiosError(err)) {
        const data = err.response?.data as any;
        const message = data?.message ?? data?.error ?? err.message;
        setError(message || "Submit failed");
        // field-level errors may live in `fieldErrors`, `errors` or similar
        const fieldErrors = data?.fieldErrors ?? data?.errors ?? null;
        if (fieldErrors && typeof fieldErrors === "object") {
          // Normalize to string map
          const normalized: Record<string, string> = {};
          Object.keys(fieldErrors).forEach((k) => {
            const v = fieldErrors[k];
            normalized[k] =
              typeof v === "string"
                ? v
                : Array.isArray(v)
                  ? v.join(", ")
                  : JSON.stringify(v);
          });
          setValidationErrors(normalized);
        }
      } else {
        setError(err?.message || "Submit failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <Card>
        <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
          Class Information
        </h1>
        <div className="grid grid-cols-3 gap-4">
          <FormField>
            <FormLabel>Class Name *</FormLabel>
            <FormControl>
              <Input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class- 10"
              />
            </FormControl>
            <FormMessage>
              {validationErrors.className && (
                <div className="text-sm text-red-600">
                  {validationErrors.className}
                </div>
              )}
            </FormMessage>
          </FormField>
          <FormField>
            <FormLabel>Section *</FormLabel>
            <FormControl>
              <Input
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="B"
              />
            </FormControl>
            <FormMessage>
              {validationErrors.section && (
                <div className="text-sm text-red-600">
                  {validationErrors.section}
                </div>
              )}
            </FormMessage>
          </FormField>
          <FormField>
            <FormLabel>Home Room *</FormLabel>
            <FormControl>
              <Input
                value={homeRoom}
                onChange={(e) => setHomeRoom(e.target.value)}
                placeholder="105"
              />
            </FormControl>
            <FormMessage>
              {validationErrors.homeRoom && (
                <div className="text-sm text-red-600">
                  {validationErrors.homeRoom}
                </div>
              )}
            </FormMessage>
          </FormField>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-[24px]">
          <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] ">
            Subjects & Faculty
          </h1>
          <Badge>{selectedSubjects.length} Subjects Selected</Badge>
        </div>
        <MultiSelect value={selectedSubjects} onChange={setSelectedSubjects} />
        {validationErrors.subjects && (
          <div className="text-sm text-red-600">
            {validationErrors.subjects}
          </div>
        )}
      </Card>
      {/* Assignment schedule table */}
      {selectedSubjects.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Assignment Schedule </h3>

          <div className="border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F5F9FF]">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Subject</th>
                  <th className="px-3 py-2  text-left font-medium">Teacher</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Start Time
                  </th>
                  <th className="px-3 py-2 text-left font-medium">End Time</th>
                  <th className="px-3 py-2 text-left w-[80px] font-medium">
                    Room
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {assignments.map((a) => {
                  const subject = selectedSubjects.find(
                    (s) => s.id === a.subjectId,
                  );

                  return (
                    <tr key={a.subjectId} className="align-center">
                      {/* Subject */}
                      <td className="px-3 py-3 font-medium">
                        <p className="flex items-center  gap-2 justify-between w-full rounded-md border border-[#D7E3FC]  px-3 py-1.5 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                          {subject?.name}
                        </p>
                      </td>

                      {/* Teacher */}
                      <td className="px-3 py-3 w-56">
                        <SearchableDropdown
                          value={a.teacherId ?? null}
                          onChange={(id) =>
                            updateAssignment(a.subjectId, { teacherId: id })
                          }
                        />
                        {validationErrors[
                          `assignment_${a.subjectId}_teacher`
                        ] && (
                          <div className="text-red-600 text-xs mt-1">
                            {
                              validationErrors[
                                `assignment_${a.subjectId}_teacher`
                              ]
                            }
                          </div>
                        )}
                      </td>

                      {/* Start Time */}
                      <td className="px-3 py-3">
                        <input
                          className="flex items-center  gap-2 justify-between w-fit rounded-md border border-[#D7E3FC]  px-3 py-1.5 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]"
                          type="time"
                          value={a.startTime || ""}
                          onChange={(e) =>
                            updateAssignment(a.subjectId, {
                              startTime: e.target.value,
                            })
                          }
                          // className="w-full border p-1 rounded"
                        />
                        {validationErrors[
                          `assignment_${a.subjectId}_start`
                        ] && (
                          <div className="text-red-600 text-xs mt-1">
                            {
                              validationErrors[
                                `assignment_${a.subjectId}_start`
                              ]
                            }
                          </div>
                        )}
                      </td>

                      {/* End Time */}
                      <td className="px-3 py-3">
                        <input
                          type="time"
                          value={a.endTime || ""}
                          onChange={(e) =>
                            updateAssignment(a.subjectId, {
                              endTime: e.target.value,
                            })
                          }
                          className=" flex items-center  gap-2 justify-between w-fit rounded-md border border-[#D7E3FC]  px-3 py-1.5 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]"
                        />
                        {validationErrors[`assignment_${a.subjectId}_end`] && (
                          <div className="text-red-600 text-xs mt-1">
                            {validationErrors[`assignment_${a.subjectId}_end`]}
                          </div>
                        )}
                      </td>

                      {/* Room */}
                      <td className="px-3 py-3">
                        <input
                          value={a.room || ""}
                          onChange={(e) =>
                            updateAssignment(a.subjectId, {
                              room: e.target.value,
                            })
                          }
                          className="flex items-center  gap-2 justify-between w-full rounded-md border border-[#D7E3FC]  px-3 py-1.5 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]"
                        />
                        {validationErrors[`assignment_${a.subjectId}_room`] && (
                          <div className="text-red-600 text-xs mt-1">
                            {validationErrors[`assignment_${a.subjectId}_room`]}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center  gap-2 justify-between w-fit rounded-md border border-[#D7E3FC]  px-3 py-1.5 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]"
                          onClick={() => removeSubject(a.subjectId)}
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Class Teacher *
        </label>
        <SearchableDropdown
          value={classTeacherId}
          onChange={setClassTeacherId}
        />
        {validationErrors.classTeacherId && (
          <div className="text-sm text-red-600">
            {validationErrors.classTeacherId}
          </div>
        )}
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="flex justify-end gap-2 sticky bottom-0 bg-white py-4 ">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="dark" disabled={loading}>
          {loading ? "Saving..." : "Create New Class"}
        </Button>
      </div>
    </form>
  );
}
