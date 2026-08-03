"use client";
import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/use-toast";
import { createClass } from "@/modules/classes/api/classes";
import {
  createClassSchema,
  type CreateClassValues,
} from "@/modules/classes/schemas/createClassSchema";

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
      createClassSchema,
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
                    placeholder="e.g. 5 (1–12)"
                    inputMode="numeric"
                    className="rounded-l-none"
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      const el = e.currentTarget as HTMLInputElement;
                      el.value = el.value.replace(/\D/g, "").slice(0, 2);
                      form.setValue("number", el.value, {
                        shouldValidate: true,
                      });
                    }}
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
                    placeholder="Optional (A–E)"
                    maxLength={1}
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      const el = e.currentTarget as HTMLInputElement;
                      el.value = el.value
                        .toUpperCase()
                        .replace(/[^A-E]/g, "")
                        .slice(0, 1);
                      form.setValue("section", el.value, {
                        shouldValidate: true,
                      });
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
