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

const createClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  section: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : undefined)),
});

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
    defaultValues: { name: "", section: "" },
  });

  if (!open) return null;

  const onSubmit = async (values: CreateClassValues) => {
    setLoading(true);
    try {
      await createClass({
        name: values.name,
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
                <FormLabel>Class Name</FormLabel>
                <Input {...form.register("name")} placeholder="e.g. Grade 5" />
                <FormMessage>
                  {form.formState.errors.name?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Section</FormLabel>
                <Input
                  {...form.register("section")}
                  placeholder="Optional section (A, B...)"
                />
                <FormMessage>
                  {form.formState.errors.section?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} type="button">
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
