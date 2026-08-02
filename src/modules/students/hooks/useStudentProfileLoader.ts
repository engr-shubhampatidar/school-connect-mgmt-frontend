"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import API from "@/services/axios";
import { STUDENT_API } from "@/config/api-routes";
import type { StudentProfileResponse } from "@/modules/students/types/form";
import type { UpdateStudentForm } from "@/modules/students/schemas/updateStudentSchema";
import {
  cleanDigits,
  normalizeGenderForForm,
  normalizeMobileForForm,
  splitFullName,
} from "@/modules/students/utils/formatters";

type Params = {
  open: boolean;
  studentId: string | null;
  form: UseFormReturn<UpdateStudentForm>;
};

function pickClassId(data: StudentProfileResponse): string {
  if (typeof data.classId === "string" && data.classId) return data.classId;
  if (typeof data.class_id === "string" && data.class_id) return data.class_id;
  if (data.class_id && typeof data.class_id === "object") {
    return (
      data.class_id.id ??
      (data.class_id as { classId?: string }).classId ??
      ""
    );
  }
  return "";
}

function pickClassName(data: StudentProfileResponse): string {
  if (data.className?.trim()) return data.className;
  if (data.class_name?.trim()) return data.class_name;
  if (data.class_id && typeof data.class_id === "object") {
    return data.class_id.name ?? data.class_id.className ?? "";
  }
  return "";
}

export function useStudentProfileLoader({ open, studentId, form }: Params) {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [classDisplay, setClassDisplay] = useState<string>("");
  const [admissionLocked, setAdmissionLocked] = useState(false);
  const [studentIdDisplay, setStudentIdDisplay] = useState<string>("");
  const fetchController = useRef<AbortController | null>(null);

  const hydrateForm = useCallback(
    (data: StudentProfileResponse) => {
      const rawAdmission =
        data.admissionDate ?? data.admission_date ?? null;
      const admissionDate = rawAdmission
        ? String(rawAdmission).split("T")[0]
        : "";
      const locked = Boolean(rawAdmission);
      const { firstName, lastName } = splitFullName(data.name ?? "");
      const classIdValue = pickClassId(data);
      const classNameValue = pickClassName(data);

      form.reset({
        firstName,
        lastName,
        email: data.email ?? "",
        phone_no: normalizeMobileForForm(data.phoneNo ?? data.phone_no),
        gender: normalizeGenderForForm(data.gender),
        category: data.category ?? "",
        admission_date: admissionDate,
        classId: classIdValue,
        address: data.address ?? "",
        aadhar: cleanDigits(
          data.aadhaarNumber ?? data.aadhar ?? "",
        ).slice(0, 12),
        father_name: data.fatherName ?? data.guardian?.father_name ?? "",
        father_mobile: normalizeMobileForForm(
          data.fatherMobile ?? data.guardian?.phone_no,
        ),
        mother_name: data.motherName ?? data.guardian?.mother_name ?? "",
        mother_mobile: normalizeMobileForForm(data.motherMobile),
        guardian_name: data.guardianName ?? "",
        guardian_mobile: normalizeMobileForForm(data.guardianMobile),
        bloodGroup: data.bloodGroup ?? "",
        medicalNotes: data.medicalNotes ?? "",
        class_name: classNameValue,
        admission_locked: locked,
      });

      setStudentIdDisplay(data.studentId ?? "");
      setClassDisplay(classNameValue);
      setAdmissionLocked(locked);
    },
    [form],
  );

  useEffect(() => {
    if (!open || !studentId) return;
    setLoading(true);
    setFetchError(null);
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
        if ((err as { code?: string })?.code === "ERR_CANCELED") return;
        const message =
          err instanceof Error ? err.message : "Failed to load student";
        setFetchError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, studentId, hydrateForm]);

  const retry = useCallback(() => {
    if (!studentId) return;
    setLoading(true);
    setFetchError(null);
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;
    API.get(STUDENT_API.BY_ID(studentId), {
      signal: controller.signal,
    })
      .then((res) => hydrateForm(res.data as StudentProfileResponse))
      .catch((err: { message?: string }) =>
        setFetchError(err?.message ?? "Failed to load"),
      )
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
