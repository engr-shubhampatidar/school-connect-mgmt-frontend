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
  classId: z.string().min(1, "Class is required"),
  email: z.string().email("Invalid email address").optional(),
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
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [tempRollNo, setTempRollNo] = useState<string | null>(null);

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
    defaultValues: { name: "", classId: "", email: "", photoUrl: "" },
  });

  const onSubmit = async (values: CreateStudentValues) => {
    setLoading(true);
    try {
      const resp = await API.post(ADMIN_API.STUDENTS, {
        name: values.name,
        classId: values.classId,
        email: values.email ?? undefined,
        photoUrl:
          values.photoUrl && values.photoUrl.trim() !== ""
            ? values.photoUrl
            : "https://i.pinimg.com/736x/ce/30/bc/ce30bc4a449d4926ad1dd3164dc5c46f.jpg",
      });

      toast({ title: "Student created successfully", type: "success" });
      form.reset();
      // Notify parent to refresh list
      onCreated?.();

      // If backend returned a temporary password (when creating a user by email),
      // show it once to the admin. Keep the dialog open until the admin closes
      // the temporary password modal so the value isn't lost on unmount.
      const data = resp.data as
        | {
            id?: string;
            name?: string;
            rollNo?: string;
            temporaryPassword?: string;
          }
        | undefined;

      const rollNo = data?.rollNo ?? null;
      const pw = data?.temporaryPassword ?? null;

      if (typeof rollNo === "string" && rollNo.length > 0) {
        setTempRollNo(rollNo);
      }

      if (typeof pw === "string" && pw.length > 0) {
        setTempPassword(pw);
      }

      if (!rollNo && !pw) {
        // nothing to show
        onClose();
      }
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
                <p className="mt-1 text-sm text-slate-500">
                  Roll number will be auto-generated
                </p>
                <FormMessage>
                  {form.formState.errors.classId?.message as React.ReactNode}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Email (optional)</FormLabel>
                <Input
                  {...form.register("email")}
                  placeholder="student@example.com"
                />
                <FormMessage>
                  {form.formState.errors.email?.message as React.ReactNode}
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
      {tempPassword || tempRollNo ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-md p-4">
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Temporary Password
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Share this password with the student — it will not be shown
                    again.
                  </p>
                </div>
                <div>
                  <button
                    aria-label="close"
                    onClick={() => {
                      setTempPassword(null);
                      setTempRollNo(null);
                      onClose();
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="rounded-md border p-4">
                  <div className="text-sm text-slate-700">Roll No</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="font-mono text-lg text-slate-900">
                      {tempRollNo ?? "-"}
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          const parts: string[] = [];
                          if (tempRollNo) parts.push(`Roll No: ${tempRollNo}`);
                          if (tempPassword)
                            parts.push(`Temporary Password: ${tempPassword}`);
                          const toCopy = parts.join("\n");
                          try {
                            await navigator.clipboard.writeText(toCopy);
                            toast({
                              title: "Copied to clipboard",
                              type: "success",
                            });
                          } catch {
                            toast({ title: "Copy failed", type: "error" });
                          }
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  {tempPassword ? (
                    <>
                      <div className="mt-4 text-sm text-slate-700">
                        Temporary Password
                      </div>
                      <div className="mt-2 font-mono text-lg text-slate-900">
                        {tempPassword}
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      setTempPassword(null);
                      setTempRollNo(null);
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
