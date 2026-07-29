"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  type TimetableEntryDto,
  fetchTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} from "@/modules/timetable";
import TimetableModal from "./TimetableModal";
import { Button } from "@/components/ui/Button";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Timetable({ classId }: { classId: string }) {
  const [entries, setEntries] = useState<TimetableEntryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TimetableEntryDto | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTimetable(classId);
      setEntries(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const byDay = useMemo(() => {
    const map: Record<number, TimetableEntryDto[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
    };
    for (const e of entries) {
      (map[e.dayOfWeek] ||= []).push(e);
    }
    for (const k of Object.keys(map)) {
      map[Number(k)].sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    }
    return map;
  }, [entries]);

  const handleCreate = async (payload: any) => {
    const res = await createTimetableEntry(classId, payload);
    await load();
    return res;
  };

  const handleUpdate = async (payload: any) => {
    if (!editing) throw new Error("Missing editing entry");
    const res = await updateTimetableEntry(classId, editing.id, payload);
    await load();
    return res;
  };

  const handleDelete = async (te: TimetableEntryDto) => {
    if (
      !confirm(
        `Delete ${te.subjectName ?? "entry"} ${te.startTime}-${te.endTime}?`,
      )
    )
      return;
    await deleteTimetableEntry(classId, te.id);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Weekly Timetable</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Add Entry
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3">
        {DAYS.map((d, i) => (
          <div key={d} className="border rounded p-2 min-h-[150px] bg-white">
            <div className="text-xs font-medium mb-2">{d}</div>
            <div className="flex flex-col gap-2">
              {(byDay[i + 1] || []).map((te) => (
                <div key={te.id} className="rounded border p-2 bg-slate-50">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-sm truncate">
                        {te.subjectName ?? "Subject"}
                      </div>
                      <div className="text-xs text-slate-600">
                        {te.teacherName ?? "Teacher"}{" "}
                        {te.room ? `· ${te.room}` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {te.startTime} - {te.endTime}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <button
                      className="text-xs text-slate-700 hover:underline"
                      onClick={() => {
                        setEditing(te);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => handleDelete(te)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {(!byDay[i + 1] || byDay[i + 1].length === 0) && (
                <div className="text-xs text-slate-400">No entries</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TimetableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {}}
        classId={classId}
        existingEntries={entries}
        initial={editing ?? undefined}
        mode={editing ? "edit" : "create"}
        onSubmit={editing ? handleUpdate : handleCreate}
      />
    </div>
  );
}
