"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  useForm,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Form, {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/use-toast";
import {
  createParentSchema,
  type CreateParentValues,
} from "@/modules/parents/schemas/parent.schemas";
import { useParentMutations } from "@/modules/parents/hooks/useParents";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateParentDialog({
  open,
  onClose,
  onCreated,
}: Props) {
  const { toast } = useToast();
  const { create } = useParentMutations();
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const form = useForm<CreateParentValues>({
    resolver: zodResolver(createParentSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
      gender: undefined,
      dateOfBirth: "",
    },
  });

  const {
    handleSubmit,
    setError,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) {
      reset();
      setTempEmail(null);
      setTempPassword(null);
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<CreateParentValues> = useCallback(
    async (values) => {
      try {
        const digits = values.mobile.replace(/[^0-9]/g, "");
        const mobile =
          digits.length === 10 ? `+91${digits}` : values.mobile.startsWith("+")
            ? values.mobile.replace(/[\s-]/g, "")
            : `+${digits}`;

        const res = await create.mutateAsync({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          mobile,
          address: values.address || undefined,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth || undefined,
        });

        setTempEmail(res.email ?? values.email);
        setTempPassword(res.temporaryPassword ?? null);
        toast({
          title: "Parent created",
          description: "Temporary credentials generated.",
          type: "success",
        });
        reset();
        onCreated?.();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as Record<string, unknown> | undefined;
          if (data?.errors && typeof data.errors === "object") {
            Object.entries(data.errors as Record<string, string>).forEach(
              ([k, v]) => {
                setError(k as keyof CreateParentValues, {
                  type: "server",
                  message: String(v),
                });
              },
            );
            toast({
              title: "Validation error",
              description: "Please fix the form errors.",
              type: "error",
            });
            return;
          }
          toast({
            title: "Failed to create parent",
            description: String(data?.message ?? err.message),
            type: "error",
          });
          return;
        }
        toast({
          title: "Failed to create parent",
          description: (err as Error)?.message ?? "Unknown error",
          type: "error",
        });
      }
    },
    [create, onCreated, reset, setError, toast],
  );

  const onInvalid = useCallback(
    (fieldErrors: FieldErrors<CreateParentValues>) => {
      const firstError = Object.values(fieldErrors).find((e) => e?.message);
      toast({
        title: "Please fix the form errors",
        description:
          (firstError?.message as string) ??
          "Some required fields are missing or invalid.",
        type: "error",
      });
    },
    [toast],
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-full max-w-xl p-4 max-h-full overflow-y-auto">
          <div className="rounded-lg overflow-hidden">
            <div className="flex items-start bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
              <div>
                <h3 className="text-[24px] font-[700] text-white">
                  Create New Parent
                </h3>
                <p className="text-[14px] font-[400] text-white">
                  Fill in the details below to add a parent account.
                </p>
              </div>
              <button
                aria-label="close"
                onClick={onClose}
                className="text-white hover:text-white/80"
              >
                ✕
              </button>
            </div>
            <div className="p-[16px] bg-white rounded-b-lg">
              <Form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>First Name</FormLabel>
                    <FormMessage>
                      {errors.firstName?.message as React.ReactNode}
                    </FormMessage>
                    <FormControl>
                      <Input
                        {...register("firstName")}
                        placeholder="First name"
                      />
                    </FormControl>
                  </FormField>
                  <FormField>
                    <FormLabel>Last Name</FormLabel>
                    <FormMessage>
                      {errors.lastName?.message as React.ReactNode}
                    </FormMessage>
                    <FormControl>
                      <Input
                        {...register("lastName")}
                        placeholder="Last name"
                      />
                    </FormControl>
                  </FormField>
                  <FormField>
                    <FormLabel>Email</FormLabel>
                    <FormMessage>
                      {errors.email?.message as React.ReactNode}
                    </FormMessage>
                    <FormControl>
                      <Input
                        type="email"
                        {...register("email")}
                        placeholder="parent@example.com"
                      />
                    </FormControl>
                  </FormField>
                  <FormField>
                    <FormLabel>Mobile</FormLabel>
                    <FormMessage>
                      {errors.mobile?.message as React.ReactNode}
                    </FormMessage>
                    <FormControl>
                      <Input
                        {...register("mobile")}
                        placeholder="10-digit mobile"
                      />
                    </FormControl>
                  </FormField>
                  <FormField>
                    <FormLabel>Gender (optional)</FormLabel>
                    <FormControl>
                      <Select
                        options={[
                          { id: "", name: "Select gender" },
                          { id: "MALE", name: "Male" },
                          { id: "FEMALE", name: "Female" },
                          { id: "OTHER", name: "Other" },
                        ]}
                        value={form.watch("gender") ?? ""}
                        onChange={(v) =>
                          form.setValue(
                            "gender",
                            v
                              ? (v as "MALE" | "FEMALE" | "OTHER")
                              : undefined,
                            { shouldValidate: true },
                          )
                        }
                        placeholder="Select gender"
                        className="w-full"
                      />
                    </FormControl>
                  </FormField>
                  <FormField>
                    <FormLabel>Date of Birth (optional)</FormLabel>
                    <FormMessage>
                      {errors.dateOfBirth?.message as React.ReactNode}
                    </FormMessage>
                    <FormControl>
                      <Input type="date" {...register("dateOfBirth")} />
                    </FormControl>
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField>
                      <FormLabel>Address (optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...register("address")}
                          placeholder="Address"
                        />
                      </FormControl>
                    </FormField>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="dark"
                    disabled={isSubmitting || create.isPending}
                  >
                    {isSubmitting || create.isPending
                      ? "Saving…"
                      : "Create Parent"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {tempEmail || tempPassword ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-md p-4">
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Temporary Credentials
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Share these credentials with the parent — they will not be
                    shown again.
                  </p>
                </div>
                <button
                  aria-label="close"
                  onClick={() => {
                    setTempEmail(null);
                    setTempPassword(null);
                    onClose();
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <div className="rounded-md border p-4">
                  <div className="text-sm text-slate-700">Email</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="font-mono text-lg text-slate-900">
                      {tempEmail ?? "-"}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        const parts: string[] = [];
                        if (tempEmail) parts.push(`Email: ${tempEmail}`);
                        if (tempPassword)
                          parts.push(`Temporary Password: ${tempPassword}`);
                        try {
                          await navigator.clipboard.writeText(parts.join("\n"));
                          toast({
                            title: "Copied to clipboard",
                            type: "success",
                          });
                        } catch {
                          toast({ title: "Copy failed", type: "error" });
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  {tempPassword ? (
                    <>
                      <div className="mt-4 text-sm text-slate-700">
                        Temporary Password
                      </div>
                      <div className="mt-2 font-mono text-lg text-slate-900">
                        {tempPassword}
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      setTempEmail(null);
                      setTempPassword(null);
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}
