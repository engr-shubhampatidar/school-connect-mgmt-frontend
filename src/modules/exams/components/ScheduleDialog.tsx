"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Button from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { fetchSubjects } from "@/modules/subjects/api/subjects";
import type { Subject } from "@/modules/subjects/types/subjects";
import {
  createScheduleSchema,
  type CreateScheduleValues,
} from "@/modules/exams/schemas/exam.schemas";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateScheduleValues) => Promise<void>;
};

export function ScheduleDialog({ open, onClose, onSubmit }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [saving, setSaving] = useState(false);

  const form = useForm<CreateScheduleValues>({
    resolver: zodResolver(
      createScheduleSchema,
    ) as unknown as Resolver<CreateScheduleValues>,
    mode: "onChange",
    defaultValues: {
      subjectId: "",
      examDate: "",
      startTime: "",
      endTime: "",
      maxMarks: 100,
      passMarks: 33,
      venue: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    void fetchSubjects({ page: 1, pageSize: 200 }).then((res) => {
      setSubjects(res.subjects ?? []);
    });
    form.reset({
      subjectId: "",
      examDate: "",
      startTime: "",
      endTime: "",
      maxMarks: 100,
      passMarks: 33,
      venue: "",
    });
  }, [open, form]);

  if (!open) return null;

  const handleSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      await onSubmit({
        ...values,
        startTime: values.startTime || undefined,
        endTime: values.endTime || undefined,
        venue: values.venue || undefined,
      });
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string | string[] })?.message;
        form.setError("root", {
          message: Array.isArray(message)
            ? message.join(", ")
            : String(message ?? "Failed to save schedule"),
        });
      }
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-[#021034]">
          Add subject schedule
        </h2>
        <Form onSubmit={handleSubmit}>
          <FormField>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <select
                {...form.register("subjectId")}
                className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.code ? ` (${s.code})` : ""}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage>
              {form.formState.errors.subjectId?.message}
            </FormMessage>
          </FormField>
          <FormField>
            <FormLabel>Exam date</FormLabel>
            <FormControl>
              <Input type="date" {...form.register("examDate")} />
            </FormControl>
            <FormMessage>
              {form.formState.errors.examDate?.message}
            </FormMessage>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField>
              <FormLabel>Start time</FormLabel>
              <FormControl>
                <Input type="time" {...form.register("startTime")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.startTime?.message}
              </FormMessage>
            </FormField>
            <FormField>
              <FormLabel>End time</FormLabel>
              <FormControl>
                <Input type="time" {...form.register("endTime")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.endTime?.message}
              </FormMessage>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField>
              <FormLabel>Max marks</FormLabel>
              <FormControl>
                <Input type="number" {...form.register("maxMarks")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.maxMarks?.message}
              </FormMessage>
            </FormField>
            <FormField>
              <FormLabel>Pass marks</FormLabel>
              <FormControl>
                <Input type="number" {...form.register("passMarks")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.passMarks?.message}
              </FormMessage>
            </FormField>
          </div>
          <FormField>
            <FormLabel>Venue</FormLabel>
            <FormControl>
              <Input {...form.register("venue")} placeholder="Hall A" />
            </FormControl>
            <FormMessage>{form.formState.errors.venue?.message}</FormMessage>
          </FormField>
          {form.formState.errors.root?.message ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="dark" disabled={saving}>
              {saving ? "Saving…" : "Add"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
