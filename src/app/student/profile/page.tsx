"use client";
import React from "react";
import StudentAuthGuard from "../../../components/student/AuthGuard";
import studentApi from "../../../lib/studentApi";
import { Card } from "../../../components/ui/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";

const schema = z.object({
  phone: z.string().min(6).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
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
  const [loading, setLoading] = React.useState(true);
  const [readonlyInfo, setReadonlyInfo] = React.useState<any>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

  const { register, handleSubmit, reset, formState } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await studentApi.get("/api/student/profile");
        if (!mounted) return;
        setReadonlyInfo(res.data);
        reset({
          phone: res.data?.phone ?? "",
          address: res.data?.address ?? "",
          emergencyContact: res.data?.emergencyContact ?? "",
        });
      } catch (err: any) {
        toastRef.current?.({
          title: "Error",
          description: err?.message ?? "Failed to load profile",
          type: "error",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
    // run once on mount; toast referenced via ref to avoid re-running when its identity changes
  }, [reset]);

  const onSubmit = async (data: Form) => {
    try {
      await studentApi.put("/api/student/profile", data);
      toast({
        title: "Saved",
        description: "Profile updated",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message ?? "Update failed",
        type: "error",
      });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Profile</h2>

          <div className="mb-6">
            <div className="text-sm text-slate-500">Basic Info</div>
            <div className="mt-2">
              <div className="text-sm">Name: {readonlyInfo?.name}</div>
              <div className="text-sm">Roll No: {readonlyInfo?.rollNumber}</div>
              <div className="text-sm">Class: {readonlyInfo?.className}</div>
              <div className="text-sm">School: {readonlyInfo?.schoolName}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600">Phone</label>
              <input
                {...register("phone")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Address</label>
              <textarea
                {...register("address")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">
                Emergency Contact
              </label>
              <input
                {...register("emergencyContact")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={formState.isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
