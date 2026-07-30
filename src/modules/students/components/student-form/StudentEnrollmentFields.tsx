"use client";

import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import Select from "@/components/ui/Select";
import type { ClassItem } from "@/modules/classes";
import LocalDateField from "./LocalDateField";
import {
  GENDER_OPTIONS,
  type CreateStudentValues,
} from "@/modules/students/schemas/createStudentSchema";

type Props = {
  form: UseFormReturn<CreateStudentValues>;
  classes: ClassItem[];
};

export default function StudentEnrollmentFields({ form, classes }: Props) {
  const { control } = form;
  const { errors } = form.formState;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField>
          <FormLabel>Class Name</FormLabel>
          <FormControl>
            <Controller
              control={control}
              name="classId"
              render={({ field }) => (
                <Select
                  options={classes.map((c) => ({
                    id: c.id,
                    name: `${c.name}-${c.section}`,
                  }))}
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Select"
                />
              )}
            />
          </FormControl>
          <FormMessage>{errors.classId?.message as React.ReactNode}</FormMessage>
        </FormField>
        <FormField>
          <FormLabel>Admission Date</FormLabel>
          <LocalDateField control={control} name="admissionDate" />
          <FormMessage>
            {errors.admissionDate?.message as React.ReactNode}
          </FormMessage>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField>
          <FormLabel>Date of Birth</FormLabel>
          <LocalDateField control={control} name="date_of_birth" />
          <FormMessage>
            {errors.date_of_birth?.message as React.ReactNode}
          </FormMessage>
        </FormField>
        <FormField>
          <FormLabel>Gender</FormLabel>
          <FormControl>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  options={[...GENDER_OPTIONS]}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select"
                />
              )}
            />
          </FormControl>
          <FormMessage>{errors.gender?.message as React.ReactNode}</FormMessage>
        </FormField>
      </div>
    </>
  );
}
