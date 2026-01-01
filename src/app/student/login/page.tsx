"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import studentApi from "../../../lib/studentApi";
import { setToken } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";

const schema = z.object({
  rollNumber: z.string(),
  // .regex(/^\d{3}$/, "Roll number must be exactly 3 digits"),
  password: z.string().min(6),
});

type Form = z.infer<typeof schema>;

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      // send rollNumber and password to authenticate
      const res = await studentApi.post("/api/student/auth/login", {
        identifier: data.rollNumber,
        password: data.password,
      });
      const token = res.data?.accessToken;
      if (token) {
        setToken("student", token);
        router.push("/student/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "No token returned",
          type: "error",
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err.message ?? "Login failed";
      toast({ title: "Login error", description: String(msg), type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F9FF] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-4">Student Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Roll Number
              </label>
              <input
                {...register("rollNumber")}
                inputMode="numeric"
                maxLength={16}
                // pattern="\d{6}"
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="e.g.10A-KU-6787"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
