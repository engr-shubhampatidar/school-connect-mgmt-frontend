"use client";

import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import MultiSelect from "./MultiSelect";
import SearchableDropdown from "./SearchableDropdown";
import { getTeachers } from "@/services/teacher.service";
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
import { Subject } from "@/services/subject.service";
import { useToast } from "@/components/ui/use-toast";

type Assignment = {
  subjectId: string;
  teacherId?: string | null;
  startTime?: string;
  endTime?: string;
  room?: string;
};

interface Props {
  onClose: () => void;
  onCreated?: () => void;
  classId?: string | null;
}

export default function CreateClassForm({ onClose, onCreated }: Props) {
  const { toast } = useToast();

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [homeRoom, setHomeRoom] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classTeacherId, setClassTeacherId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setAssignments((prev) => {
      const byId = new Map(prev.map((p) => [p.subjectId, p]));
      return selectedSubjects.map((s) => byId.get(s.id) ?? { subjectId: s.id });
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

    assignments.forEach((a) => {
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

    try {
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

      const res = await axios.post(`/api/admin/classes`, payload);

      toast({
        title: res?.data?.message ?? "Class created successfully",
        type: "success",
      });

      onCreated?.();
      onClose();
    } catch (err: any) {
      if (isAxiosError(err)) {
        const data = err.response?.data as any;

        toast({
          title: data?.message ?? data?.error ?? "Failed to create class",
          type: "error",
        });
      } else {
        toast({
          title: "Failed to create class",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <Card>
          <h1 className="text-[16px] font-semibold mb-[24px]">Create Class</h1>

          <div className="grid grid-cols-3 gap-4">
            <FormField>
              <FormLabel>Class Name *</FormLabel>
              <FormControl>
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Class-10"
                />
              </FormControl>
              <FormMessage>{validationErrors.className}</FormMessage>
            </FormField>

            <FormField>
              <FormLabel>Section *</FormLabel>
              <FormControl>
                <Input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="B"
                />
              </FormControl>
              <FormMessage>{validationErrors.section}</FormMessage>
            </FormField>

            <FormField>
              <FormLabel>Home Room *</FormLabel>
              <FormControl>
                <Input
                  value={homeRoom}
                  onChange={(e) => setHomeRoom(e.target.value)}
                  placeholder="105"
                />
              </FormControl>
              <FormMessage>{validationErrors.homeRoom}</FormMessage>
            </FormField>
          </div>
        </Card>

        <Card>
          <label className="block text-sm font-medium mb-2">
            Class Teacher *
          </label>

          <SearchableDropdown
            value={classTeacherId}
            onChange={setClassTeacherId}
          />

          {validationErrors.classTeacherId && (
            <div className="text-sm text-red-600 mt-2">
              {validationErrors.classTeacherId}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Subjects & Faculty</h2>
            <Badge>{selectedSubjects.length} Selected</Badge>
          </div>

          <MultiSelect
            value={selectedSubjects}
            onChange={setSelectedSubjects}
          />

          {validationErrors.subjects && (
            <div className="text-sm text-red-600 mt-2">
              {validationErrors.subjects}
            </div>
          )}
        </Card>

        {selectedSubjects.length > 0 && (
          <Card>
            <h3 className="font-semibold mb-4">Assignment Schedule</h3>

            <div className="space-y-3">
              {assignments.map((a) => {
                const subject = selectedSubjects.find(
                  (s) => s.id === a.subjectId,
                );

                return (
                  <div
                    key={a.subjectId}
                    className="border rounded p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject?.name}</span>
                      {/* <span>{subject?.id}</span> */}
                      <button
                        type="button"
                        onClick={() => removeSubject(a.subjectId)}
                      >
                        <X size={16} />
                      </button>

                      <SearchableDropdown
                        value={a.teacherId ?? null}
                        subjectId={a.subjectId} // ✅ PASS SUBJECT ID
                        onChange={(id) =>
                          updateAssignment(a.subjectId, {
                            teacherId: id,
                          })
                        }
                        fetchTeachers={getTeachers}
                      />

                      <input
                        type="time"
                        value={a.startTime || ""}
                        onChange={(e) =>
                          updateAssignment(a.subjectId, {
                            startTime: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2"
                      />

                      <input
                        type="time"
                        value={a.endTime || ""}
                        onChange={(e) =>
                          updateAssignment(a.subjectId, {
                            endTime: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2"
                      />

                      <input
                        placeholder="Room"
                        value={a.room || ""}
                        onChange={(e) =>
                          updateAssignment(a.subjectId, {
                            room: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
        <div className="flex justify-end gap-2 sticky bottom-0 bg-white p-4">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="dark" disabled={loading}>
            {loading ? "Saving…" : "Create Class"}
          </Button>
        </div>
      </form>
    </>
  );
}
