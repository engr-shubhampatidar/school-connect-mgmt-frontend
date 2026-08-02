"use client";

import React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import {
  cleanDigits,
  formatMobileDisplay,
} from "@/modules/students/utils/formatters";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  error?: string;
};

/** +91 prefix with 10 digits shown as "XXXXX XXXXX". */
export default function MobileInputField<T extends FieldValues>({
  control,
  name,
  label,
  error,
}: Props<T>) {
  return (
    <FormField>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <div className="flex w-full rounded-md border border-[#D7E3FC] text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280] focus-within:ring-1 focus-within:ring-[#D7E3FC] focus-within:border-[#D7E3FC]">
              <p className="border-r border-[#D7E3FC] px-2 py-2">+91</p>
              <input
                className="pl-2 w-full outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-transparent"
                type="text"
                inputMode="numeric"
                maxLength={11}
                placeholder="98765 43210"
                value={formatMobileDisplay(String(field.value ?? ""))}
                onChange={(e) =>
                  field.onChange(cleanDigits(e.target.value).slice(0, 10))
                }
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </div>
          )}
        />
      </FormControl>
      <FormMessage>{error as React.ReactNode}</FormMessage>
    </FormField>
  );
}
