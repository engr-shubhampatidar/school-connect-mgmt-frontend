"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  Upload,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import API from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { log } from "console";

const nameRegex = /^[A-Za-z ]+$/;

const guardianSchema = z.object({
  father_name: z
    .string()
    .trim()
    .min(3, "Father name must be at least 3 characters")
    .max(100, "Too long"),
  mother_name: z
    .string()
    .trim()
    .min(3, "Mother name must be at least 3 characters")
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
  phone_no: z
    .string()
    .min(10, "Guardian phone must be 10-15 digits")
    .max(15, "Guardian phone must be 10-15 digits")
    .regex(/^[0-9]+$/, "Digits only"),
  email: z.string().trim().email("Invalid guardian email"),
  address: z
    .string()
    .trim()
    .max(300, "Max 300 characters")
    .optional()
    .or(z.literal("")),
});

const documentSchema = z.object({
  document_type: z.string().min(1, "Document type is required").max(120),
  url: z.string().url("Invalid document URL"),
});

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(nameRegex, "Only alphabets and spaces are allowed"),
  email: z.string().trim().email("Invalid email"),
  phone_no: z
    .string()
    .min(10, "Phone must be 10-15 digits")
    .max(15, "Phone must be 10-15 digits")
    .regex(/^[0-9]+$/, "Digits only"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Select gender",
  }),
  category: z.enum(["General", "OBC", "SC", "ST", "EWS"], {
    required_error: "Select category",
  }),
  admission_date: z.string().refine((v) => {
    if (!v) return false;
    const d = new Date(v);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    return d <= today;
  }, "Admission date cannot be in future"),
  address: z.string().trim().min(1, "Address is required").max(300),
  aadhar: z
    .string()
    .length(12, "Aadhar must be 12 digits")
    .regex(/^[0-9]{12}$/g, "Aadhar must be numeric"),
  guardian: guardianSchema,
  student_documents: z.array(documentSchema),
  class_name: z.string().optional(),
  admission_locked: z.boolean().optional(),
});

export type UpdateStudentForm = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  studentId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
};

type StudentProfileResponse = {
  student_id: string;
  id?: string;
  name: string;
  class_id: string;
  class_name?: string;
  email: string;
  phone_no: string;
  gender: "male" | "female" | "other";
  category: "General" | "OBC" | "SC" | "ST" | "EWS";
  admission_date: string | null;
  address: string;
  aadhar: string;
  guardian: {
    father_name: string;
    mother_name?: string | null;
    phone_no: string;
    email: string;
    address?: string | null;
  };
  student_documents?: Array<{ document_type: string; url: string }>;
};

