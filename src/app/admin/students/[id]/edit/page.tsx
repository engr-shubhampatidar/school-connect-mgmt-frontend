"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import API from "../../../../../lib/axios";
import Card from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/Button";
import { useToast } from "../../../../../components/ui/use-toast";

const phoneRegex = /^\+?[0-9\s-]{6,20}$/;

const schema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  primaryGuardianName: z.string().min(1, "Primary guardian is required"),
  primaryGuardianPhone: z
    .string()
    .min(1, "Primary guardian phone is required")
    .regex(phoneRegex, "Invalid phone"),
  secondaryGuardianName: z.string().optional().or(z.literal("")),
  secondaryGuardianPhone: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), { message: "Invalid phone" }),
  emergencyContact: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function Page() {
  return <EditStudentProfile />;
}

function EditStudentProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { toast } = useToast();
  const toastRef = React.useRef(toast);
  const loadedRef = React.useRef<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  React.useEffect(() => {
    let mounted = true;
    if (!id) {
      setLoading(false);
      return;
    }

    // avoid fetching multiple times for same id (round-trips, re-renders, strict-mode)
    if (loadedRef.current[id!]) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await API.get(`/api/admin/students/${id}/profile`);
        if (!mounted) return;
        const resData = res.data ?? {};
        const data = (resData && (resData.profile ?? resData)) as any;
        reset({
          dob: data.dob ?? "",
          addressLine1: data.addressLine1 ?? "",
          addressLine2: data.addressLine2 ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          postalCode: data.postalCode ?? "",
          country: data.country ?? "",
          primaryGuardianName: data.primaryGuardianName ?? "",
          primaryGuardianPhone: data.primaryGuardianPhone ?? "",
          secondaryGuardianName: data.secondaryGuardianName ?? "",
          secondaryGuardianPhone: data.secondaryGuardianPhone ?? "",
          emergencyContact: data.emergencyContact ?? "",
          notes: data.notes ?? "",
        });
        loadedRef.current[id!] = true;
      } catch (err: any) {
        toastRef.current?.({
          title: "Error",
          description: err?.message ?? "Failed to load",
          type: "error",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
    // intentionally only depend on `id` to avoid re-running when toast/reset identities change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      await API.put(`/api/admin/students/${id}/profile`, data);
      toast({
        title: "Saved",
        description: "Student profile updated",
        type: "success",
      });
      router.push("/admin/students");
    } catch (err: any) {
      // try to map field errors from server
      const resp = err?.response?.data;
      if (resp && typeof resp === "object" && resp.errors) {
        for (const key of Object.keys(resp.errors)) {
          setError(key as any, {
            type: "server",
            message: resp.errors[key] as string,
          });
        }
      } else {
        toast({
          title: "Error",
          description: err?.message ?? "Update failed",
          type: "error",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Edit Student Profile</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              {errors.dob && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.dob.message}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Address Line 1
              </label>
              <input
                {...register("addressLine1")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              {errors.addressLine1 && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.addressLine1.message}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Address Line 2
              </label>
              <input
                {...register("addressLine2")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600">City</label>
                <input
                  {...register("city")}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
                {errors.city && (
                  <div className="text-sm text-red-600 mt-1">
                    {errors.city.message}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-600">State</label>
                <input
                  {...register("state")}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
                {errors.state && (
                  <div className="text-sm text-red-600 mt-1">
                    {errors.state.message}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600">
                  Postal Code
                </label>
                <input
                  {...register("postalCode")}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600">Country</label>
                <input
                  {...register("country")}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
                {errors.country && (
                  <div className="text-sm text-red-600 mt-1">
                    {errors.country.message}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Primary Guardian Name
              </label>
              <input
                {...register("primaryGuardianName")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              {errors.primaryGuardianName && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.primaryGuardianName.message}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Primary Guardian Phone
              </label>
              <input
                {...register("primaryGuardianPhone")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              {errors.primaryGuardianPhone && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.primaryGuardianPhone.message}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Secondary Guardian Name
              </label>
              <input
                {...register("secondaryGuardianName")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Secondary Guardian Phone
              </label>
              <input
                {...register("secondaryGuardianPhone")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              {errors.secondaryGuardianPhone && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.secondaryGuardianPhone.message}
                </div>
              )}
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

            <div>
              <label className="block text-sm text-slate-600">Notes</label>
              <textarea
                {...register("notes")}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="pt-4 border-t flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => router.push("/admin/students")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
