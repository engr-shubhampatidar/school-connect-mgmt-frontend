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

export default function CategorySelectField({ form }: Props) {
  return (
    <FormField>
      <FormLabel>Category</FormLabel>
      <FormControl>
        <Select
          value={form.watch("category")}
          onValueChange={(v) => form.setValue("category", v as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="OBC">OBC</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="ST">ST</SelectItem>
              <SelectItem value="EWS">EWS</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage>
        {form.formState.errors.category?.message as React.ReactNode}
      </FormMessage>
    </FormField>
  );
}
