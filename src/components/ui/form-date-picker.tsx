"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { FormField } from "@/components/ui/Form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function FormDatePicker({
  value,
  onChange,
  disabled,
  placeholder = "mm/dd/yyyy",
}: FormDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="inputType"
            disabled={disabled}
            id="date"
            className="justify-start font-normal border border-[#D7E3FC] w-full"
          >
            {value ? value.toLocaleDateString() : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
}
