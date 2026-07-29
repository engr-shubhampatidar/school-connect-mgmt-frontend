"use client";
import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/use-toast";
import { createSubject } from "@/modules/subjects/api/subjects";
import {
  createSubjectSchema,
  type CreateSubjectValues,
} from "@/modules/subjects/schemas/createSubjectSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function AddSubjectDialog({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateSubjectValues>({
    resolver: zodResolver(
      createSubjectSchema,
    ) as unknown as Resolver<CreateSubjectValues>,
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: CreateSubjectValues) => {
    setLoading(true);
    try {
      await createSubject({ name: values.name });
      toast({ title: "Subject created", type: "success" });
      form.reset();
      onClose();
      onCreated?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, unknown> | undefined;
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          const fe = data.fieldErrors as Record<string, unknown>;
          Object.entries(fe).forEach(([k, v]) => {
            form.setError(k as keyof CreateSubjectValues, {
              type: "server",
              message: String(v),
            });
          });
        }
        toast({
          title: "Failed to create subject",
          description: (data && (data.message as string)) ?? err.message,
          type: "error",
        });
      } else if (err instanceof Error) {
        toast({
          title: "Failed to create subject",
          description: err.message,
          type: "error",
        });
      } else {
        toast({ title: "Failed to create subject", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />
      <div className="relative w-full max-w-lg p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
        <div className="rounded-lg">
          <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-[700] text-white">
                Create New Subject
              </h3>
              <p className="text-[14px] font-[400] text-white">
                Fill in the details to add a new subject offered by the school.
              </p>
            </div>
            <div>
              <button
                aria-label="close"
                onClick={handleCancel}
                className="text-white hover:text-white/80"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-[16px] bg-white overflow-hidden rounded-b-lg max-h-full">
            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
                  Subject Information
                </h1>
                <FormField>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register("name")}
                      placeholder="Mathematics"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message as React.ReactNode}
                  </FormMessage>
                </FormField>
              </Card>

              <div className="mt-6 flex sticky bottom-0 justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="dark"
                  disabled={!form.formState.isValid || loading}
                >
                  {loading ? "Creating…" : "Create Subject"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
