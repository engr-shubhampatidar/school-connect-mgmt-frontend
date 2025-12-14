"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import API from "../lib/axios";
import { PUBLIC_API } from "../lib/api-routes";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import Card from "./ui/Card";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/Form";
import { useToast } from "./ui/use-toast";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
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
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone || "",
        message: values.message || "",
      };

      await API.post(PUBLIC_API.CONTACT, payload);

      toast({
        id: "contact-success",
        title: "Message sent",
        description: "Message sent successfully.",
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

  return (
    <Card className="w-full max-w-lg">
      <h2 className="text-2xl font-semibold">Contact Us</h2>
      <p className="text-sm text-slate-600">
        For support or general inquiries.
      </p>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...form.register("name")} placeholder="Your name" />
          </FormControl>
          <FormMessage>{form.formState.errors.name?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              {...form.register("email")}
              placeholder="you@company.com"
              type="email"
            />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Phone</FormLabel>
          <FormControl>
            <Input {...form.register("phone")} placeholder="(555) 555-5555" />
          </FormControl>
          <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Message</FormLabel>
          <FormControl>
            <Textarea
              {...form.register("message")}
              placeholder="Write your message (optional)"
              rows={5}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.message?.message}</FormMessage>
        </FormField>

        <div>
          <Button
            type="submit"
            disabled={!form.formState.isValid || loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default ContactForm;
