"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import MultiSelect from "../ui/MultiSelect";
import Separator from "../ui/Separator";
import { useToast } from "../ui/use-toast";
import API from "@/lib/axios";
import { ADMIN_API } from "@/lib/api-routes";

const assignmentSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().optional(),
});

const createTeacherSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Must be a valid email"),
    phone: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim() : undefined)),
    subjects: z.array(z.string()).optional(), // subject ids
    isClassTeacher: z.boolean().optional(),
    classTeacher: z.string().optional(),
    assignClassSubjects: z.array(assignmentSchema).optional(),
  })
  .superRefine((val, ctx) => {
    const subjectSet = new Set(val.subjects ?? []);
    const seen = new Set<string>();
    (val.assignClassSubjects ?? []).forEach((a, idx) => {
      if (a.subjectId && !subjectSet.has(a.subjectId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Assigned subject must be one of selected specialties`,
          path: ["assignClassSubjects", idx, "subjectId"],
        });
      }
      const key = `${a.classId}::${a.subjectId ?? ""}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate assignment for class and subject`,
          path: ["assignClassSubjects", idx],
        });
      }
      seen.add(key);
    });
    if (val.isClassTeacher && val.classTeacher && val.assignClassSubjects) {
      // it's allowed, but ensure selected class exists in assignments? not needed
    }
  });

type CreateTeacherValues = z.input<typeof createTeacherSchema>;

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
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<CreateTeacherValues>({
    resolver: zodResolver(createTeacherSchema) as any,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subjects: [],
      isClassTeacher: false,
      classTeacher: undefined,
      assignClassSubjects: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assignClassSubjects",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          API.get(ADMIN_API.CLASSES),
          API.get(ADMIN_API.SUBJECTS),
        ]);
        if (!mounted) return;
        const cdata = cRes.data;
        const sdata = sRes.data;
        const normalize = (arr: unknown[]) =>
          arr.map((it) => {
            if (it && typeof it === "object") {
              const o = it as Record<string, unknown>;
              return {
                id: String(
                  o.id ?? o._id ?? o.uuid ?? o.value ?? o.key ?? o.name ?? ""
                ),
                name: String(o.name ?? o.title ?? o.value ?? ""),
              };
            }
            return { id: String(it ?? ""), name: String(it ?? "") };
          });
        setClasses(
          Array.isArray(cdata)
            ? normalize(cdata as unknown[])
            : Array.isArray((cdata as Record<string, unknown>).items)
            ? normalize((cdata as Record<string, unknown>).items as unknown[])
            : []
        );
        setSubjects(
          Array.isArray(sdata)
            ? normalize(sdata as unknown[])
            : Array.isArray((sdata as Record<string, unknown>).items)
            ? normalize((sdata as Record<string, unknown>).items as unknown[])
            : []
        );
      } catch {
        // fallback to empty lists
        if (!mounted) return;
        setClasses([]);
        setSubjects([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (values: CreateTeacherValues) => {
    setLoading(true);
    try {
      const payload = {
        fullName: values.fullName,
        name: values.fullName,
        email: values.email,
        phone: values.phone ?? undefined,
        subjects: values.subjects ?? [],
        classTeacher: values.isClassTeacher
          ? values.classTeacher ?? undefined
          : undefined,
        assignClassSubjects: (values.assignClassSubjects ?? []).map((a) => ({
          classId: a.classId,
          subjectId: a.subjectId ?? undefined,
        })),
      };

      await API.post(ADMIN_API.TEACHERS, payload);

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
            try {
              form.setError(field as unknown as keyof CreateTeacherValues, {
                type: "server",
                message: String(v),
              });
            } catch {}
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
      <div className="relative w-full max-w-2xl p-4 max-h-[90vh]">
        <Card>
          <div className=" max-h-[80vh]">
            <div className="flex items-start sticky top-0 bg-white justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Create Teacher
                </h3>
                <p className="text-sm text-slate-600">
                  Add a teacher and configure assignments.
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

            <div className="mt-4 space-y-4">
              <div className="overflow-auto max-h-[60vh]">
                <Card className="p-4">
                  <h4 className="text-sm font-medium">Basic Info</h4>
                  <p className="text-xs text-slate-500">
                    Full name, email and phone number.
                  </p>
                  <div className="mt-3 space-y-3">
                    <Form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...form.register("fullName")}
                            placeholder="Full name"
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            form.formState.errors.fullName
                              ?.message as React.ReactNode
                          }
                        </FormMessage>
                      </FormField>

                      <FormField>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...form.register("email")}
                            placeholder="teacher@example.com"
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            form.formState.errors.email
                              ?.message as React.ReactNode
                          }
                        </FormMessage>
                      </FormField>

                      <FormField>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...form.register("phone")}
                            placeholder="Optional phone"
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            form.formState.errors.phone
                              ?.message as React.ReactNode
                          }
                        </FormMessage>
                      </FormField>
                    </Form>
                  </div>
                </Card>

                <Separator />

                <Card className="p-4">
                  <h4 className="text-sm font-medium">Subject Speciality</h4>
                  <p className="text-xs text-slate-500">
                    Subjects this teacher is qualified to teach
                  </p>
                  <div className="mt-3">
                    <MultiSelect
                      options={subjects}
                      value={form.watch("subjects") ?? []}
                      onChange={(v) => form.setValue("subjects", v)}
                      placeholder="Select subjects"
                    />
                    <FormMessage>
                      {
                        (
                          (form.formState.errors as Record<string, unknown>)
                            .subjects as Record<string, unknown> | undefined
                        )?.message as React.ReactNode
                      }
                    </FormMessage>
                  </div>
                </Card>

                <Separator />

                <Card className="p-4">
                  <h4 className="text-sm font-medium">
                    Class Teacher (Optional)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Responsible for attendance and announcements
                  </p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...form.register("isClassTeacher")}
                      />
                      <span className="text-sm">
                        Make this teacher a Class Teacher
                      </span>
                    </label>

                    {form.watch("isClassTeacher") && (
                      <div>
                        <Select
                          options={classes}
                          value={form.watch("classTeacher") ?? ""}
                          onChange={(v) => form.setValue("classTeacher", v)}
                          placeholder="Select class"
                        />
                        <FormMessage>
                          {
                            (
                              (form.formState.errors as Record<string, unknown>)
                                .classTeacher as
                                | Record<string, unknown>
                                | undefined
                            )?.message as React.ReactNode
                          }
                        </FormMessage>
                      </div>
                    )}
                  </div>
                </Card>

                <Separator />

                <Card className="p-4">
                  <h4 className="text-sm font-medium">Teaching Assignments</h4>
                  <p className="text-xs text-slate-500">
                    Define which subject this teacher teaches in which class
                  </p>
                  <div className="mt-3 space-y-2">
                    {fields.map((f, idx) => (
                      <div
                        key={f.id}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-5">
                          <Select
                            options={classes}
                            value={
                              form.watch(
                                `assignClassSubjects.${idx}.classId`
                              ) ?? ""
                            }
                            onChange={(v: string) =>
                              form.setValue(
                                `assignClassSubjects.${idx}.classId` as unknown as keyof CreateTeacherValues,
                                v
                              )
                            }
                            placeholder="Select class"
                          />
                        </div>
                        <div className="col-span-5">
                          {(() => {
                            const availableSubjects = subjects.filter((s) =>
                              (form.watch("subjects") ?? []).includes(s.id)
                            );
                            const opts =
                              availableSubjects.length > 0
                                ? availableSubjects
                                : [{ id: "", name: "Not available" }];
                            return (
                              <Select
                                options={opts}
                                value={
                                  form.watch(
                                    `assignClassSubjects.${idx}.subjectId`
                                  ) ?? ""
                                }
                                onChange={(v: string) =>
                                  form.setValue(
                                    `assignClassSubjects.${idx}.subjectId` as unknown as keyof CreateTeacherValues,
                                    v
                                  )
                                }
                                placeholder="Select subject (optional)"
                              />
                            );
                          })()}
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => remove(idx)}
                            type="button"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div>
                      <Button
                        type="button"
                        onClick={() =>
                          append({ classId: "", subjectId: undefined })
                        }
                      >
                        + Assign Another Class
                      </Button>
                    </div>
                    <FormMessage>
                      {
                        (
                          (form.formState.errors as Record<string, unknown>)
                            .assignClassSubjects as
                            | Record<string, unknown>
                            | undefined
                        )?.message as React.ReactNode
                      }
                    </FormMessage>
                  </div>
                </Card>
              </div>

              <div className="mt-4 sticky bottom-0 bg-white flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Create Teacher"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
