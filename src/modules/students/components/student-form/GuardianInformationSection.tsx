"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import FormSectionCard from "./FormSectionCard";
import MobileInputField from "./MobileInputField";
import type { UpdateStudentForm } from "@/modules/students/schemas/updateStudentSchema";

type Props = {
  form: UseFormReturn<UpdateStudentForm>;
};

export default function GuardianInformationSection({ form }: Props) {
  const { errors } = form.formState;

  return (
    <FormSectionCard title="Parent / Guardian Information">
      <FormField>
        <FormLabel>{"Father's Name"}</FormLabel>
        <FormControl>
          <Input
            placeholder="Full name"
            {...form.register("father_name")}
          />
        </FormControl>
        <FormMessage>
          {errors.father_name?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <MobileInputField
        control={form.control}
        name="father_mobile"
        label="Father's Mobile"
        error={errors.father_mobile?.message}
      />

      <FormField>
        <FormLabel>{"Mother's Name"}</FormLabel>
        <FormControl>
          <Input
            placeholder="Full name"
            {...form.register("mother_name")}
          />
        </FormControl>
        <FormMessage>
          {errors.mother_name?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <MobileInputField
        control={form.control}
        name="mother_mobile"
        label="Mother's Mobile"
        error={errors.mother_mobile?.message}
      />

      <FormField>
        <FormLabel>Guardian Name</FormLabel>
        <FormControl>
          <Input
            placeholder="Full name"
            {...form.register("guardian_name")}
          />
        </FormControl>
        <FormMessage>
          {errors.guardian_name?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <MobileInputField
        control={form.control}
        name="guardian_mobile"
        label="Guardian Mobile"
        error={errors.guardian_mobile?.message}
      />
    </FormSectionCard>
  );
}
