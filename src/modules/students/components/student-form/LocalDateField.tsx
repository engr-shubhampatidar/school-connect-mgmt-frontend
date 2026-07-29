"use client";

import React from "react";
import { Controller, type Control } from "react-hook-form";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { formatLocalYMD, parseLocalDate } from "@/modules/students/utils/formatters";
import type { CreateStudentValues } from "@/modules/students/schemas/createStudentSchema";

type Props = {
  control: Control<CreateStudentValues>;
  name: "admissionDate" | "date_of_birth";
};

export default function LocalDateField({ control, name }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-2">
          <FormDatePicker
            value={parseLocalDate(field.value)}
            onChange={(date: Date | undefined) => {
              if (!date) {
                field.onChange("");
              } else {
                field.onChange(formatLocalYMD(date));
              }
            }}
          />
        </div>
      )}
    />
  );
}
