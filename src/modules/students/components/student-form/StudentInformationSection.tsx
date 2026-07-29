"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormLabel, FormMessage, FormControl } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import FormSectionCard from "./FormSectionCard";
import GenderSelectField from "./GenderSelectField";
import CategorySelectField from "./CategorySelectField";
import AdmissionDateField from "./AdmissionDateField";
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
        <FormLabel>Student Name</FormLabel>
        <FormControl>
          <Input
            placeholder="Search or select student..."
            {...form.register("name")}
          />
        </FormControl>
        <FormMessage>
          {form.formState.errors.name?.message as React.ReactNode}
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
            {...form.register("email")}
          />
        </FormControl>
        <FormMessage>
          {form.formState.errors.email?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Phone Number</FormLabel>
        <FormControl>
          <Input
            placeholder="Enter 10-digit number"
            {...form.register("phone_no")}
          />
        </FormControl>
        <FormMessage>
          {form.formState.errors.phone_no?.message as React.ReactNode}
        </FormMessage>
      </FormField>

      <GenderSelectField form={form} />

      <CategorySelectField form={form} />

      <AdmissionDateField form={form} locked={admissionLocked} />

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
          <Input placeholder="12-digit number" {...form.register("aadhar")} />
        </FormControl>
        <FormMessage>
          {form.formState.errors.aadhar?.message as React.ReactNode}
        </FormMessage>
      </FormField>
    </FormSectionCard>
  );
}
