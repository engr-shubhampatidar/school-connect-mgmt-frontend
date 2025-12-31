"use client";
import React, { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Button from "../ui/Button";
import Card from "../ui/Card";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "../ui/Form";
import { Input } from "../ui/Input";
import Select from "../ui/Select";
import { Controller } from "react-hook-form";
import { useToast } from "../ui/use-toast";
// classes are provided by parent; do not call API here
import type { ClassItem } from "@/lib/adminApi";
import API from "@/lib/axios";
import { ADMIN_API } from "@/lib/api-routes";

const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rollNo: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : undefined)),
  classId: z.string().min(1, "Class is required"),
  photoUrl: z
    .string()
    .optional()
    .refine((v) => {
      if (!v) return true;
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "Must be a valid URL"),
});

type CreateStudentValues = z.infer<typeof createStudentSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  classes?: ClassItem[];
};

export default function CreateStudentDialog({
  open,
  onClose,
  onCreated,
  classes: parentClasses,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>(parentClasses ?? []);

  // accept classes from parent via props; use fallback if not provided
  useEffect(() => {
    if (parentClasses && parentClasses.length > 0) {
      setClasses(parentClasses);
      return;
    }
    // fallback no callses, with lable no classes available
    setClasses([{ id: "", name: "No classes available" }]);
  }, [parentClasses]);

  const form = useForm<CreateStudentValues>({
    resolver: zodResolver(
      createStudentSchema
    ) as unknown as Resolver<CreateStudentValues>,
    defaultValues: { name: "", rollNo: "", classId: "", photoUrl: "" },
  });

  const onSubmit = async (values: CreateStudentValues) => {
    setLoading(true);
    try {
      await API.post(ADMIN_API.STUDENTS, {
        name: values.name,
        rollNo: values.rollNo ?? undefined,
        classId: values.classId,
        photoUrl: values.photoUrl ?? undefined,
      });

      toast({ title: "Student created", type: "success" });
      form.reset();
      onClose();
      onCreated?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, unknown> | undefined;
        // map backend field errors if present
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          const fe = data.fieldErrors as Record<string, unknown>;
          Object.entries(fe).forEach(([k, v]) => {
            form.setError(k as keyof CreateStudentValues, {
              type: "server",
              message: String(v),
            });
          });
        }
        toast({
          title: "Failed to create student",
          description: (data && (data.message as string)) ?? err.message,
          type: "error",
        });
      } else if (err instanceof Error) {
        toast({
          title: "Failed to create student",
          description: err.message,
          type: "error",
        });
      } else {
        toast({ title: "Failed to create student", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg p-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Create Student
              </h3>
              <p className="text-sm text-slate-600">
                Add a new student record to the school.
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
                <FormLabel>Name</FormLabel>
                <Input {...form.register("name")} placeholder="Student name" />
                <FormMessage>
                  {form.formState.errors.name?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Roll Number</FormLabel>
                <Input
                  {...form.register("rollNo")}
                  placeholder="Optional roll number"
                />
                <FormMessage>
                  {form.formState.errors.rollNo?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Controller
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                      <Select
                        options={classes.map((c) => ({
                          id: c.id,
                          name: `${c.name}${
                            c.section ? ` - ${c.section}` : ""
                          }`,
                        }))}
                        value={field.value ?? ""}
                        onChange={(v) => field.onChange(v)}
                        placeholder="Select class"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.classId?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Photo URL</FormLabel>
                <Input
                  {...form.register("photoUrl")}
                  placeholder="https://example.com/photo.jpg"
                />
                <FormMessage>
                  {form.formState.errors.photoUrl?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create Student"}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
