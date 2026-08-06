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
import {
  submitHomeworkSchema,
  type SubmitHomeworkValues,
} from "@/modules/homework/schemas/homework.schemas";
import type { SubmitHomeworkPayload } from "@/modules/homework/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: SubmitHomeworkPayload) => Promise<void>;
  initialContent?: string | null;
  initialAttachments?: { filename: string; url: string }[] | null;
};

export function SubmissionDialog({
  open,
  onClose,
  onSubmit,
  initialContent,
  initialAttachments,
}: Props) {
  const [attachments, setAttachments] = useState<
    { filename: string; url: string }[]
  >([]);
  const form = useForm<SubmitHomeworkValues>({
    resolver: zodResolver(
      submitHomeworkSchema,
    ) as unknown as Resolver<SubmitHomeworkValues>,
    mode: "onChange",
    defaultValues: { content: "" },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ content: initialContent ?? "" });
    setAttachments(initialAttachments ?? []);
  }, [open, initialContent, initialAttachments, form]);

  if (!open) return null;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit({
        content: values.content?.trim() || undefined,
        attachments: attachments.filter((a) => a.filename && a.url),
      });
      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string | string[] })?.message
        : null;
      form.setError("root", {
        message: Array.isArray(message)
          ? message.join(", ")
          : message || "Submission failed",
      });
    }
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-1 text-lg font-semibold text-[#021034]">
          Submit work
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Add your answer text and optional attachment links.
        </p>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <FormField>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea rows={5} {...form.register("content")} />
            </FormControl>
            <FormMessage>{form.formState.errors.content?.message}</FormMessage>
          </FormField>

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
                + Add
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="dark"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
