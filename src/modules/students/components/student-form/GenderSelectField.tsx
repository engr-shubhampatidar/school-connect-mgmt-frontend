"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { UpdateStudentForm } from "@/modules/students/schemas/updateStudentSchema";

type Props = {
  form: UseFormReturn<UpdateStudentForm>;
};

export default function GenderSelectField({ form }: Props) {
  return (
    <FormField>
      <FormLabel>Gender</FormLabel>
      <FormControl>
        <Select
          value={form.watch("gender")}
          onValueChange={(v) => form.setValue("gender", v as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage>
        {form.formState.errors.gender?.message as React.ReactNode}
      </FormMessage>
    </FormField>
  );
}
