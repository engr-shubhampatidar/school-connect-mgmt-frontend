"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import {
  createTeacherSchema,
  CreateTeacherValues,
  Subject,
} from "@/modules/teachers/schemas/teacher.schema";
import {
  fetchSubjects,
  createTeacher,
  ApiValidationError,
  normalizeAadharDigits,
} from "@/modules/teachers/api/teacherService";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import MultiSelect from "@/components/ui/MultiSelect";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import type { FieldErrors, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { InfoIcon } from "lucide-react";

const GENDER_OPTIONS = [
  { id: "MALE", name: "Male" },
  { id: "FEMALE", name: "Female" },
  { id: "OTHER", name: "Other" },
] as const;

const createTeacherFormSchema = createTeacherSchema
  .omit({ aadhar: true, gender: true })
  .extend({
    gender: z
      .string()
      .min(1, "Gender is required")
      .pipe(z.enum(["MALE", "FEMALE", "OTHER"])),
    aadhar: z
      .string()
      .min(1, "Aadhar number is required")
      .transform((v) => normalizeAadharDigits(v))
      .refine((v) => /^[0-9]{12}$/.test(v), {
        message: "Aadhar must be exactly 12 digits",
      }),
  });

function formatAadharDisplay(value: string): string {
  const digits = normalizeAadharDigits(value).slice(0, 12);
  return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, p1, p2, p3) =>
    [p1, p2, p3].filter(Boolean).join(" "),
  );
}

