"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  useForm,
  type FieldErrors,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";
import { useToast } from "@/components/ui/use-toast";
// classes are provided by parent; do not call API here
import type { ClassItem } from "@/modules/classes";
import {
  createStudent,
} from "@/modules/students/api/adminStudents";
import StudentContactFields from "./student-form/StudentContactFields";
import StudentCredentialsModal from "./student-form/StudentCredentialsModal";
import StudentEnrollmentFields from "./student-form/StudentEnrollmentFields";
import StudentNameFields from "./student-form/StudentNameFields";
import {
  createStudentSchema,
  type CreateStudentValues,
} from "@/modules/students/schemas/createStudentSchema";
import { cleanDigits } from "@/modules/students/utils/formatters";

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

  const { handleSubmit, setError, reset } = form;

  const onSubmit: SubmitHandler<CreateStudentValues> = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const data = await createStudent({
          firstName: values.firstName,
          lastName: values.lastName,
          classId: values.classId,
          email: values.email ?? undefined,
          phoneNumber: cleanDigits(values.phoneNumber ?? "") || undefined,
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
        const responseData = data as
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

        const studentId = responseData?.studentId ?? null;
        const pw = responseData?.temporaryPassword ?? null;

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
                      <StudentNameFields form={form} />
                      <StudentEnrollmentFields form={form} classes={classes} />
                    </div>
                    <StudentContactFields form={form} />
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
        <StudentCredentialsModal
          rollNo={tempRollNo}
          password={tempPassword}
          onDismiss={() => {
            setTempPassword(null);
            setTempRollNo(null);
            onClose();
          }}
        />
      ) : null}
    </div>
  );
}
