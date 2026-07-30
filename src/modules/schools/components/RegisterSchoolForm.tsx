"use client";

import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { useToast } from "@/components/ui/use-toast";
import {
  registerSchool,
  type RegisterSchoolPayload,
} from "@/modules/schools/api/registerSchool";

const SCHOOL_TYPES = ["PRIVATE", "PUBLIC", "GOVERNMENT", "OTHER"] as const;

const defaultValues: RegisterSchoolPayload = {
  schoolName: "",
  schoolEmail: "",
  schoolPhone: "",
  schoolType: "PRIVATE",
  adminFirstName: "",
  adminLastName: "",
  adminEmail: "",
  adminPassword: "",
  adminMobile: "",
  date_of_birth: "",
};

export function RegisterSchoolForm() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<RegisterSchoolPayload>({
    defaultValues,
  });

  const onSubmit = async (values: RegisterSchoolPayload) => {
    setLoading(true);
    try {
      await registerSchool(values);
      toast({
        id: "success-registered",
        title: "Registered",
        description: "School registered successfully.",
        type: "success",
      });
      form.reset(defaultValues);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([field, message]) => {
            const key = field as keyof RegisterSchoolPayload;
            form.setError(key, {
              type: "server",
              message: String(message),
            });
          });
          toast({
            id: "error-fields",
            title: "Error",
            description: "Please fix the highlighted fields.",
            type: "error",
          });
        } else if (data?.message) {
          toast({
            id: "error-message",
            title: "Error",
            description: String(data.message),
            type: "error",
          });
        } else {
          toast({
            id: "error-network",
            title: "Network error",
            description: "Unable to reach server.",
            type: "error",
          });
        }
      } else {
        toast({
          id: "error-unknown",
          title: "Error",
          description: "An unexpected error occurred.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full flex md:items-center md:px-8">
      <div className="w-full max-w-full bg-[#FFFFFF] border border-[#D7E3FC] rounded-lg">
        <div className="h-[8px] hidden md:flex w-full bg-[#1E40AF] rounded-t-lg" />
        <div className="w-full max-w-full p-8">
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">School Information</h2>
              <p className="text-sm text-slate-600">
                Basic details about the institution you are registering.
              </p>

              <FormField>
                <FormLabel>School name</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("schoolName")}
                    placeholder="Green Valley Public School"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.schoolName?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>School email</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("schoolEmail")}
                    placeholder="contact@school.edu"
                    type="email"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.schoolEmail?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>School phone</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("schoolPhone")}
                    placeholder="+919876543210"
                    type="tel"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.schoolPhone?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>School type</FormLabel>
                <FormControl>
                  <select
                    {...form.register("schoolType")}
                    className="block w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-[14px] text-[#021034] focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  >
                    {SCHOOL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.schoolType?.message}
                </FormMessage>
              </FormField>
            </div>

            <div className="mt-8 space-y-6">
              <h2 className="text-2xl font-semibold">
                Administrator Information
              </h2>
              <p className="text-sm text-slate-600">
                Primary admin account for this school.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register("adminFirstName")}
                      placeholder="Rajesh"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.adminFirstName?.message}
                  </FormMessage>
                </FormField>

                <FormField>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register("adminLastName")}
                      placeholder="Kumar"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.adminLastName?.message}
                  </FormMessage>
                </FormField>
              </div>

              <FormField>
                <FormLabel>Admin email</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("adminEmail")}
                    placeholder="admin@school.edu"
                    type="email"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.adminEmail?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Admin mobile</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("adminMobile")}
                    placeholder="+919876543210"
                    type="tel"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.adminMobile?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("date_of_birth")}
                    type="date"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.date_of_birth?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("adminPassword")}
                    placeholder="Create a password"
                    type="password"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.adminPassword?.message}
                </FormMessage>
              </FormField>
            </div>

            <div className="mt-8">
              <Button type="submit" className="w-full" variant="dark" disabled={loading}>
                {loading ? "Registering..." : "Continue"}
              </Button>
            </div>
            <p className="text-center text-sm text-slate-400">
              By continuing, you confirm that the information provided is
              accurate to the best of your knowledge.
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterSchoolForm;
