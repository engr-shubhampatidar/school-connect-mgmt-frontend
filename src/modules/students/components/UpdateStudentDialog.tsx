"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { updateStudent } from "@/modules/students/api/adminStudents";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import GuardianInformationSection from "./student-form/GuardianInformationSection";
import { StudentDocumentsSection } from "@/modules/documents";
import StudentInformationSection from "./student-form/StudentInformationSection";
import StudentLoadError from "./student-form/StudentLoadError";
import UpdateStudentSkeleton from "./student-form/UpdateStudentSkeleton";
import { cleanDigits, toLower } from "@/modules/students/utils/formatters";
import { useStudentDocuments } from "@/modules/documents";
import { useStudentProfileLoader } from "@/modules/students/hooks/useStudentProfileLoader";
import {
  updateStudentDefaultValues,
  type UpdateStudentForm,
} from "@/modules/students/schemas/updateStudentSchema";

export type { UpdateStudentForm };

type Props = {
  open: boolean;
  studentId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
};

export default function UpdateStudentDialog({
  open,
  studentId,
  onClose,
  onUpdated,
}: Props) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const submitController = useRef<AbortController | null>(null);

  const form = useForm<UpdateStudentForm>({
    // resolver: zodResolver(updateStudentSchema),
    defaultValues: updateStudentDefaultValues,
  });

  const {
    documents,
    setDocuments,
    uploading,
    handleDocumentUpload,
    removeDocument,
    resetDocuments,
  } = useStudentDocuments();

  const {
    loading,
    fetchError,
    setFetchError,
    classDisplay,
    admissionLocked,
    studentIdDisplay,
    retry,
    abortFetch,
  } = useStudentProfileLoader({ open, studentId, form, setDocuments });

  const handleClose = () => {
    abortFetch();
    submitController.current?.abort();
    form.reset();
    resetDocuments();
    setFetchError(null);
    onClose();
  };

  useEffect(() => {
    form.setValue("student_documents", documents);
  }, [documents, form]);

  const onSubmit = async (values: UpdateStudentForm) => {
    if (!studentId) return;
    console.log("Submitting form with values:", values);
    setSubmitting(true);
    submitController.current?.abort();
    const controller = new AbortController();
    submitController.current = controller;

    const payload = {
      email: toLower(values.email),
      fullName: values.name.trim(),
      phoneNumber: cleanDigits(values.phone_no),
      gender: values.gender,
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

      await updateStudent(studentId, payload, {
        signal: controller.signal,
      });

      // DEBUG: log response and status
      // eslint-disable-next-line no-console
      console.debug("Update response", "ok");

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
        <div className="relative w-[777px] rounded-xl max-h-[90vh] overflow-hidden overflow-y-auto no-scrollbar">
          <div className="rounded-lg ">
            <div className=" min-h-full  rounded-lg  bg-white shadow-lg">
              <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white">
                    Create & Update Student
                  </h1>
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
              </div>
              <div className="flex-1 overflow-y-auto overflow-hidden bg-[#F5F7FB] px-6 pb-6 pt-4 rounded-lg">
                {loading ? (
                  <UpdateStudentSkeleton />
                ) : fetchError ? (
                  <StudentLoadError
                    message={fetchError}
                    onRetry={retry}
                    onClose={handleClose}
                  />
                ) : (
                  <div>
                    <Form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* student_id and class_id are not submitted — display only */}
                      <StudentInformationSection
                        form={form}
                        classDisplay={classDisplay}
                        studentIdDisplay={studentIdDisplay}
                        admissionLocked={admissionLocked}
                      />

                      <GuardianInformationSection form={form} />

                      <StudentDocumentsSection
                        documents={documents}
                        uploading={uploading}
                        onUpload={handleDocumentUpload}
                        onRemove={removeDocument}
                      />
                    </Form>
                  </div>
                )}
              </div>
              <div className="flex  items-center justify-end gap-3 sticky bottom-0 bg-white p-4 rounded-b-lg">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  onClick={() => {
                    // DEBUG: log click and current form values
                    // eslint-disable-next-line no-console
                    console.debug("Save button clicked", form.getValues());
                    // Trigger RHF submit and log client-side validation errors
                    form.handleSubmit(onSubmit, (errs) => {
                      // eslint-disable-next-line no-console
                      console.error("Client validation errors on click:", errs);
                    })();
                  }}
                  disabled={disableSave}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
