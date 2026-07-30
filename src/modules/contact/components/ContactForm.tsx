"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { useToast } from "@/components/ui/use-toast";
import { contactSchema, type ContactInput } from "../schemas/contactSchema";
import { submitContact } from "../api/submitContact";

export default function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setLoading(true);
    try {
      await submitContact(values);
      toast({
        id: "contact-success",
        title: "Message sent",
        description: "We received your note and will reply soon.",
        type: "success",
      });
      form.reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([field, message]) => {
            const key = field as keyof ContactInput;
            form.setError(key, {
              type: "server",
              message: String(message),
            });
          });
          toast({
            id: "contact-error-fields",
            title: "Validation error",
            description: "Please fix the highlighted fields.",
            type: "error",
          });
        } else if (data?.message) {
          toast({
            id: "contact-error-message",
            title: "Error",
            description: String(data.message),
            type: "error",
          });
        } else {
          toast({
            id: "contact-error-network",
            title: "Network error",
            description: "Unable to reach server.",
            type: "error",
          });
        }
      } else {
        toast({
          id: "contact-error-unknown",
          title: "Error",
          description: "An unexpected error occurred.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-[#D7E3FC] bg-[#F8FAFF] px-3 py-2.5 text-sm text-[#021034] outline-none transition placeholder:text-[#021034]/35 focus:border-[#021034]/40 focus:bg-white";

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormField>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input
            {...form.register("name")}
            placeholder="Your full name"
            className={fieldClass}
          />
        </FormControl>
        <FormMessage>{form.formState.errors.name?.message}</FormMessage>
      </FormField>

      <FormField>
        <FormLabel>Work email</FormLabel>
        <FormControl>
          <Input
            {...form.register("email")}
            placeholder="you@school.edu"
            type="email"
            className={fieldClass}
          />
        </FormControl>
        <FormMessage>{form.formState.errors.email?.message}</FormMessage>
      </FormField>

      <FormField>
        <FormLabel>
          Phone <span className="font-normal text-[#021034]/45">(optional)</span>
        </FormLabel>
        <FormControl>
          <Input
            {...form.register("phone")}
            placeholder="+91 98765 43210"
            className={fieldClass}
          />
        </FormControl>
        <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
      </FormField>

      <FormField>
        <FormLabel>
          How can we help?{" "}
          <span className="font-normal text-[#021034]/45">(optional)</span>
        </FormLabel>
        <FormControl>
          <Textarea
            {...form.register("message")}
            placeholder="Tell us about your school, timeline, or support need."
            rows={5}
            className={`${fieldClass} min-h-[120px] resize-y`}
          />
        </FormControl>
        <FormMessage>{form.formState.errors.message?.message}</FormMessage>
      </FormField>

      <button
        type="submit"
        disabled={!form.formState.isValid || loading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#021034] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#021034]/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </Form>
  );
}
