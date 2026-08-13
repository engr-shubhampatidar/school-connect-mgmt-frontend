"use client";

import { useEffect } from "react";
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
  reviewSubmissionSchema,
  type ReviewSubmissionValues,
} from "@/modules/homework/schemas/homework.schemas";
import type {
  HomeworkSubmission,
  ReviewSubmissionPayload,
} from "@/modules/homework/types";

type Props = {
  open: boolean;
  submission: HomeworkSubmission | null;
  maxMarks?: number | null;
  onClose: () => void;
  onSubmit: (payload: ReviewSubmissionPayload) => Promise<void>;
};

export function ReviewDialog({
  open,
  submission,
  maxMarks,
  onClose,
  onSubmit,
}: Props) {
  const form = useForm<ReviewSubmissionValues>({
    resolver: zodResolver(
      reviewSubmissionSchema,
    ) as unknown as Resolver<ReviewSubmissionValues>,
    defaultValues: {
      marksObtained: undefined,
      remarks: "",
      status: "REVIEWED",
    },
  });

  useEffect(() => {
    if (!open || !submission) return;
    form.reset({
      marksObtained: submission.marksObtained ?? undefined,
      remarks: submission.remarks ?? "",
      status: "REVIEWED",
    });
  }, [open, submission, form]);

  if (!open || !submission) return null;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit({
        marksObtained:
          values.marksObtained === undefined ||
          Number.isNaN(values.marksObtained)
            ? undefined
            : values.marksObtained,
        remarks: values.remarks?.trim() || undefined,
        status: values.status,
      });
      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string | string[] })?.message
        : null;
      form.setError("root", {
        message: Array.isArray(message)
          ? message.join(", ")
          : message || "Review failed",
      });
    }
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold text-[#021034]">
          Review submission
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {submission.studentName ?? "Student"}
          {maxMarks != null ? ` · Max ${maxMarks}` : ""}
        </p>

        <Form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <FormField>
            <FormLabel>Marks</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min={0}
                max={maxMarks ?? undefined}
                {...form.register("marksObtained")}
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.marksObtained?.message}
            </FormMessage>
          </FormField>

          <FormField>
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea rows={3} {...form.register("remarks")} />
            </FormControl>
          </FormField>

          <FormField>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <select
                className="w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-sm"
                {...form.register("status")}
              >
                <option value="REVIEWED">Reviewed</option>
                <option value="RETURNED">Returned for resubmission</option>
              </select>
            </FormControl>
          </FormField>

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
              {form.formState.isSubmitting ? "Saving…" : "Save review"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