type UploadingDoc = {
  name: string;
  status: "uploading" | "error" | "done";
  url?: string;
  error?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function cleanDigits(value: string) {
  return value.replace(/\D+/g, "");
}

function toLower(value: string) {
  return value.trim().toLowerCase();
}

export default function UpdateStudentDialog({
  open,
  studentId,
  onClose,
  onUpdated,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [classDisplay, setClassDisplay] = useState<string>("");
  const [admissionLocked, setAdmissionLocked] = useState(false);
  const [documents, setDocuments] = useState<
    Array<{ document_type: string; url: string }>
  >([]);
  const [uploading, setUploading] = useState<UploadingDoc[]>([]);
  const fetchController = useRef<AbortController | null>(null);
  const submitController = useRef<AbortController | null>(null);

  const form = useForm<UpdateStudentForm>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_no: "",
      gender: "male",
      category: "General",
      admission_date: "",
      address: "",
      aadhar: "",
      guardian: {
        father_name: "",
        mother_name: "",
        phone_no: "",
        email: "",
        address: "",
      },
      student_documents: [],
      class_name: "",
      admission_locked: false,
    },
  });

  const [studentIdDisplay, setStudentIdDisplay] = useState<string>("");

  const resetControllers = () => {
    fetchController.current?.abort();
    submitController.current?.abort();
  };

  const handleClose = () => {
    resetControllers();
    form.reset();
    setDocuments([]);
    setUploading([]);
    setFetchError(null);
    onClose();
  };

  const hydrateForm = useCallback(
    (data: StudentProfileResponse) => {
      const admissionDate = data.admission_date
        ? data.admission_date.split("T")[0]
        : "";
      const locked = Boolean(data.admission_date);
      // Ensure class_id is a string (API may sometimes return an object)
      let classIdValue: string = "";
      if (typeof data.class_id === "string") {
        classIdValue = data.class_id;
      } else if (data.class_id && typeof data.class_id === "object") {
        // try common id keys
        // eslint-disable-next-line no-console
        console.warn(
          "hydrateForm: class_id is an object, normalizing to string id",
          data.class_id,
        );
        classIdValue =
          (data.class_id as any).id ??
          (data.class_id as any).classId ??
          (data.class_id as any)._id ??
          String(data.class_id);
      }

      form.reset({
        name: data.name ?? "",
        email: data.email ?? "",
        phone_no: data.phone_no ?? "",
        gender: data.gender ?? "male",
        category: data.category ?? "General",
        admission_date: admissionDate,
        address: data.address ?? "",
        aadhar: data.aadhar ?? "",
        guardian: {
          father_name: data.guardian?.father_name ?? "",
          mother_name: data.guardian?.mother_name ?? "",
          phone_no: data.guardian?.phone_no ?? "",
          email: data.guardian?.email ?? "",
          address: data.guardian?.address ?? "",
        },
        student_documents: data.student_documents ?? [],
        class_name: data.class_name ?? "",
        admission_locked: locked,
      });
      setDocuments(data.student_documents ?? []);
      setStudentIdDisplay(data.student_id ?? data.id ?? "");
      // If API included a class display name use it, otherwise try to derive from object
      if (data.class_name && data.class_name.trim()) {
        setClassDisplay(data.class_name);
      } else if (data.class_id && typeof data.class_id === "object") {
        const cname =
          (data.class_id as any).name ?? (data.class_id as any).className ?? "";
        setClassDisplay(cname || "");
      } else {
        setClassDisplay("");
      }
      setAdmissionLocked(locked);
    },
    [form],
  );

  useEffect(() => {
    form.setValue("student_documents", documents);
  }, [documents, form]);

  useEffect(() => {
    if (!open || !studentId) return;
    setLoading(true);
    setFetchError(null);
    setDocuments([]);
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;

    (async () => {
      try {
        const res = await API.get(`/api/admin/students/${studentId}`, {
          signal: controller.signal,
        });
        hydrateForm(res.data as StudentProfileResponse);
      } catch (err: unknown) {
        if ((err as any)?.code === "ERR_CANCELED") return;
        const message =
          err instanceof Error ? err.message : "Failed to load student";
        setFetchError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, studentId, hydrateForm]);

  const handleDocumentUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const pending: UploadingDoc[] = [];
    const uploads: Array<Promise<void>> = [];

    Array.from(files).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({
          title: "Unsupported file type",
          description: "Only PDF, JPG, PNG allowed",
          type: "error",
        });
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Max size is 5MB per file",
          type: "error",
        });
        return;
      }
      const temp: UploadingDoc = { name: file.name, status: "uploading" };
      pending.push(temp);
      const formData = new FormData();
      formData.append("file", file);
      uploads.push(
        API.post("/api/uploads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((resp) => {
            const url =
              (resp.data?.url as string) ||
              (resp.data?.fileUrl as string) ||
              "";
            if (!url) {
              temp.status = "error";
              temp.error = "Missing upload URL";
              return;
            }
            if (documents.some((d) => d.url === url)) {
              temp.status = "error";
              temp.error = "Duplicate document";
              return;
            }
            temp.status = "done";
            temp.url = url;
            setDocuments((prev) => [
              ...prev,
              { document_type: file.name, url },
            ]);
          })
          .catch((error) => {
            temp.status = "error";
            temp.error =
              error instanceof Error ? error.message : "Upload failed";
          }),
      );
    });

    setUploading((prev) => [...prev, ...pending]);
    await Promise.all(uploads);
    setUploading((prev) => {
      const existingErrors = prev.filter((p) => p.status === "error");
      const newErrors = pending.filter((p) => p.status === "error");
      return [...existingErrors, ...newErrors];
    });
  };

  const removeDocument = (url: string) => {
    setDocuments((prev) => prev.filter((d) => d.url !== url));
  };

  const formValues = form.watch();

  const admissionDate = useMemo(() => {
    if (!formValues.admission_date) return undefined;
    const date = new Date(formValues.admission_date);
    return isNaN(date.getTime()) ? undefined : date;
  }, [formValues.admission_date]);

  const onSubmit = async (values: UpdateStudentForm) => {
    console.log("Submitting form with values:", values);
    setSubmitting(true);
    submitController.current?.abort();
    const controller = new AbortController();
    submitController.current = controller;

    const payload = {
      email: toLower(values.email),
      fullName: values.name.trim(),
      phoneNumber: cleanDigits(values.phone_no),
      gender:
        values.gender === "male"
          ? "Male"
          : values.gender === "female"
            ? "Female"
            : "Other",
      category: values.category,
      admissionDate: values.admission_date,
      addressLine: values.address.trim(),
      aadhaarNumber: cleanDigits(values.aadhar),
      fatherName: values.guardian.father_name.trim(),
      fatherMobile: cleanDigits(values.guardian.phone_no),
      motherName: values.guardian.mother_name?.trim() || "",
      parentEmail: toLower(values.guardian.email),
      documentUrls: documents.map((d) => d.url),
    };

    try {
      // DEBUG: log payload before sending
      // eslint-disable-next-line no-console
      console.debug("Updating student", { studentId, payload });

      const resp = await API.put(`/api/admin/students/${studentId}`, payload, {
        signal: controller.signal,
      });

      // DEBUG: log response and status
      // eslint-disable-next-line no-console
      console.debug("Update response", resp?.status, resp?.data);

      toast({ title: "Student updated successfully", type: "success" });
      onUpdated?.();
      handleClose();
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Update error", err);
      if ((err as any)?.code === "ERR_CANCELED") return;
      if ((err as any)?.response?.data) {
        const data = (err as any).response.data as Record<string, any>;
        // eslint-disable-next-line no-console
        console.debug("Server error body", data);
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          Object.entries(data.fieldErrors as Record<string, string>).forEach(
            ([key, message]) => {
              const path = key.replace("guardian.", "guardian.");
              form.setError(path as any, { type: "server", message });
            },
          );
        }
        toast({
          title: "Update failed",
          description:
            (data.message as string) ?? "Please fix the errors and retry",
          type: "error",
        });
      } else if (err instanceof Error) {
        toast({
          title: "Network error",
          description: err.message,
          type: "error",
        });
      } else {
        toast({ title: "Update failed", type: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const disableSave = submitting || loading;

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <div className="fixed inset-0 z-50 flex overflow-y-auto overflow-x-hidden  items-center justify-center p-4">
          <Dialog.Content asChild>
            <Card className="w-full max-w-5xl rounded-2xl p-0 shadow-xl">
              <div className="flex flex-col h-full max-h-full">
                <header className="flex items-start justify-between bg-[#0A1D4D] px-6 py-5">
                  <div className="space-y-1">
                    <Dialog.Title className="text-2xl font-bold text-white">
                      Create & Update Student
                    </Dialog.Title>
                    <p className="text-sm text-white/80">
                      Update and create new student information
                    </p>
                  </div>
                  <button
                    aria-label="Close"
                    onClick={handleClose}
                    className="text-white hover:text-white/80"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto bg-[#F5F7FB] px-6 pb-6 pt-4">
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
                      <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: 8 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="h-16 animate-pulse rounded bg-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  ) : fetchError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      <div className="font-semibold">
                        Failed to load student
                      </div>
                      <div className="mt-1">{fetchError}</div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          onClick={() => {
                            if (studentId) {
                              setLoading(true);
                              setFetchError(null);
                              fetchController.current?.abort();
                              const controller = new AbortController();
                              fetchController.current = controller;
                              API.get(`/api/admin/students/${studentId}`, {
                                signal: controller.signal,
                              })
                                .then((res) =>
                                  hydrateForm(
                                    res.data as StudentProfileResponse,
                                  ),
                                )
                                .catch((err) =>
                                  setFetchError(
                                    err?.message ?? "Failed to load",
                                  ),
                                )
                                .finally(() => setLoading(false));
                            }
                          }}
                        >
                          Retry
                        </Button>
                        <Button variant="ghost" onClick={handleClose}>
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* student_id and class_id are not submitted — display only */}
                      <section className="rounded-xl border border-[#E6ECF5] bg-white p-5 shadow-sm">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-[#0F172A]">
                            Student Information
                          </h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField>
                            <FormLabel>Student Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Search or select student..."
                                {...form.register("name")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.name
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Class (Auto-filled)</FormLabel>
                            <FormControl>
                              <Input
                                value={classDisplay}
                                disabled
                                placeholder="Class"
                                className="bg-[#F5F9FF]"
                              />
                            </FormControl>
                          </FormField>

                          {studentIdDisplay ? (
                            <FormField>
                              <FormLabel>Student ID</FormLabel>
                              <FormControl>
                                <Input
                                  value={studentIdDisplay}
                                  disabled
                                  className="bg-[#F5F9FF]"
                                />
                              </FormControl>
                            </FormField>
                          ) : null}

                          <FormField>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="student@school.edu"
                                {...form.register("email")}
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter 10-digit number"
                                {...form.register("phone_no")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.phone_no
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <Select
                                value={form.watch("gender")}
                                onValueChange={(v) =>
                                  form.setValue("gender", v as any)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                      Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.gender
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                value={form.watch("category")}
                                onValueChange={(v) =>
                                  form.setValue("category", v as any)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="General">
                                      General
                                    </SelectItem>
                                    <SelectItem value="OBC">OBC</SelectItem>
                                    <SelectItem value="SC">SC</SelectItem>
                                    <SelectItem value="ST">ST</SelectItem>
                                    <SelectItem value="EWS">EWS</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.category
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Admission Date</FormLabel>
                            <FormControl>
                              {admissionLocked ? (
                                <div className="flex items-center rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B]">
                                  <span>{form.watch("admission_date")}</span>
                                </div>
                              ) : (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      className={cn(
                                        "flex w-full items-center justify-between rounded-md border border-[#D7E3FC] px-3 py-2 text-left text-[14px]",
                                        !admissionDate && "text-slate-400",
                                      )}
                                    >
                                      {admissionDate
                                        ? format(admissionDate, "MMM dd, yyyy")
                                        : "Select date"}
                                      <CalendarIcon className="h-4 w-4 text-slate-500" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={admissionDate}
                                      onSelect={(date) => {
                                        if (!date) return;
                                        const today = new Date();
                                        if (date > today) return;
                                        form.setValue(
                                          "admission_date",
                                          format(date, "yyyy-MM-dd"),
                                        );
                                      }}
                                      disabled={(date) => date > new Date()}
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.admission_date
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField className="md:col-span-2">
                            <FormLabel>Home Address</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={3}
                                maxLength={300}
                                placeholder="Street name, Apartment, City, Postal Code"
                                {...form.register("address")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.address
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Aadhar Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="12-digit number"
                                {...form.register("aadhar")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.aadhar
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>
                        </div>
                      </section>

                      <section className="rounded-xl border border-[#E6ECF5] bg-white p-5 shadow-sm">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-[#0F172A]">
                            Parent Information
                          </h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField>
                            <FormLabel>Father's Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Full name"
                                {...form.register("guardian.father_name")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.guardian?.father_name
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Mother's Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Full name"
                                {...form.register("guardian.mother_name")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.guardian?.mother_name
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Emergency Contact Phone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Phone number"
                                {...form.register("guardian.phone_no")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.guardian?.phone_no
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField>
                            <FormLabel>Parent Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="parent@gmail.com"
                                {...form.register("guardian.email")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.guardian?.email
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>

                          <FormField className="md:col-span-2">
                            <FormLabel>
                              Parent Permanent Address (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                rows={3}
                                placeholder="Same as student address if blank"
                                {...form.register("guardian.address")}
                              />
                            </FormControl>
                            <FormMessage>
                              {
                                form.formState.errors.guardian?.address
                                  ?.message as React.ReactNode
                              }
                            </FormMessage>
                          </FormField>
                        </div>
                      </section>

                      <section className="rounded-xl border border-[#E6ECF5] bg-white p-5 shadow-sm">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-[#0F172A]">
                            Student Documents (Optional)
                          </h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <div
                              onDrop={(e) => {
                                e.preventDefault();
                                handleDocumentUpload(e.dataTransfer.files);
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#C5D6F5] bg-[#F9FBFF] px-6 py-8 text-center"
                            >
                              <Upload className="h-5 w-5 text-[#64748B]" />
                              <p className="mt-2 text-sm text-[#64748B]">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-[#94A3B8]">
                                PDF, JPG, or PNG (Max size: 5MB)
                              </p>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,image/png,image/jpeg"
                                className="mt-3 text-sm"
                                onChange={(e) =>
                                  handleDocumentUpload(e.target.files)
                                }
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2 space-y-3">
                            {documents.length === 0 &&
                            uploading.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                No documents uploaded.
                              </p>
                            ) : null}

                            {documents.map((doc) => (
                              <div
                                key={doc.url}
                                className="flex items-center justify-between rounded-md border border-[#D7E3FC] bg-white px-3 py-2"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-[#0F172A]">
                                    {doc.document_type}
                                  </span>
                                  <span className="text-xs text-[#64748B] truncate">
                                    {doc.url}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="text-[#E11D48] hover:text-red-700"
                                  onClick={() => removeDocument(doc.url)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}

                            {uploading.map((doc, idx) => (
                              <div
                                key={`${doc.name}-${idx}`}
                                className="flex items-center justify-between rounded-md border border-dashed border-[#D7E3FC] bg-slate-50 px-3 py-2 text-sm"
                              >
                                <span className="text-[#0F172A]">
                                  {doc.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {doc.status === "uploading"
                                    ? "Uploading..."
                                    : doc.error}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <div className="flex items-center justify-end gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            // DEBUG: log click and current form values
                            // eslint-disable-next-line no-console
                            console.debug(
                              "Save button clicked",
                              form.getValues(),
                            );
                            // Trigger RHF submit and log client-side validation errors
                            form.handleSubmit(onSubmit, (errs) => {
                              // eslint-disable-next-line no-console
                              console.error(
                                "Client validation errors on click:",
                                errs,
                              );
                            })();
                          }}
                          disabled={disableSave}
                        >
                          {submitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />{" "}
                              Saving...
                            </span>
                          ) : (
                            "+ Save Profile"
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </div>
              </div>
            </Card>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
