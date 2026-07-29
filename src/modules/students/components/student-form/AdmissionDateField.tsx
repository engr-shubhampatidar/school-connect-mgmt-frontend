"use client";

import React, { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import type { UpdateStudentForm } from "@/modules/students/schemas/updateStudentSchema";

type Props = {
  form: UseFormReturn<UpdateStudentForm>;
  locked: boolean;
};

export default function AdmissionDateField({ form, locked }: Props) {
  const value = form.watch("admission_date");

  const admissionDate = useMemo(() => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }, [value]);

  return (
    <FormField>
      <FormLabel>Admission Date</FormLabel>
      <FormControl>
        {locked ? (
          <div className="flex items-center rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B]">
            <span>{value}</span>
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={admissionDate}
                onSelect={(date) => {
                  if (!date) return;
                  const today = new Date();
                  if (date > today) return;
                  form.setValue("admission_date", format(date, "yyyy-MM-dd"));
                }}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        )}
      </FormControl>
      <FormMessage>
        {form.formState.errors.admission_date?.message as React.ReactNode}
      </FormMessage>
    </FormField>
  );
}
