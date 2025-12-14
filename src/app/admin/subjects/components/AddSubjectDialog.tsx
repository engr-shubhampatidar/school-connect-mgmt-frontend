"use client";
import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Button from "../../../../components/ui/Button";
import Card from "../../../../components/ui/Card";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/Form";
import { Input } from "../../../../components/ui/Input";
import { useToast } from "../../../../components/ui/use-toast";
import { createSubject } from "../../../../lib/adminApi";

const createSubjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .min(1, "Code is required")
    .transform((v) => v.trim().toUpperCase()),
});

type CreateSubjectValues = z.infer<typeof createSubjectSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function AddSubjectDialog({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateSubjectValues>({
    resolver: zodResolver(
      createSubjectSchema
    ) as unknown as Resolver<CreateSubjectValues>,
    mode: "onChange",
    defaultValues: { name: "", code: "" },
  });

  const onSubmit = async (values: CreateSubjectValues) => {
    setLoading(true);
    try {
      await createSubject({ name: values.name, code: values.code });
      toast({ title: "Subject created", type: "success" });
      form.reset();
      onClose();
      onCreated?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, unknown> | undefined;
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          const fe = data.fieldErrors as Record<string, unknown>;
          Object.entries(fe).forEach(([k, v]) => {
            form.setError(k as keyof CreateSubjectValues, {
              type: "server",
              message: String(v),
            });
          });
        }
        toast({
          title: "Failed to create subject",
          description: (data && (data.message as string)) ?? err.message,
          type: "error",
        });
      } else if (err instanceof Error) {
        toast({
          title: "Failed to create subject",
          description: err.message,
          type: "error",
        });
      } else {
        toast({ title: "Failed to create subject", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md p-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Add Subject
              </h3>
              <p className="text-sm text-slate-600">
                Create a new subject offered by the school.
              </p>
            </div>
            <div>
              <button
                aria-label="close"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField>
                <FormLabel>Subject Name</FormLabel>
                <Input {...form.register("name")} placeholder="Mathematics" />
                <FormMessage>
                  {form.formState.errors.name?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Subject Code</FormLabel>
                <Input {...form.register("code")} placeholder="MATH101" />
                <FormMessage>
                  {form.formState.errors.code?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || loading}
                >
                  {loading ? "Saving…" : "Save Subject"}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
