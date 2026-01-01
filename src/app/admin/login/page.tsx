"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import API from "../../../lib/axios";
import { setToken, setUser } from "../../../lib/auth";
import { ADMIN_API } from "../../../lib/api-routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminLoginSchema,
  type AdminLoginSchema,
} from "../../../lib/validators/adminAuth";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import Form, {
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "../../../components/ui/Form";
import { useToast } from "../../../components/ui/use-toast";
import Image from "next/image";

export default function AdminLoginPage() {
  // Additional context for the import statement
  // This import is used for validating admin login credentials

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: AdminLoginSchema) => {
    try {
      const res = await API.post(ADMIN_API.LOGIN, values);

      const { accessToken, refreshToken, user: respUser } = res.data ?? {};

      // store access token if provided
      if (accessToken) {
        setToken("admin", accessToken);

        // persist user exactly as returned (use provided keys)
        if (respUser) {
          const userToStore = {
            id: respUser.id,
            name: respUser.fullName ?? respUser.name,
            email: respUser.email,
            role: respUser.role,
            school: respUser.school ?? null,
          };
          setUser("admin", userToStore);
        }
      }

      toast({
        title: "Logged in",
        description: "Redirecting to dashboard.",
        type: "success",
      });
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      // Map axios errors
      if (axios.isAxiosError(err)) {
        const resp = err.response?.data;
        // If backend returns field errors
        if (resp && typeof resp === "object") {
          if (resp.errors && typeof resp.errors === "object") {
            Object.entries(resp.errors).forEach(([key, value]) => {
              form.setError(key as keyof AdminLoginSchema, {
                type: "server",
                message: String(value),
              });
            });
            toast({
              title: "Validation error",
              description: "Please fix the form errors.",
              type: "error",
            });
            return;
          }

          // Generic message
          const message = resp.message || resp.error || JSON.stringify(resp);
          toast({
            title: "Login failed",
            description: String(message),
            type: "error",
          });
          return;
        }
      }

      // Fallback
      toast({
        title: "Network error",
        description: "Unable to reach server. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex  p-4">
      <div className="absolute w-1/2  lg:flex items-start justify-start hidden   flex-col pl-20 pt-20">
        <div className="w-full flex items-center mb-92">
          <h1 className="font-bold text-2xl text-white max-w-[100px]">
            MAXUSE INSTITUTE
          </h1>
        </div>
        <div className="flex flex-col text-white">
          <h1 className="text-white text-[48px] max-w-[458px] font-[600] leading-[56px] mb-4">
            One Platform. Total Control. ✨
          </h1>
          <p>
            Manage academics, staff, and operations from one powerful dashboard.
          </p>
        </div>

        <div className="flex items-center w-full bottom-0 mt-44 ">
          <p className="text-white pl-60">Your data is secure and encrypted</p>
        </div>
      </div>

      <Image
        src="/images/TeacherLoginImg.png"
        alt="Teacher Login Illustration"
        width={1600}
        height={800}
        className="hidden lg:flex"
      />

      <div className="min-w-1/2 flex w-full flex-col items-center justify-center">
        <div className="w-full flex flex-col  items-center justify-center ">
          <div className="w-1/2 max-w-[359px]">
            <div className="flex flex-col items-center py-8 justify-center">
              <div className="bg-gray-300 h-16 w-16 rounded-full p-2 flex items-center justify-center">
                @
              </div>
              <h2 className="text-lg font-semibold text-[24px]">
                Admin Portal
              </h2>
              <p className="text-[#737373]">School Management System</p>
            </div>

            <Form onSubmit={form.handleSubmit(onSubmit)} aria-live="polite">
              <FormField>
                <FormLabel>Email</FormLabel>
                <FormMessage>
                  {form.formState.errors.email?.message as React.ReactNode}
                </FormMessage>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@school.edu"
                    {...form.register("email")}
                    aria-invalid={!!form.formState.errors.email}
                    aria-describedby={
                      form.formState.errors.email ? "email-error" : undefined
                    }
                  />
                </FormControl>
              </FormField>

              <FormField>
                <div>
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <FormLabel>Forgot your Password</FormLabel>
                  </div>
                </div>
                <FormMessage>
                  {form.formState.errors.password?.message as React.ReactNode}
                </FormMessage>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    aria-invalid={!!form.formState.errors.password}
                    aria-describedby={
                      form.formState.errors.password
                        ? "password-error"
                        : undefined
                    }
                  />
                </FormControl>
              </FormField>

              <div className="flex w-full mt-8">
                <Button
                  className="w-full max-w-[359px] bg-[#021034]"
                  type="submit"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
              <div className="mt-4 flex flex-col items-center gap-1 font-[400] text-slate-600">
                <p>Having trouble logging in?</p>
                <p className="text-[#377DFF]">Contact IT Support</p>
              </div>
            </Form>
          </div>
        </div>
        <div className="py-4 text-center sticky bottom-0 text-sm text-slate-500">
          © 2025 Acme Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
