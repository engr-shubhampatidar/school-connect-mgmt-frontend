"use client";
import React, { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Form, FormField, FormLabel, FormMessage } from "../ui/Form";
import { Input } from "../ui/Input";
import { useToast } from "../ui/use-toast";
import API from "@/lib/axios";
import { ADMIN_API } from "@/lib/api-routes";

const createTeacherSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  phone: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : undefined)),
  subjects: z
    .string()
    .optional()
    .transform((v) =>
      v
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined
    ),
  classId: z.string().optional(),
});

type CreateTeacherValues = z.infer<typeof createTeacherSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateTeacherDialog({
  open,
  onClose,
  onCreated,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<CreateTeacherValues>({
    resolver: zodResolver(
      createTeacherSchema
    ) as unknown as Resolver<CreateTeacherValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subjects: undefined,
      classId: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get<unknown>(ADMIN_API.CLASSES);
        if (!mounted) return;
        const data = res.data;
        if (Array.isArray(data)) {
          setClasses(data as { id: string; name: string }[]);
        } else if (data && typeof data === "object") {
          const obj = data as Record<string, unknown>;
          // support { items: [...] } shape from the API
          if (Array.isArray(obj.items)) {
            setClasses(
              (obj.items as any[]).map((it) => ({
                id: String(it.id),
                name: `${String(it.name)}${
                  it.section ? ` ${String(it.section)}` : ""
                }`,
              }))
            );
          } else if (Array.isArray(obj.classes)) {
            setClasses(obj.classes as { id: string; name: string }[]);
          } else {
            setClasses([
              { id: "class-1", name: "Class 1" },
              { id: "class-2", name: "Class 2" },
            ]);
          }
        }
      } catch {
        if (!mounted) return;
        setClasses([
          { id: "class-1", name: "Class 1" },
          { id: "class-2", name: "Class 2" },
        ]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (values: CreateTeacherValues) => {
    setLoading(true);
    try {
      await API.post(ADMIN_API.TEACHERS, {
        // send both keys to support either backend shape
        fullName: values.fullName,
        name: values.fullName,
        email: values.email,
        phone: values.phone ?? undefined,
        subjects: values.subjects ?? undefined,
        classId: values.classId ?? undefined,
      });

      toast({ title: "Teacher created", type: "success" });
      form.reset();
      onClose();
      onCreated?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, unknown> | undefined;
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          const fe = data.fieldErrors as Record<string, unknown>;
          Object.entries(fe).forEach(([k, v]) => {
            const field = (
              k === "name" ? "fullName" : k
            ) as keyof CreateTeacherValues;
            form.setError(field, {
              type: "server",
              message: String(v),
            });
          });
        }
        toast({
          title: "Failed to create teacher",
          description: (data && (data.message as string)) ?? err.message,
          type: "error",
        });
      } else if (err instanceof Error) {
        toast({
          title: "Failed to create teacher",
          description: err.message,
          type: "error",
        });
      } else {
        toast({ title: "Failed to create teacher", type: "error" });
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
                Create Teacher
              </h3>
              <p className="text-sm text-slate-600">
                Invite a teacher to your school.
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
                <FormLabel>Full Name</FormLabel>
                <Input {...form.register("fullName")} placeholder="Full name" />
                <FormMessage>
                  {form.formState.errors.fullName?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Email</FormLabel>
                <Input
                  {...form.register("email")}
                  placeholder="teacher@example.com"
                />
                <FormMessage>
                  {form.formState.errors.email?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Phone</FormLabel>
                <Input
                  {...form.register("phone")}
                  placeholder="Optional phone"
                />
                <FormMessage>
                  {form.formState.errors.phone?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Subjects (comma separated)</FormLabel>
                <Input
                  {...form.register("subjects")}
                  placeholder="Mathematics, Science"
                />
                <FormMessage>
                  {form.formState.errors.subjects?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Assigned Class</FormLabel>
                <select
                  className="block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-sky-500"
                  {...form.register("classId")}
                >
                  <option value="">None</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FormMessage>
                  {form.formState.errors.classId?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create Teacher"}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
