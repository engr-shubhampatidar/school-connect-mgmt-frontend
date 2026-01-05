"use client";

import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import Select from "../ui/Select";
import { useToast } from "../ui/use-toast";
import {
  fetchClassSubjects,
  fetchSubjects,
  fetchAvailableTeachers,
  assignSubjectToClass,
  updateClassSubject,
  removeClassSubject,
  Subject,
  ClassSubjectDto,
  Teacher,
} from "@/lib/adminApi";

type Props = {
  classId: string;
};

export default function ClassSubjectsManager({ classId }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<ClassSubjectDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editing, setEditing] = useState<ClassSubjectDto | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchClassSubjects(classId);
      setItems(res ?? []);
    } catch (err) {
      toast({ title: "Failed to load subjects", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    (async () => {
      try {
        const s = await fetchSubjects();
        setSubjects(s.subjects ?? []);
      } catch {}
      try {
        const t = await fetchAvailableTeachers();
        setTeachers(t ?? []);
      } catch {}
    })();
  }, [classId]);

  const handleRemove = async (cs: ClassSubjectDto) => {
    const ok = confirm(
      `Remove subject "${cs.subjectName ?? ""}" from this class?`
    );
    if (!ok) return;
    try {
      await removeClassSubject(classId, cs.id);
      toast({ title: "Subject removed", type: "success" });
      load();
    } catch (err) {
      toast({ title: "Failed to remove subject", type: "error" });
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">
        <Button onClick={() => setShowAdd(true)}>Add Subject</Button>
      </div>

      <Card>
        <div className="px-2 py-3">
          {loading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-slate-600">No subjects assigned.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Assigned Teacher</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>{it.subjectName ?? "-"}</TableCell>
                    <TableCell>{it.teacherName ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => setEditing(it)}>
                          Assign / Change
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemove(it)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {showAdd ? (
        <AddSubjectModal
          subjects={subjects}
          teachers={teachers}
          onClose={() => setShowAdd(false)}
          onAdded={() => {
            setShowAdd(false);
            load();
          }}
          classId={classId}
        />
      ) : null}

      {editing ? (
        <ChangeTeacherModal
          classId={classId}
          cs={editing}
          teachers={teachers}
          onClose={() => setEditing(null)}
          onUpdated={() => {
            setEditing(null);
            load();
          }}
        />
      ) : null}
    </div>
  );
}

function AddSubjectModal({
  subjects,
  teachers,
  onClose,
  onAdded,
  classId,
}: {
  subjects: Subject[];
  teachers: Teacher[];
  onClose: () => void;
  onAdded: () => void;
  classId: string;
}) {
  const { toast } = useToast();
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!subjectId) {
      toast({ title: "Select a subject", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await assignSubjectToClass(classId, {
        subjectId,
        teacherId: teacherId || undefined,
      });
      toast({ title: "Subject assigned", type: "success" });
      onAdded();
    } catch (err) {
      toast({ title: "Failed to assign subject", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md p-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Add Subject</h3>
            </div>
            <div>
              <button onClick={onClose} className="text-slate-500">
                ✕
              </button>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-sm text-slate-600">Subject (required)</div>
              <div className="mt-2">
                <Select
                  options={subjects.map((s) => ({ id: s.id, name: s.name }))}
                  value={subjectId}
                  onChange={setSubjectId}
                  placeholder="Select subject"
                />
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-600">Teacher (optional)</div>
              <div className="mt-2">
                <Select
                  options={[
                    { id: "", name: "Unassigned" },
                    ...teachers.map((t) => ({ id: t.id, name: t.name })),
                  ]}
                  value={teacherId}
                  onChange={setTeacherId}
                  placeholder="Select teacher"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button onClick={submit} disabled={loading}>
                {loading ? "Adding…" : "Add Subject"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChangeTeacherModal({
  classId,
  cs,
  teachers,
  onClose,
  onUpdated,
}: {
  classId: string;
  cs: ClassSubjectDto;
  teachers: Teacher[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { toast } = useToast();
  const [teacherId, setTeacherId] = useState(cs.teacherId ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await updateClassSubject(classId, cs.id, {
        teacherId: teacherId === "" ? null : teacherId,
      });
      toast({ title: "Updated", type: "success" });
      onUpdated();
    } catch (err) {
      toast({ title: "Failed to update", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md p-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Assign / Change Teacher</h3>
              <div className="text-sm text-slate-600">{cs.subjectName}</div>
            </div>
            <div>
              <button onClick={onClose} className="text-slate-500">
                ✕
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="text-sm text-slate-600">Teacher</div>
              <div className="mt-2">
                <Select
                  options={[
                    { id: "", name: "Unassigned" },
                    ...teachers.map((t) => ({ id: t.id, name: t.name })),
                  ]}
                  value={teacherId ?? ""}
                  onChange={setTeacherId}
                  placeholder="Select teacher"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button onClick={submit} disabled={loading}>
                {loading ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
