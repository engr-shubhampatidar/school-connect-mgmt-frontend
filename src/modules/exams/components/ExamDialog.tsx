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
import { fetchClasses, type ClassItem } from "@/modules/classes";
import {
  createExamSchema,
  type CreateExamValues,
} from "@/modules/exams/schemas/exam.schemas";
import type { Exam } from "@/modules/exams/types";
import { EXAM_TYPE_LABELS } from "@/modules/exams/utils/format";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateExamValues) => Promise<void>;
  initial?: Exam | null;
};

export function ExamDialog({ open, onClose, onSubmit, initial }: Props) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [saving, setSaving] = useState(false);

  const form = useForm<CreateExamValues>({
    resolver: zodResolver(
      createExamSchema,
    ) as unknown as Resolver<CreateExamValues>,
    mode: "onChange",
    defaultValues: {
      name: "",
      academicYear: "",
      examType: "MIDTERM",
      classId: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    void fetchClasses({ page: 1, pageSize: 1000 }).then((res) => {
      setClasses(res.classes ?? []);
    });
    if (initial) {
      form.reset({
        name: initial.name,
        academicYear: initial.academicYear,
        examType: initial.examType,
        classId: initial.classId,
        startDate: initial.startDate ?? "",
        endDate: initial.endDate ?? "",
        description: initial.description ?? "",
      });
    } else {
      form.reset({
        name: "",
        academicYear: "",
        examType: "MIDTERM",
        classId: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  }, [open, initial, form]);

  if (!open) return null;

  const handleSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      await onSubmit({
        ...values,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        description: values.description || undefined,
      });
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string })?.message ??
          "Failed to save exam";
        form.setError("root", { message: String(message) });
      }
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-[#021034]">
          {initial ? "Edit exam" : "Create exam"}
        </h2>
        <Form onSubmit={handleSubmit}>
          <FormField>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...form.register("name")} placeholder="Mid Term 2025-26" />
            </FormControl>
            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
          </FormField>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField>
              <FormLabel>Academic year</FormLabel>
              <FormControl>
                <Input {...form.register("academicYear")} placeholder="2025-26" />
              </FormControl>
              <FormMessage>
                {form.formState.errors.academicYear?.message}
              </FormMessage>
            </FormField>
            <FormField>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <select
                  {...form.register("examType")}
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage>
                {form.formState.errors.examType?.message}
              </FormMessage>
            </FormField>
          </div>
          <FormField>
            <FormLabel>Class</FormLabel>
            <FormControl>
              <select
                {...form.register("classId")}
                className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.section ? `-${c.section}` : ""}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage>{form.formState.errors.classId?.message}</FormMessage>
          </FormField>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <Input type="date" {...form.register("startDate")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.startDate?.message}
              </FormMessage>
            </FormField>
            <FormField>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <Input type="date" {...form.register("endDate")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.endDate?.message}
              </FormMessage>
            </FormField>
          </div>
          <FormField>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input
                {...form.register("description")}
                placeholder="Optional notes"
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.description?.message}
            </FormMessage>
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
              {saving ? "Saving…" : initial ? "Save" : "Create"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
