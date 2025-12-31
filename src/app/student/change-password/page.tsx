"use client";
import React from "react";
import StudentAuthGuard from "../../../components/student/AuthGuard";
import studentApi from "../../../lib/studentApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";
import { removeToken } from "../../../lib/auth";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirm: z.string().min(6),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  });

type Form = z.infer<typeof schema>;

export default function Page() {
  return (
    <StudentAuthGuard>
      <Inner />
    </StudentAuthGuard>
  );
}

function Inner() {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      await studentApi.post("/api/student/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast({
        title: "Password changed",
        description: "You will be logged out",
        type: "success",
      });
      removeToken("student");
      router.push("/student/login");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message ?? "Change failed",
        type: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600">
                Old Password
              </label>
              <input
                type="password"
                {...register("oldPassword")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">
                New Password
              </label>
              <input
                type="password"
                {...register("newPassword")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">
                Confirm New Password
              </label>
              <input
                type="password"
                {...register("confirm")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={formState.isSubmitting}>
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
