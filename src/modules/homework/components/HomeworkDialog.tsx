"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import MultiSelect from "@/components/ui/MultiSelect";
import {
  createHomeworkSchema,
  type CreateHomeworkValues,
} from "@/modules/homework/schemas/homework.schemas";
import type { CreateHomeworkPayload, Homework } from "@/modules/homework/types";

type Option = { id: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateHomeworkPayload) => Promise<void>;
  classOptions: Option[];
  subjectOptions: Option[];
  initial?: Homework | null;
  title?: string;
};

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function HomeworkDialog({
  open,
  onClose,
  onSubmit,
  classOptions,
  subjectOptions,
  initial = null,
  title,
}: Props) {
  const [attachments, setAttachments] = useState<
    { filename: string; url: string }[]
  >([]);
  const form = useForm<CreateHomeworkValues>({
    resolver: zodResolver(
      createHomeworkSchema,
    ) as unknown as Resolver<CreateHomeworkValues>,
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      type: "HOMEWORK",
      subjectId: "",
      dueAt: "",
      allowLateSubmission: true,
      classIds: [],
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.reset({
        title: initial.title,
        description: initial.description ?? "",
        type: initial.type,
        subjectId: initial.subjectId ?? "",
        dueAt: toLocalInputValue(initial.dueAt),
        maxMarks: initial.maxMarks ?? undefined,
        allowLateSubmission: initial.allowLateSubmission,
        classIds: initial.classes.map((c) => c.classId),
      });
      setAttachments(initial.attachments ?? []);
    } else {
      form.reset({
        title: "",
        description: "",
        type: "HOMEWORK",
        subjectId: "",
        dueAt: "",
        allowLateSubmission: true,
        classIds: [],
      });
      setAttachments([]);
    }
  }, [open, initial, form]);

  if (!open) return null;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: CreateHomeworkPayload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        type: values.type,
        subjectId: values.subjectId || undefined,
        dueAt: new Date(values.dueAt).toISOString(),
        maxMarks:
          values.maxMarks === undefined || Number.isNaN(values.maxMarks)
            ? undefined
            : values.maxMarks,
        allowLateSubmission: values.allowLateSubmission,
        classIds: values.classIds,
        attachments: attachments.filter((a) => a.filename && a.url),
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string | string[] })?.message
        : null;
      form.setError("root", {
        message: Array.isArray(message)
          ? message.join(", ")
          : message || "Failed to save homework",
      });
    }
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#021034]">
              {title ?? (initial ? "Edit work" : "Create homework / assignment")}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Assign to one or more classes with a due date and attachments.
            </p>
          </div>
          <button
            type="button"
            className="text-slate-500"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-4">
          <FormField>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...form.register("title")} placeholder="Title" />
            </FormControl>
            <FormMessage>{form.formState.errors.title?.message}</FormMessage>
          </FormField>

          <FormField>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <select
                className="w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-sm"
                {...form.register("type")}
              >
                <option value="HOMEWORK">Homework</option>
                <option value="ASSIGNMENT">Assignment</option>
              </select>
            </FormControl>
          </FormField>

          <FormField>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                rows={4}
                {...form.register("description")}
                placeholder="Instructions for students"
              />
            </FormControl>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <FormLabel>Due date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...form.register("dueAt")} />
              </FormControl>
              <FormMessage>{form.formState.errors.dueAt?.message}</FormMessage>
            </FormField>
            <FormField>
              <FormLabel>Max marks (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...form.register("maxMarks")}
                />
              </FormControl>
            </FormField>
          </div>

          <FormField>
            <FormLabel>Subject (optional)</FormLabel>
            <FormControl>
              <select
                className="w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-sm"
                {...form.register("subjectId")}
              >
                <option value="">No subject</option>
                {subjectOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormField>

          <FormField>
            <FormLabel>Classes</FormLabel>
            <FormControl>
              <MultiSelect
                options={classOptions}
                value={form.watch("classIds")}
                onChange={(ids) =>
                  form.setValue("classIds", ids, { shouldValidate: true })
                }
                placeholder="Select classes"
              />
            </FormControl>
            <FormMessage>{form.formState.errors.classIds?.message}</FormMessage>
          </FormField>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" {...form.register("allowLateSubmission")} />
            Allow late submission
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>Attachments</FormLabel>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setAttachments((prev) => [...prev, { filename: "", url: "" }])
                }
              >
                + Add file URL
              </Button>
            </div>
            {attachments.map((a, idx) => (
              <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                <Input
                  placeholder="Filename"
                  value={a.filename}
                  onChange={(e) =>
                    setAttachments((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, filename: e.target.value } : item,
                      ),
                    )
                  }
                />
                <Input
                  placeholder="https://..."
                  value={a.url}
                  onChange={(e) =>
                    setAttachments((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, url: e.target.value } : item,
                      ),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {form.formState.errors.root?.message && (
            <p className="text-sm text-red-600">
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="dark"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
