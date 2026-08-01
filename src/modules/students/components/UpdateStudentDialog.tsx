"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { updateStudent } from "@/modules/students/api/adminStudents";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import GuardianInformationSection from "./student-form/GuardianInformationSection";
import {
  EntityDocumentsSection,
  STUDENT_DOCUMENT_TYPES,
  useEntityDocuments,
} from "@/modules/documents";
import StudentInformationSection from "./student-form/StudentInformationSection";
import StudentLoadError from "./student-form/StudentLoadError";
import UpdateStudentSkeleton from "./student-form/UpdateStudentSkeleton";
import { cleanDigits, formatGenderForApi } from "@/modules/students/utils/formatters";
import { useStudentProfileLoader } from "@/modules/students/hooks/useStudentProfileLoader";
import type { UpdateStudentPayload } from "@/modules/students/api/adminStudents";
import {
  updateStudentDefaultValues,
  updateStudentSchema,
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
    resolver: zodResolver(updateStudentSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: updateStudentDefaultValues,
  });

  const {
    documents,
    uploading,
    deletingIds,
    loading: documentsLoading,
    selectedDocumentType,
    setSelectedDocumentType,
    handleDocumentUpload,
    handleDocumentDelete,
    getLabelForType,
  } = useEntityDocuments({
    entityType: "STUDENT",
    entityId: open && studentId ? studentId : "",
    documentTypes: STUDENT_DOCUMENT_TYPES,
  });

  const {
    loading,
    fetchError,
    setFetchError,
    classDisplay,
    admissionLocked,
    studentIdDisplay,
    retry,
    abortFetch,
  } = useStudentProfileLoader({ open, studentId, form });

  const handleClose = () => {
    abortFetch();
    submitController.current?.abort();
    form.reset();
    setFetchError(null);
    onClose();
  };

  const onSubmit = async (values: UpdateStudentForm) => {
    if (!studentId) return;
    setSubmitting(true);
    submitController.current?.abort();
    const controller = new AbortController();
    submitController.current = controller;

    const payload: UpdateStudentPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneNumber: cleanDigits(values.phone_no ?? "") || undefined,
      gender: formatGenderForApi(values.gender),
      admissionDate: values.admission_date || undefined,
      classId: values.classId?.trim() || undefined,
      addressLine: values.address?.trim() || undefined,
      aadhaarNumber: cleanDigits(values.aadhar ?? "") || undefined,
      fatherName: values.father_name?.trim() || undefined,
      fatherMobile: cleanDigits(values.father_mobile ?? "") || undefined,
      motherName: values.mother_name?.trim() || undefined,
      motherMobile: cleanDigits(values.mother_mobile ?? "") || undefined,
      guardianName: values.guardian_name?.trim() || undefined,
      guardianMobile: cleanDigits(values.guardian_mobile ?? "") || undefined,
      bloodGroup: values.bloodGroup?.trim() || undefined,
      medicalNotes: values.medicalNotes?.trim() || undefined,
    };

    try {
      await updateStudent(studentId, payload, {
        signal: controller.signal,
      });

      toast({ title: "Student updated successfully", type: "success" });
      onUpdated?.();
      handleClose();
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_CANCELED") return;
      const axiosErr = err as {
        response?: { data?: Record<string, unknown> };
        message?: string;
      };
      if (axiosErr?.response?.data) {
        const data = axiosErr.response.data;
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          Object.entries(data.fieldErrors as Record<string, string>).forEach(
            ([key, message]) => {
              form.setError(key as keyof UpdateStudentForm, {
                type: "server",
                message,
              });
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
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
        <div className="relative w-[777px] rounded-xl max-h-[90vh] overflow-hidden overflow-y-auto no-scrollbar">
          <div className="rounded-lg ">
            <div className=" min-h-full  rounded-lg  bg-white shadow-lg">
              <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white">
                    Update Student
                  </h1>
                  <p className="text-sm text-white/80">
                    Update student information and documents
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
                      <StudentInformationSection
                        form={form}
                        classDisplay={classDisplay}
                        studentIdDisplay={studentIdDisplay}
                        admissionLocked={admissionLocked}
                      />

                      <GuardianInformationSection form={form} />
                    </Form>

                    {studentId ? (
                      <div className="mt-6">
                        <EntityDocumentsSection
                          title="Student Documents"
                          documentTypes={STUDENT_DOCUMENT_TYPES}
                          selectedDocumentType={selectedDocumentType}
                          onDocumentTypeChange={setSelectedDocumentType}
                          documents={documents}
                          uploading={uploading}
                          deletingIds={deletingIds}
                          loading={documentsLoading}
                          onUpload={handleDocumentUpload}
                          onDelete={handleDocumentDelete}
                          getLabelForType={getLabelForType}
                        />
                      </div>
                    ) : null}
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
                    form.handleSubmit(onSubmit, (errs) => {
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
