"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import API from "@/services/axios";
import { STUDENT_API } from "@/config/api-routes";
import type { StudentDocument, StudentProfileResponse } from "@/modules/students/types/form";
import type { UpdateStudentForm } from "@/modules/students/schemas/updateStudentSchema";

type Params = {
  open: boolean;
  studentId: string | null;
  form: UseFormReturn<UpdateStudentForm>;
  setDocuments: Dispatch<SetStateAction<StudentDocument[]>>;
};

export function useStudentProfileLoader({
  open,
  studentId,
  form,
  setDocuments,
}: Params) {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [classDisplay, setClassDisplay] = useState<string>("");
  const [admissionLocked, setAdmissionLocked] = useState(false);
  const [studentIdDisplay, setStudentIdDisplay] = useState<string>("");
  const fetchController = useRef<AbortController | null>(null);

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
      setStudentIdDisplay(data.studentId ?? "");
      // If API included a class display name use it, otherwise try to derive from object
      if (data.class_name && data.class_name.trim()) {
        setClassDisplay(data.class_name);
      } else if (data.class_id && typeof data.class_id === "object") {
        const cname =
          (data.class_id as any).name ?? (data.class_id as any).className ?? "";
        console.log(cname + "class name of student");
        setClassDisplay(cname || "");
      } else {
        setClassDisplay("");
      }
      setAdmissionLocked(locked);
    },
    [form, setDocuments],
  );

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
        const res = await API.get(STUDENT_API.BY_ID(studentId), {
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
  }, [open, studentId, hydrateForm, setDocuments]);

  const retry = useCallback(() => {
    if (!studentId) return;
    setLoading(true);
    setFetchError(null);
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;
    API.get(`/api/admin/students/${studentId}`, {
      signal: controller.signal,
    })
      .then((res) => hydrateForm(res.data as StudentProfileResponse))
      .catch((err) => setFetchError(err?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, [studentId, hydrateForm]);

  const abortFetch = useCallback(() => {
    fetchController.current?.abort();
  }, []);

  return {
    loading,
    fetchError,
    setFetchError,
    classDisplay,
    admissionLocked,
    studentIdDisplay,
    retry,
    abortFetch,
  };
}
