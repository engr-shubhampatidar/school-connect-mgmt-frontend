"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { CreateStudentValues } from "@/modules/students/schemas/createStudentSchema";
import MobileInputField from "./MobileInputField";

type Props = {
  form: UseFormReturn<CreateStudentValues>;
};

export default function StudentContactFields({ form }: Props) {
  const { register } = form;
  const { errors } = form.formState;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField>
          <FormLabel>Email Address </FormLabel>
          <FormControl>
            <Input
              {...register("email")}
              type="text"
              placeholder="john@example.com"
            />
          </FormControl>
          <FormMessage>{errors.email?.message as React.ReactNode}</FormMessage>
        </FormField>
        <MobileInputField
          control={form.control}
          name="phoneNumber"
          label="Phone Number"
          error={errors.phoneNumber?.message}
        />
      </div>
      <FormField>
        <FormLabel>Profile URL (Optional)</FormLabel>
        <FormControl>
          <Input
            {...register("profileUrl")}
            type="text"
            placeholder="https://linkedin.com/in/student-name"
          />
        </FormControl>
        <FormMessage>
          {errors.profileUrl?.message as React.ReactNode}
        </FormMessage>
      </FormField>
    </div>
  );
}
