"use client";

import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import FormSectionCard from "./FormSectionCard";
import GenderSelectField from "./GenderSelectField";
import AdmissionDateField from "./AdmissionDateField";
import MobileInputField from "./MobileInputField";
import {
  cleanDigits,
  formatAadharDisplay,
} from "@/modules/students/utils/formatters";
import type { UpdateStudentForm } from "@/modules/students/schemas/updateStudentSchema";

type Props = {
  form: UseFormReturn<UpdateStudentForm>;
  classDisplay: string;
  studentIdDisplay: string;
  admissionLocked: boolean;
};

export default function StudentInformationSection({
  form,
  classDisplay,
  studentIdDisplay,
  admissionLocked,
}: Props) {
  return (
    <FormSectionCard title="Student Information">
      <FormField>
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <Input placeholder="First name" {...form.register("firstName")} />
        </FormControl>
        <FormMessage>
          {form.formState.errors.firstName?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Last Name</FormLabel>
        <FormControl>
          <Input placeholder="Last name" {...form.register("lastName")} />
        </FormControl>
        <FormMessage>
          {form.formState.errors.lastName?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Class (Auto-filled)</FormLabel>
        <FormControl>
          <Input
            value={classDisplay}
            disabled
            placeholder="Class"
            className="bg-[#F5F9FF]"
          />
        </FormControl>
      </FormField>

      {studentIdDisplay ? (
        <FormField>
          <FormLabel>Student ID</FormLabel>
          <FormControl>
            <Input
              value={studentIdDisplay}
              disabled
              className="bg-[#F5F9FF]"
            />
          </FormControl>
        </FormField>
      ) : null}

      <FormField>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            placeholder="student@school.edu"
            disabled
            className="bg-[#F5F9FF]"
            {...form.register("email")}
          />
        </FormControl>
        <FormMessage>
          {form.formState.errors.email?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <MobileInputField
        control={form.control}
        name="phone_no"
        label="Phone Number"
        error={form.formState.errors.phone_no?.message}
      />

      <GenderSelectField form={form} />

      <AdmissionDateField form={form} locked={admissionLocked} />

      <FormField>
        <FormLabel>Blood Group</FormLabel>
        <FormControl>
          <Input placeholder="e.g. O+" {...form.register("bloodGroup")} />
        </FormControl>
        <FormMessage>
          {form.formState.errors.bloodGroup?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Home Address</FormLabel>
        <FormControl>
          <Textarea
            rows={3}
            maxLength={300}
            placeholder="Street name, Apartment, City, Postal Code"
            {...form.register("address")}
          />
        </FormControl>
        <FormMessage>
          {form.formState.errors.address?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Aadhar Number</FormLabel>
        <FormControl>
          <Controller
            control={form.control}
            name="aadhar"
            render={({ field }) => (
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={14}
                value={formatAadharDisplay(field.value ?? "")}
                onChange={(e) =>
                  field.onChange(cleanDigits(e.target.value).slice(0, 12))
                }
                onBlur={field.onBlur}
                placeholder="1234 5678 9012"
              />
            )}
          />
        </FormControl>
        <FormMessage>
          {form.formState.errors.aadhar?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <div className="md:col-span-2">
        <FormField>
          <FormLabel>Medical Notes</FormLabel>
          <FormControl>
            <Textarea
              rows={3}
              maxLength={500}
              placeholder="Any medical notes or allergies"
              {...form.register("medicalNotes")}
            />
          </FormControl>
          <FormMessage>
            {form.formState.errors.medicalNotes?.message as React.ReactNode}
          </FormMessage>
        </FormField>
      </div>
    </FormSectionCard>
  );
}
