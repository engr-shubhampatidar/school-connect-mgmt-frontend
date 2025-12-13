"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../lib/api";
import { toast, Toaster } from "sonner";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/;

const RegisterSchema = z.object({
  name: z.string().min(2, "School name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => passwordRegex.test(val), {
      message: "Password must include upper, lower, number and symbol",
    }),
  address: z.string().optional(),
  contact: z.string().optional(),
  logoUrl: z.string().url("Invalid URL").optional(),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

export default function RegisterSchoolPage() {
  const form = useForm<RegisterForm>({ resolver: zodResolver(RegisterSchema) });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: RegisterForm) {
    try {
      await api.post("/api/public/register-school", values);
      toast.success("School registered successfully");
      reset();
    } catch (err: unknown) {
      const maybe = err as { response?: { data?: unknown } };
      const respData = maybe.response?.data;

      if (respData && typeof respData === "object" && respData !== null) {
        const data = respData as {
          errors?: Record<string, string>;
          message?: string;
        };

        if (data.errors) {
          Object.keys(data.errors).forEach((key) => {
            setError(key as keyof RegisterForm, {
              type: "server",
              message: data.errors![key],
            });
          });
        }

        if (data.message) {
          toast.error(data.message);
        }
      } else {
        toast.error("Network error, please try again");
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <Toaster position="top-right" />
      <div className="container-center w-full max-w-2xl">
        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-2 text-[color:var(--color-primary)]">
            Register Your School
          </h1>
          <p className="text-sm muted mb-6">
            Create an account to manage your school on the platform.
          </p>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">School Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Acme High School"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error ? (
                      <FormMessage>
                        {(fieldState.error as { message?: string })?.message ??
                          String(fieldState.error)}
                      </FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@school.edu"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error ? (
                      <FormMessage>
                        {(fieldState.error as { message?: string })?.message ??
                          String(fieldState.error)}
                      </FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Strong password"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error ? (
                      <FormMessage>
                        {(fieldState.error as { message?: string })?.message ??
                          String(fieldState.error)}
                      </FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />

              <FormField
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <FormControl>
                      <Input
                        id="address"
                        placeholder="123 Main St, City"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error ? (
                      <FormMessage>
                        {(fieldState.error as { message?: string })?.message ??
                          String(fieldState.error)}
                      </FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />

              <FormField
                name="contact"
                control={control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="contact">Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        id="contact"
                        placeholder="(123) 456-7890"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error ? (
                      <FormMessage>
                        {(fieldState.error as { message?: string })?.message ??
                          String(fieldState.error)}
                      </FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />

              <FormField
                name="logoUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="logoUrl">Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        id="logoUrl"
                        placeholder="https://.../logo.png"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error ? (
                      <FormMessage>
                        {(fieldState.error as { message?: string })?.message ??
                          String(fieldState.error)}
                      </FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />

              <div className="mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register School"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
