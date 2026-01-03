"use client";

import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Form, FormField, FormLabel, FormMessage } from "../ui/Form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/Select";
import { useToast } from "../ui/use-toast";
import {
  Teacher,
  fetchAvailableTeachers,
  assignTeacherToClass,
} from "../../lib/adminApi";

const schema = z.object({
  teacherId: z.string().min(1, "Please select a teacher"),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  classId: string;
  onSuccess?: () => void;
};

export default function AssignTeacherModal({
  open,
  onClose,
  classId,
  onSuccess,
}: Props) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { teacherId: "" },
  });

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const items = await fetchAvailableTeachers();
        if (mounted) setTeachers(items);
      } catch (err) {
        setTeachers([]);
        const message =
          err instanceof Error ? err.message : "Failed to load teachers";
        toast({
          title: "Failed to load teachers",
          description: message,
          type: "error",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) form.reset();
  }, [open]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.teacherId) return;
    setSubmitting(true);
    try {
      await assignTeacherToClass(classId, values.teacherId);
      toast({ title: "Teacher assigned successfully.", type: "success" });
      handleClose();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to assign teacher";
      toast({
        title: "Assignment failed",
        description: message,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            asChild
            onInteractOutside={(e: any) => e.preventDefault()}
            onEscapeKeyDown={(e: any) => e.preventDefault()}
          >
            <Card>
              <div className="w-full max-w-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Assign Class Teacher
                    </h3>
                    <p className="text-sm text-slate-600">
                      Select a teacher to assign to this class.
                    </p>
                  </div>
                  <div>
                    <button
                      aria-label="close"
                      onClick={handleClose}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField>
                      <FormLabel>Teacher</FormLabel>
                      {loading ? (
                        <div className="space-y-2">
                          <div className="h-10 rounded bg-slate-100 animate-pulse" />
                        </div>
                      ) : teachers && teachers.length === 0 ? (
                        <div className="text-sm text-slate-600">
                          No available teachers found.
                        </div>
                      ) : (
                        <Select
                          value={form.watch("teacherId")}
                          onValueChange={(v: string) =>
                            form.setValue("teacherId", v)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {(teachers ?? []).map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  <div className="flex flex-col">
                                    <div className="text-sm text-slate-900 truncate">
                                      {t.name}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">
                                      {t.email}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage>
                        {
                          form.formState.errors.teacherId
                            ?.message as React.ReactNode
                        }
                      </FormMessage>
                    </FormField>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          submitting ||
                          loading ||
                          !(
                            form.watch("teacherId") &&
                            form.watch("teacherId") !== ""
                          )
                        }
                      >
                        {submitting ? "Assigning…" : "Assign Teacher"}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Card>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
