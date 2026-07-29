"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { CreateStudentValues } from "@/modules/students/schemas/createStudentSchema";

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
        <FormField>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <div className="flex w-full rounded-md border border-[#D7E3FC]  text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]  focus-within:ring-1 focus-within:ring-[#D7E3FC] focus-within:border-[#D7E3FC]">
              <p className="border-r border-[#D7E3FC] px-2 py-2">+91</p>
              <input
                {...register("phoneNumber")}
                className="pl-2 w-full outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                maxLength={10}
                type="text"
                placeholder="9876543210"
              />
            </div>
          </FormControl>
          <FormMessage>
            {errors.phoneNumber?.message as React.ReactNode}
          </FormMessage>
        </FormField>
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
