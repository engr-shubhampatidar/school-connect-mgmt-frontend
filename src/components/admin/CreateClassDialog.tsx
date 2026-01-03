"use client";
import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Form, FormField, FormLabel, FormMessage } from "../ui/Form";
import { Input } from "../ui/Input";
import { useToast } from "../ui/use-toast";
import { createClass } from "../../lib/adminApi";

const createClassSchema = z
  .object({
    number: z
      .string()
      .min(1, "Class number is required")
      .regex(/^\d{1,2}$/, "Class number must be 1 or 2 digits"),
    section: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim().toUpperCase() : undefined))
      .refine((v) => v === undefined || /^[A-Z]$/.test(v), {
        message: "Section must be a single letter A–Z",
      }),
  })
  .required();

type CreateClassValues = z.infer<typeof createClassSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateClassDialog({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateClassValues>({
    resolver: zodResolver(
      createClassSchema
    ) as unknown as Resolver<CreateClassValues>,
    defaultValues: { number: "", section: "" },
  });

  if (!open) return null;

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: CreateClassValues) => {
    setLoading(true);
    try {
      // Send only numeric class number and uppercase section to backend
      await createClass({
        name: values.number,
        section: values.section ?? undefined,
      });
      toast({ title: "Class created", type: "success" });
      form.reset();
      onClose();
      onCreated?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create class";
      toast({
        title: "Failed to create class",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md p-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Add Class
              </h3>
              <p className="text-sm text-slate-600">
                Create a new class entry.
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
                <FormLabel>Class</FormLabel>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md bg-slate-100 text-slate-700 border border-r-0">
                    Class
                  </span>
                  <Input
                    {...form.register("number")}
                    placeholder="e.g. 5"
                    inputMode="numeric"
                    className="rounded-l-none"
                  />
                </div>
                <FormMessage>
                  {form.formState.errors.number?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Section</FormLabel>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md bg-slate-100 text-slate-700 border border-r-0">
                    Section
                  </span>
                  <Input
                    {...form.register("section")}
                    placeholder="Optional (A)"
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      const el = e.currentTarget as HTMLInputElement;
                      el.value = el.value.toUpperCase().slice(0, 1);
                      form.setValue("section", el.value);
                    }}
                    className="rounded-l-none"
                  />
                </div>
                <FormMessage>
                  {form.formState.errors.section?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={handleCancel} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create Class"}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
