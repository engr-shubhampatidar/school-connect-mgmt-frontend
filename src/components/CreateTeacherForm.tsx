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
} from "@/schemas/teacher.schema";
import {
  fetchSubjects,
  generateEmployeeId,
  createTeacher,
  ApiValidationError,
} from "@/services/teacher.service";
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
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { InfoIcon } from "lucide-react";

type Props = {
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateTeacherForm({ onClose, onCreated }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState(false);
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const generateTimer = useRef<number | null>(null);

  const form = useForm<CreateTeacherValues>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "+91 ",
      date_of_birth: "",
      gender: "male",
      aadhaar: undefined,
      subjects: [],
      permanentAddress: "",
      employeeId: undefined,
    },
    mode: "onBlur",
  });

  const { control, handleSubmit, watch, setError, reset, formState } = form;

  // Fetch subjects once
  useEffect(() => {
    let mounted = true;
    (async () => {
      setSubjectsLoading(true);
      setSubjectsError(null);
      try {
        const items = await fetchSubjects("");
        if (!mounted) return;
        setSubjects(items);
      } catch (err) {
        if (!mounted) return;
        setSubjectsError((err as Error).message ?? "Failed to load subjects");
      } finally {
        if (mounted) setSubjectsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ id: s.id, name: s.name })),
    [subjects],
  );

  // Employee ID generation when fullName, date_of_birth and phone are valid
  const watchedFullName = watch("fullName");
  const watchedDob = watch("date_of_birth");
  const watchedPhone = watch("phone");

  const shouldGenerateId = useMemo(() => {
    // ensure the fields exist and not empty and no validation errors present for those fields
    if (!watchedFullName || !watchedDob || !watchedPhone) return false;
    const errs = formState.errors;
    if (errs.fullName || errs.date_of_birth || errs.phone) return false;
    return true;
  }, [watchedFullName, watchedDob, watchedPhone, formState.errors]);

  const triggerGenerate = useCallback(() => {
    if (!shouldGenerateId) return;
    // debounce
    if (generateTimer.current) window.clearTimeout(generateTimer.current);
    generateTimer.current = window.setTimeout(async () => {
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch {}
      }
      abortRef.current = new AbortController();
      setGeneratingId(true);
      setEmployeeId(null);
      try {
        const res = await generateEmployeeId({
          fullName: watchedFullName.trim(),
          date_of_birth: watchedDob,
          phone: watchedPhone.trim(),
        });
        setEmployeeId(res.employee_id);
        // also set form value for employeeId via uncontrolled field if needed
        // we don't call setValue to avoid extra re-renders; store locally
      } catch (err) {
        if (err instanceof ApiValidationError) {
          // map backend field errors (may indicate missing fields)
          Object.entries(err.fieldErrors).forEach(([k, v]) => {
            try {
              setError(k as any, { type: "server", message: v });
            } catch {}
          });
        } else if (axios.isAxiosError(err)) {
          // ignore network blips for employee id generation, but set a toast
          toast({
            title: err.message || "Failed to generate employee id",
            type: "error",
          });
        } else if (err instanceof Error) {
          toast({ title: err.message, type: "error" });
        }
      } finally {
        setGeneratingId(false);
      }
    }, 600);
  }, [shouldGenerateId, watchedFullName, watchedDob, watchedPhone, setError]);

  useEffect(() => {
    triggerGenerate();
    return () => {
      if (generateTimer.current) window.clearTimeout(generateTimer.current);
    };
  }, [triggerGenerate]);

  const { toast } = useToast();

  const onSubmit: SubmitHandler<CreateTeacherValues> = useCallback(
    async (values) => {
      try {
        // build backend payload with expected field names
        const numeric = (s?: string) => (s ? s.replace(/\D/g, "") : "");

        // ensure employee id exists; generate if missing
        let finalEmployeeId = employeeId;
        if (!finalEmployeeId) {
          try {
            const gen = await generateEmployeeId({
              fullName: values.fullName.trim(),
              date_of_birth: values.date_of_birth,
              phone: values.phone.trim(),
            });
            finalEmployeeId = gen.employee_id;
            setEmployeeId(finalEmployeeId ?? null);
          } catch (err) {
            if (axios.isAxiosError(err) || err instanceof Error) {
              toast({ title: "Failed to generate employee id", type: "error" });
            }
            throw err;
          }
        }

        const payload: any = {
          email: values.email,
          fullName: values.fullName,
          mobile: numeric(values.phone),
          address: values.permanentAddress,
          gender: values.gender,
          date_of_birth: values.date_of_birth,
          subject_speciality: values.subjects,
          employee_id: finalEmployeeId,
        };

        // include aadhar only when provided (send digits-only string)
        if (values.aadhaar) payload.aadhar = numeric(values.aadhaar);

        const res: any = await createTeacher(payload);
        // show temporary credentials returned by backend
        setTempEmail(res?.email ?? payload.email ?? null);
        setTempPassword(
          res?.temporaryPassword ?? res?.temporary_password ?? null,
        );
        toast({
          title: res?.message ?? "Teacher created successfully",
          type: "success",
        });
        reset();
        setEmployeeId(null);
        onCreated?.();
      } catch (err) {
        if (err instanceof ApiValidationError) {
          Object.entries(err.fieldErrors).forEach(([k, v]) => {
            // backend sometimes returns message 'Email already exists'
            try {
              setError(k as any, { type: "server", message: v });
            } catch {}
          });
          toast({ title: err.message || "Validation failed", type: "error" });
          return;
        }
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as any;
          if (data?.message) {
            // put common field message under email when it mentions email exists
            if (
              typeof data.message === "string" &&
              data.message.toLowerCase().includes("email") &&
              data.message.toLowerCase().includes("exist")
            ) {
              setError("email" as any, {
                type: "server",
                message: data.message,
              });
            }
          }
          toast({
            title: err.message || "Failed to create teacher",
            type: "error",
          });
          return;
        }
        toast({
          title: (err as Error).message || "Failed to create teacher",
          type: "error",
        });
      }
    },
    [employeeId, onCreated, reset, setError],
  );

  const renderSubjectMulti = useCallback(
    () => (
      <Controller
        control={control}
        name="subjects"
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-4">
              {" "}
              <FormField>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("fullName")}
                    placeholder="e.g. Sarah Jenkins"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.fullName?.message as React.ReactNode}
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("phone")}
                    placeholder="+91 9876543210"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message as React.ReactNode}
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    options={[
                      { id: "male", name: "Male" },
                      { id: "female", name: "Female" },
                      { id: "other", name: "Other" },
                    ]}
                    value={form.watch("gender")}
                    onChange={(v) =>
                      form.setValue("gender", v as "male" | "female" | "other")
                    }
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.gender?.message as React.ReactNode}
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
                  {form.formState.errors.email?.message as React.ReactNode}
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>Date of Birth</FormLabel>
                <Controller
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => {
                    const pickerValue = field.value
                      ? new Date(field.value)
                      : undefined;
                    return (
                      <div className="space-y-2">
                        <FormDatePicker
                          value={pickerValue}
                          onChange={(d: Date | undefined) => {
                            if (!d) {
                              field.onChange("");
                            } else {
                              // store as YYYY-MM-DD string for schema
                              const iso = d.toISOString().split("T")[0];
                              field.onChange(iso);
                            }
                          }}
                        />
                      </div>
                    );
                  }}
                />
                <FormMessage>
                  {
                    form.formState.errors.date_of_birth
                      ?.message as React.ReactNode
                  }
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>Aadhar Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                    {...form.register("aadhaar")}
                    placeholder="12 digit Aadhaar"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.aadhaar?.message as React.ReactNode}
                </FormMessage>
              </FormField>
            </div>
          </div>

          <FormField>
            <FormLabel>
              Subject Speciality{" "}
              <span className="text-[14px] text-[#646487] font-[500]">
                {"(Max 3)"}
              </span>
            </FormLabel>
            <div>{renderSubjectMulti()}</div>
            <FormMessage>
              {form.formState.errors.subjects?.message as React.ReactNode}
            </FormMessage>
            {subjectsError ? (
              <div className="text-xs text-destructive mt-1">
                {subjectsError}
              </div>
            ) : null}
          </FormField>

          {/* <Separator /> */}

          <FormField>
            <FormLabel>Employee ID</FormLabel>
            <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
              <p>{employeeId ? employeeId : "EDU-XXXX"}</p>
              <div className="flex items-center">
                <InfoIcon className="h-4 w-4" />
                <span className="text-xs text-[#64748B] ml-1">
                  {generatingId ? "Generating..." : "AUTO_GENERATED"}
                </span>
              </div>
            </div>
          </FormField>

          <FormField>
            <FormLabel>Permanent Address</FormLabel>
            <FormControl>
              <Textarea
                {...form.register("permanentAddress")}
                maxLength={450}
                rows={4}
                placeholder="Enter complete residential address..."
              />
            </FormControl>
            <FormMessage>
              {
                form.formState.errors.permanentAddress
                  ?.message as React.ReactNode
              }
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving…" : "Create Teacher"}
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
