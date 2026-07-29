"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import FormSectionCard from "./FormSectionCard";
import type { UpdateStudentForm } from "@/modules/students/schemas/updateStudentSchema";

type Props = {
  form: UseFormReturn<UpdateStudentForm>;
};

export default function GuardianInformationSection({ form }: Props) {
  const { errors } = form.formState;

  return (
    <FormSectionCard title="Parent Information">
      <FormField>
        <FormLabel>{"Father's Name"}</FormLabel>
        <FormControl>
          <Input
            placeholder="Full name"
            {...form.register("guardian.father_name")}
          />
        </FormControl>
        <FormMessage>
          {errors.guardian?.father_name?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>{"Mother's Name (Optional)"}</FormLabel>
        <FormControl>
          <Input
            placeholder="Full name"
            {...form.register("guardian.mother_name")}
          />
        </FormControl>
        <FormMessage>
          {errors.guardian?.mother_name?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Emergency Contact Phone</FormLabel>
        <FormControl>
          <Input
            placeholder="Phone number"
            {...form.register("guardian.phone_no")}
          />
        </FormControl>
        <FormMessage>
          {errors.guardian?.phone_no?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Parent Email</FormLabel>
        <FormControl>
          <Input
            placeholder="parent@gmail.com"
            {...form.register("guardian.email")}
          />
        </FormControl>
        <FormMessage>
          {errors.guardian?.email?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Parent Permanent Address (Optional)</FormLabel>
        <FormControl>
          <Textarea
            rows={3}
            placeholder="Same as student address if blank"
            {...form.register("guardian.address")}
          />
        </FormControl>
        <FormMessage>
          {errors.guardian?.address?.message as React.ReactNode}
        </FormMessage>
      </FormField>
    </FormSectionCard>
  );
}