type Props = {
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateTeacherForm({ onClose, onCreated }: Props) {
  const { toast } = useToast(); // ✅ Toast at top

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const form = useForm<CreateTeacherValues>({
    resolver: zodResolver(createTeacherFormSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      date_of_birth: "",
      aadhar: "",
      subject_speciality: [],
      address: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // ================= FETCH SUBJECTS =================
  useEffect(() => {
    let mounted = true;
    (async () => {
      setSubjectsLoading(true);
      try {
        const items = await fetchSubjects("");
        if (!mounted) return;
        setSubjects(items);
      } catch (err) {
        toast({
          title: "Failed to load subjects",
          description: (err as Error).message,
          type: "error",
        });
      } finally {
        if (mounted) setSubjectsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [toast]);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ id: s.id, name: s.name })),
    [subjects],
  );

  const onSubmit: SubmitHandler<CreateTeacherValues> = useCallback(
    async (values) => {
      try {
        const payload: CreateTeacherValues = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          mobile: `+91${values.mobile}`,
          date_of_birth: values.date_of_birth,
          gender: values.gender,
          aadhar: values.aadhar,
          subject_speciality: values.subject_speciality,
          address: values.address,
        };

        const res: any = await createTeacher(payload);

        setTempEmail(res?.email ?? null);
        setTempPassword(res?.temporaryPassword ?? null);

        toast({
          title: "Teacher created successfully 🎉",
          description: "Temporary credentials generated.",
          type: "success",
        });

        reset();
        onCreated?.();
      } catch (err) {
        console.log("Error creating teacher:", err);
        if (err instanceof ApiValidationError) {
          Object.entries(err.fieldErrors).forEach(([k, v]) => {
            setError(k as any, { type: "server", message: v });
          });

          toast({
            title: "Validation failed",
            description: err.message,
            type: "error",
          });
          return;
        }

        if (axios.isAxiosError(err)) {
          toast({
            title: "Network Error",
            description: err.message,
            type: "error",
          });
          return;
        }

        toast({
          title: "Something went wrong",
          description: (err as Error).message,
          type: "error",
        });
      }
    },
    [onCreated, reset, setError, toast],
  );

  const onInvalid = useCallback(
    (fieldErrors: FieldErrors<CreateTeacherValues>) => {
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

  const renderSubjectMulti = useCallback(
    () => (
      <Controller
        control={control}
        name="subject_speciality"
        render={({ field }) => (
          <MultiSelect
            options={subjectOptions}
            value={field.value ?? []}
            onChange={(v) => field.onChange(v)}
            placeholder={
              subjectsLoading ? "Loading subjects..." : "Select subjects"
            }
          />
        )}
      />
    ),
    [control, subjectOptions, subjectsLoading],
  );

  return (
    <div className="p-[16px]">
      <Form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-4">
              {" "}
              <FormField>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("firstName")}
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
                    {...form.register("lastName")}
                    placeholder="Last Name"
                  />
                </FormControl>
                <FormMessage>
                  {errors.lastName?.message as React.ReactNode}
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Controller
                    control={control}
                    name="mobile"
                    render={({ field }) => (
                      <div className="flex w-full rounded-md border border-[#D7E3FC]  text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]  focus-within:ring-1 focus-within:ring-[#D7E3FC] focus-within:border-[#D7E3FC]">
                        <p className="border-r border-[#D7E3FC] px-2 py-2">+91</p>
                        <input
                          className="pl-2 w-full outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                          type="text"
                          placeholder="9876543210"
                          maxLength={10}
                          inputMode="numeric"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          onBlur={field.onBlur}
                        />
                      </div>
                    )}
                  />
                </FormControl>
                <FormMessage>
                  {errors.mobile?.message as React.ReactNode}
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
                      />
                    )}
                  />
                </FormControl>
                <FormMessage>
                  {errors.gender?.message as React.ReactNode}
                </FormMessage>
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FormField>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("email")}
                    placeholder="sarah.j@school.edu.in"
                  />
                </FormControl>
                <FormMessage>
                  {errors.email?.message as React.ReactNode}
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>Date of Birth</FormLabel>
                <Controller
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => {
                    // parse "YYYY-MM-DD" as a local date (avoid Date("YYYY-MM-DD") UTC parsing)
                    const parseLocalDate = (s?: string) => {
                      if (!s) return undefined;
                      const [y, m, d] = s.split("-").map(Number);
                      if (!y || !m || !d) return undefined;
                      return new Date(y, m - 1, d);
                    };

                    // format a Date to local "YYYY-MM-DD" (avoid toISOString timezone shift)
                    const formatLocalYMD = (date: Date) =>
                      `${date.getFullYear()}-${String(
                        date.getMonth() + 1,
                      ).padStart(
                        2,
                        "0",
                      )}-${String(date.getDate()).padStart(2, "0")}`;

                    const pickerValue = parseLocalDate(field.value as string);

                    return (
                      <div className="space-y-2">
                        <FormDatePicker
                          value={pickerValue}
                          onChange={(d: Date | undefined) => {
                            if (!d) {
                              field.onChange("");
                            } else {
                              field.onChange(formatLocalYMD(d));
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
                <FormLabel>Aadhar Number</FormLabel>
                <FormControl>
                  <Controller
                    control={control}
                    name="aadhar"
                    render={({ field }) => (
                      <Input
                        type="tel"
                        inputMode="numeric"
                        maxLength={14}
                        value={formatAadharDisplay(field.value ?? "")}
                        onChange={(e) =>
                          field.onChange(
                            normalizeAadharDigits(e.target.value).slice(0, 12),
                          )
                        }
                        onBlur={field.onBlur}
                        placeholder="1234 5678 9012"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage>
                  {errors.aadhar?.message as React.ReactNode}
                </FormMessage>
              </FormField>
            </div>
          </div>

          <FormField>
            <FormLabel>
              Subject Speciality{" "}
              <span className="text-[14px] text-[#646487] font-[500]">
                {"(Max 5)"}
              </span>
            </FormLabel>
            <div>{renderSubjectMulti()}</div>
            <FormMessage>
              {errors.subject_speciality?.message as React.ReactNode}
            </FormMessage>
          </FormField>

          {/* <Separator /> */}

          <FormField>
            <FormLabel>Permanent Address</FormLabel>
            <FormControl>
              <Textarea
                {...form.register("address")}
                maxLength={450}
                rows={4}
                placeholder="Enter complete residential address..."
              />
            </FormControl>
            <FormMessage>
              {errors.address?.message as React.ReactNode}
            </FormMessage>
          </FormField>
          <div>
            <p className="text-[12px] text-[#64748B] font-[400] px-2">
              Security: This action will be logged and an invitation email will
              be sent to the{" teacher's"} provided email address for portal
              access.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} type="button" variant="ghost">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Create Teacher"}
            </Button>
          </div>
        </div>
      </Form>
      {tempEmail || tempPassword ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-md p-4">
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Temporary Credentials
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Share these credentials with the teacher — they will not be
                    shown again.
                  </p>
                </div>
                <div>
                  <button
                    aria-label="close"
                    onClick={() => {
                      setTempEmail(null);
                      setTempPassword(null);
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
                  <div className="text-sm text-slate-700">Email</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="font-mono text-lg text-slate-900">
                      {tempEmail ?? "-"}
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          const parts: string[] = [];
                          if (tempEmail) parts.push(`Email: ${tempEmail}`);
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

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setTempEmail(null);
                      setTempPassword(null);
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      try {
                        window.open("/login", "_blank", "noopener,noreferrer");
                      } catch {}
                    }}
                  >
                    Go to Teacher Login
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
