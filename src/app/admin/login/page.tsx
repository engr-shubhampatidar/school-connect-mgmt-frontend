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
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import Form, {
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "../../../components/ui/Form";
import { useToast } from "../../../components/ui/use-toast";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <h2 className="text-lg font-semibold text-slate-900">Admin sign in</h2>
        <p className="text-sm text-slate-600">
          Sign in to manage your school data
        </p>

        <Form onSubmit={form.handleSubmit(onSubmit)} aria-live="polite">
          <FormField>
            <FormLabel>Email</FormLabel>
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
            <FormMessage>
              {form.formState.errors.email?.message as React.ReactNode}
            </FormMessage>
          </FormField>

          <FormField>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                aria-invalid={!!form.formState.errors.password}
                aria-describedby={
                  form.formState.errors.password ? "password-error" : undefined
                }
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.password?.message as React.ReactNode}
            </FormMessage>
          </FormField>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Login
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
