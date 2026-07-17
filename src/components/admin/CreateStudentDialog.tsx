"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  useForm,
  Controller,
  type FieldErrors,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
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
import { useToast } from "../ui/use-toast";
// classes are provided by parent; do not call API here
import type { ClassItem } from "@/lib/adminApi";
import API from "@/lib/axios";
import { ADMIN_API } from "@/lib/api-routes";
import { FormDatePicker } from "../ui/form-date-picker";

const GENDER_OPTIONS = [
  { id: "MALE", name: "Male" },
  { id: "FEMALE", name: "Female" },
  { id: "OTHER", name: "Other" },
] as const;

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.string().email("Invalid email address").optional());

const optionalPhone = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(
    z.string().min(10, "Phone number must be 10 digits").max(15).optional(),
  );

const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  classId: z.string().min(1, "Class is required"),
  email: optionalEmail,
  phoneNumber: optionalPhone,
  profileUrl: z
    .string()
    .optional()
    .refine((v) => {
      if (!v || v.trim() === "") return true;
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "Must be a valid URL"),
  admissionDate: z.string().min(1, "Admission date is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z
    .string()
    .min(1, "Gender is required")
    .pipe(z.enum(["MALE", "FEMALE", "OTHER"])),
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
      createStudentSchema,
    ) as unknown as Resolver<CreateStudentValues>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      classId: "",
      email: "",
      phoneNumber: "",
      profileUrl: "",
      admissionDate: "",
      date_of_birth: "",
    },
  });

  const {
    control,
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<CreateStudentValues> = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const resp = await API.post(ADMIN_API.STUDENTS, {
          firstName: values.firstName,
          lastName: values.lastName,
          classId: values.classId,
          email: values.email ?? undefined,
          phoneNumber: values.phoneNumber ?? undefined,
          profileUrl:
            values.profileUrl && values.profileUrl.trim() !== ""
              ? values.profileUrl
              : null,
          admissionDate: values.admissionDate,
          date_of_birth: values.date_of_birth,
          gender: values.gender,
        });

        toast({ title: "Student created successfully", type: "success" });
        reset();
        // Notify parent to refresh list
        onCreated?.();

        // If backend returned a temporary password (when creating a user by email),
        // show it once to the admin. Keep the dialog open until the admin closes
        // the temporary password modal so the value isn't lost on unmount.
        const data = resp.data as
          | {
              id?: string;
              studentId?: string;
              admissionDate?: string;
              profileUrl?: string | null;
              user?: { fullName?: string; email?: string } | null;
              class?: { id?: string; name?: string } | null;
              temporaryPassword?: string | null;
            }
          | undefined;

        const studentId = data?.studentId ?? null;
        const pw = data?.temporaryPassword ?? null;

        if (typeof studentId === "string" && studentId.length > 0) {
          setTempRollNo(studentId);
        }

        if (typeof pw === "string" && pw.length > 0) {
          setTempPassword(pw);
        }

        if (!studentId && !pw) {
          onClose();
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as
            | Record<string, unknown>
            | undefined;
          // map backend field errors if present
          if (data?.fieldErrors && typeof data.fieldErrors === "object") {
            const fe = data.fieldErrors as Record<string, unknown>;
            Object.entries(fe).forEach(([k, v]) => {
              setError(k as keyof CreateStudentValues, {
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
    },
    [onClose, onCreated, reset, setError, toast],
  );

  const onInvalid = useCallback(
    (fieldErrors: FieldErrors<CreateStudentValues>) => {
      const firstError = Object.values(fieldErrors).find(
        (error) => error?.message,
      );
      toast({
        title: "Please fix the form errors",
        description:
          (firstError?.message as string) ??
          "Some required fields are missing or invalid.",
        type: "error",
      });
    },
    [toast],
  );

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative w-[777px] p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
          <div className="rounded-lg">
            <div className=" min-h-full">
              <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    Create New Student
                  </h3>
                  <p className="text-[14px] font-[400] text-white">
                    Fill in the details to register a new student in the system.
                  </p>
                </div>
                <div>
                  <button
                    aria-label="close"
                    onClick={onClose}
                    className="text-white hover:text-white/80"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-[16px] bg-white overflow-hidden rounded-b-lg max-h-full">
                <Form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                  <Card>
                    <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
                      Class Information
                    </h1>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...register("firstName")}
                              type="text"
                              placeholder="First Name"
                            />
                          </FormControl>
                          <FormMessage>
                            {errors.firstName?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                        <FormField>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...register("lastName")}
                              type="text"
                              placeholder="Last Name"
                            />
                          </FormControl>
                          <FormMessage>
                            {errors.lastName?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField>
                          <FormLabel>Class Name</FormLabel>
                          <FormControl>
                            <Controller
                              control={control}
                              name="classId"
                              render={({ field }) => (
                                <Select
                                  options={classes.map((c) => ({
                                    id: c.id,
                                    name: `${c.name}`,
                                  }))}
                                  value={field.value ?? ""}
                                  onChange={(v) => field.onChange(v)}
                                  placeholder="Select"
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage>
                            {errors.classId?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                        <FormField>
                          <FormLabel>Admission Date</FormLabel>
                          <Controller
                            control={control}
                            name="admissionDate"
                            render={({ field }) => {
                              const formatLocalYMD = (date: Date) =>
                                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                              const parseLocalDate = (value?: string) => {
                                if (!value) return undefined;
                                const [y, m, d] = value.split("-").map(Number);
                                return new Date(y, m - 1, d);
                              };

                              return (
                                <div className="space-y-2">
                                  <FormDatePicker
                                    value={parseLocalDate(field.value)}
                                    onChange={(date: Date | undefined) => {
                                      if (!date) {
                                        field.onChange("");
                                      } else {
                                        field.onChange(formatLocalYMD(date));
                                      }
                                    }}
                                  />
                                </div>
                              );
                            }}
                          />
                          <FormMessage>
                            {errors.admissionDate?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField>
                          <FormLabel>Date of Birth</FormLabel>
                          <Controller
                            control={control}
                            name="date_of_birth"
                            render={({ field }) => {
                              const formatLocalYMD = (date: Date) =>
                                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                              const parseLocalDate = (value?: string) => {
                                if (!value) return undefined;
                                const [y, m, d] = value.split("-").map(Number);
                                return new Date(y, m - 1, d);
                              };

                              return (
                                <div className="space-y-2">
                                  <FormDatePicker
                                    value={parseLocalDate(field.value)}
                                    onChange={(date: Date | undefined) => {
                                      if (!date) {
                                        field.onChange("");
                                      } else {
                                        field.onChange(formatLocalYMD(date));
                                      }
                                    }}
                                  />
                                </div>
                              );
                            }}
                          />
                          <FormMessage>
                            {errors.date_of_birth?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                        <FormField>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Controller
                              control={control}
                              name="gender"
                              render={({ field }) => (
                                <Select
                                  options={[...GENDER_OPTIONS]}
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="Select"
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage>
                            {errors.gender?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField>
                          <FormLabel>Email Address </FormLabel>
                          <FormControl>
                            <Input
                              {...register("email")}
                              type="text"
                              placeholder="john@example.com"
                            />
                          </FormControl>
                          <FormMessage>
                            {errors.email?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                        <FormField>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="flex w-full rounded-md border border-[#D7E3FC]  text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]  focus-within:ring-1 focus-within:ring-[#D7E3FC] focus-within:border-[#D7E3FC]">
                              <p className="border-r border-[#D7E3FC] px-2 py-2">
                                +91
                              </p>
                              <input
                                {...form.register("phoneNumber")}
                                className="pl-2 w-full outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                                maxLength={10}
                                type="text"
                                placeholder="9876543210"
                              />
                            </div>
                          </FormControl>
                          <FormMessage>
                            {errors.phoneNumber?.message as React.ReactNode}
                          </FormMessage>
                        </FormField>
                      </div>
                      <FormField>
                        <FormLabel>Profile URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...register("profileUrl")}
                            type="text"
                            placeholder="https://linkedin.com/in/student-name"
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.profileUrl?.message as React.ReactNode}
                        </FormMessage>
                      </FormField>
                    </div>
                  </Card>

                  <div className="mt-6 flex sticky bottom-0 justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>

                    <Button type="submit" variant="dark" disabled={loading}>
                      {loading ? "Creating…" : "Create Student"}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
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
