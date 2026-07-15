"use client";

import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Lock, Plus } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { FormField, FormLabel, FormControl, FormMessage } from "../ui/Form";
import { Input } from "../ui/Input";
import { useToast } from "../ui/use-toast";
import SearchableDropdown from "./SearchableDropdown";
import { getTeachers } from "@/services/teacher.service";
import { fetchClassById, updateClass } from "@/lib/adminApi";

type Props = {
  open: boolean;
  classId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
};

export default function EditClassDialog({
  open,
  classId,
  onClose,
  onUpdated,
}: Props) {
  const { toast } = useToast();
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [classTeacherId, setClassTeacherId] = useState<string | null>(null);
  const [classTeacherName, setClassTeacherName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !classId) return;
    let mounted = true;
    setFetching(true);
    setErrors({});
    fetchClassById(classId)
      .then((data) => {
        if (!mounted) return;
        setClassName(data.className);
        setSection(data.section);
        setRoomNo(data.homeRoom);
        setClassTeacherName(data.classTeacherName);
        setClassTeacherId(null);
      })
      .catch(() => {
        if (!mounted) return;
        toast({ title: "Failed to load class details", type: "error" });
      })
      .finally(() => {
        if (mounted) setFetching(false);
      });
    return () => {
      mounted = false;
    };
  }, [open, classId, toast]);

  if (!open) return null;

  function validate() {
    const errs: Record<string, string> = {};
    if (!roomNo.trim()) errs.roomNo = "Room number is required";
    if (!classTeacherId && !classTeacherName)
      errs.classTeacherId = "Class teacher is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classId || !validate()) return;

    let teacherId = classTeacherId;
    if (!teacherId && classTeacherName) {
      const teachers = await getTeachers(classTeacherName);
      teacherId = teachers.find((t) => t.name === classTeacherName)?.id ?? null;
    }
    if (!teacherId) {
      setErrors((prev) => ({
        ...prev,
        classTeacherId: "Class teacher is required",
      }));
      return;
    }

    setLoading(true);
    try {
      await updateClass(classId, {
        room_no: roomNo.trim(),
        classTeacherId: teacherId,
      });
      toast({ title: "Class updated successfully", type: "success" });
      onUpdated?.();
      onClose();
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ??
          "Failed to update class")
        : "Failed to update class";
      toast({ title: message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[717px] max-h-[90vh] overflow-auto bg-white rounded-lg z-50">
        <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
          <div>
            <h3 className="text-[24px] font-[700] text-white">
              Edit Class Detail
            </h3>
            <p className="text-[14px] font-[400] text-white">
              Update the location and assigned personnel for this class
              instance.
            </p>
          </div>
          <button
            aria-label="close"
            onClick={onClose}
            className="text-white hover:text-white/80"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <Card>
            {fetching ? (
              <p className="text-sm text-slate-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B]">
                        <span>{className}</span>
                        <Lock size={14} className="text-[#94A3B8]" />
                      </div>
                    </FormControl>
                  </FormField>
                  <FormField>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B]">
                        <span>{section}</span>
                        <Lock size={14} className="text-[#94A3B8]" />
                      </div>
                    </FormControl>
                  </FormField>
                </div>
                <p className="text-[12px] text-[#737373]">
                  Field cannot be modified directly from this screen.
                </p>

                <FormField>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      placeholder="e.g. 302"
                    />
                  </FormControl>
                  <FormMessage>{errors.roomNo}</FormMessage>
                </FormField>

                <FormField>
                  <FormLabel>Class Teacher</FormLabel>
                  <FormControl>
                    <SearchableDropdown
                      value={classTeacherId}
                      onChange={setClassTeacherId}
                      selectedLabel={classTeacherName}
                      fetchTeachers={getTeachers}
                      placeholder="Select class teacher"
                    />
                  </FormControl>
                  <FormMessage>{errors.classTeacherId}</FormMessage>
                  <p className="text-[12px] text-[#737373] mt-1">
                    The teacher will be responsible for attendance and grading
                    for this class.
                  </p>
                </FormField>
              </div>
            )}
          </Card>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="dark"
              disabled={loading || fetching}
              className="flex items-center gap-1"
            >
              <Plus size={14} />
              {loading ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
