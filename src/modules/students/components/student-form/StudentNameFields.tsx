"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { CreateStudentValues } from "@/modules/students/schemas/createStudentSchema";

type Props = {
  form: UseFormReturn<CreateStudentValues>;
};

export default function StudentNameFields({ form }: Props) {
  const { register } = form;
  const { errors } = form.formState;

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField>
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <Input
            {...register("firstName")}
            type="text"
            placeholder="First Name"
          />
        </FormControl>
        <FormMessage>{errors.firstName?.message as React.ReactNode}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Last Name</FormLabel>
        <FormControl>
          <Input
            {...register("lastName")}
            type="text"
            placeholder="Last Name"
          />
        </FormControl>
        <FormMessage>{errors.lastName?.message as React.ReactNode}</FormMessage>
      </FormField>
    </div>
  );
}
