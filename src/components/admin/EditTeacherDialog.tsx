"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import {
  fetchTeacherById,
  updateTeacher,
  fetchSubjects,
} from "@/services/teacher.service";
import { FormField, FormLabel, FormControl } from "@/components/ui/Form";
import Textarea from "@/components/ui/Textarea";
import { Card } from "../ui";
import { Upload, ChevronDown, Calendar } from "lucide-react";
import MultiSelect from "@/components/ui/MultiSelect";
import { Subject } from "@/schemas/teacher.schema";
import { Controller, useForm } from "react-hook-form";

type Props = {
  open: boolean;
  teacherId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
};

export default function EditTeacherDialog({
  open,
  teacherId,
  onClose,
  onUpdated,
}: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const form = useForm({
    defaultValues: {
      subjects: [] as string[],
    },
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    date_of_birth: "",
    aadhar: "",
    employee_id: "",
    subject_speciality: [] as string[],
    mobile: "",
    address: "",
  });

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
  const { control } = form;
  // -----------------------------
  // Fetch teacher when modal opens
  // -----------------------------
  useEffect(() => {
    if (!open || !teacherId) return;

    const loadTeacher = async () => {
      try {
        setFetching(true);
        const data = await fetchTeacherById(teacherId);

        setFormData({
          fullName: data.fullName,
          email: data.email,
          gender: data.gender,
          date_of_birth: data.date_of_birth ?? "",
          aadhar: data.aadhar,
          employee_id: data.employee_id,
          subject_speciality: data.subject_speciality,
          mobile: data.mobile,
          address: data.address,
        });
        form.setValue("subjects", data.subject_speciality);
      } catch (error) {
        console.error("Failed to fetch teacher", error);
      } finally {
        setFetching(false);
      }
    };

    loadTeacher();
  }, [open, teacherId]);

  // -----------------------------
  // Handle Update
  // -----------------------------
  const handleUpdate = async () => {
    if (!teacherId) return;

    try {
      setLoading(true);
      const values = form.getValues();
      await updateTeacher(teacherId, {
        mobile: formData.mobile,
        address: formData.address,
        subject_speciality: values.subjects,
      });

      onUpdated?.();
      onClose();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };
  const renderSubjectMulti = useCallback(
    () => (
      <Controller
        control={control}
        name="subjects"
        render={({ field }) => (
          <MultiSelect
            options={subjectOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder={
              subjectsLoading ? "Loading subjects..." : "Select subjects"
            }
          />
        )}
      />
    ),
    [control, subjectOptions, subjectsLoading],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-[777px] p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
          <div className="rounded-lg">
            <div className=" min-h-full">
              <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    Edit Teacher
                  </h3>
                  <p className="text-[14px] font-[400] text-white">
                    Update the {"teacher's"} profile information and academic
                    details.
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
                <div className="mt-4 space-y-[24px] overflow-hidden no-scrollbar max-h-[600px] overflow-y-auto">
                  {fetching ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      {/* Read Only Fields */}
                      <Card>
                        <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
                          Personal Information
                        </h1>
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField>
                              <FormLabel>Teacher Name</FormLabel>
                              <FormControl>
                                <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                                  {formData.fullName}
                                </div>
                              </FormControl>
                            </FormField>
                            <FormField>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                                  {formData.email}
                                </div>
                              </FormControl>
                            </FormField>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField>
                              <FormLabel>Mobile</FormLabel>
                              <FormControl>
                                <Input
                                  value={formData.mobile}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      mobile: e.target.value,
                                    })
                                  }
                                />
                              </FormControl>
                            </FormField>
                          </div>
                          <FormField>
                            <FormLabel>Permanent Address</FormLabel>
                            <FormControl>
                              <Textarea
                                value={formData.address}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: e.target.value,
                                  })
                                }
                                placeholder="Enter complete residential address..."
                              />
                            </FormControl>
                          </FormField>
                        </div>
                      </Card>
                      <Card>
                        <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
                          Administrative & Identity (View Only)
                        </h1>
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                                  <p>{formData.gender}</p>
                                  <div className="flex items-center">
                                    <ChevronDown className="h-4 w-4" />
                                  </div>
                                </div>
                              </FormControl>
                            </FormField>
                            <FormField>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                 <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                                  <p>{formData.date_of_birth}</p>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4" />
                                  </div>
                                </div>
                              </FormControl>
                            </FormField>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField>
                              <FormLabel>Aadhar Number</FormLabel>
                              <FormControl>
                                <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                                  {formData.aadhar}
                                </div>
                              </FormControl>
                            </FormField>
                            <FormField>
                              <FormLabel>EmployeeID</FormLabel>
                              <FormControl>
                                <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                                  {formData.employee_id}
                                </div>
                              </FormControl>
                            </FormField>
                          </div>
                          <div className="w-full mx-auto">
                            <div className="flex flex-col items-center justify-center border border-dashed border-[#D7E3FC] rounded-[8px] p-4 text-center">
                              <Upload className="h-4 w-4 text-[#64748B] mb-[8px]" />
                              <p className="text-[#64748B] text-[14px] font-medium font-[500]">
                                Drag & Drop To Upload
                              </p>

                              <p className="text-[#64748B] text-[12px] mt-2 font-[400]">
                                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max
                                20MB)
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                      <Card>
                        <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
                          Academic Information
                        </h1>
                        <FormField>
                          <FormLabel>
                            Subject Speciality{" "}
                            <span className="text-[14px] text-[#646487] font-[500]">
                              {"(Optional)"}
                            </span>
                          </FormLabel>
                          <div>{renderSubjectMulti()}</div>
                        </FormField>
                        <p className="text-[12px] text-[#64748B] font-[400] mt-[8px]">
                          Select multiple subjects this teacher is qualified to
                          teach.
                        </p>
                      </Card>
                    </>
                  )}
                </div>
                <div className="mt-6 flex sticky bottom-0 justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="dark"
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "+ Update Teacher"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
