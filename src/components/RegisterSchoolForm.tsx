"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../lib/axios";
import { PUBLIC_API } from "../lib/api-routes";
import { Input } from "./ui/Input";
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
import axios from "axios";

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;

const registerSchema = z.object({
  name: z.string().min(1, "School name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number and special character"
    ),
  address: z.string().optional().or(z.literal("")),
  contact: z.string().optional().or(z.literal("")),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterSchoolForm() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      contact: "",
      logoUrl: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        address: values.address || "",
        contact: values.contact || "",
        logoUrl: values.logoUrl || "",
      };

      await API.post(PUBLIC_API.REGISTER_SCHOOL, payload);
      toast({
        id: "success-registered",
        title: "Registered",
        description: "School registered successfully.",
        type: "success",
      });
      form.reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        // Map field errors if provided
        if (data?.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([field, message]) => {
            const key = field as keyof RegisterInput;
            form.setError(key, {
              type: "server",
              message: String(message),
            });
          });
          toast({
            id: "error-fields",
            title: "Validation error",
            description: "Please fix the highlighted fields.",
            type: "error",
          });
        } else if (data?.message) {
          toast({
            id: "error-message",
            title: "Error",
            description: String(data.message),
            type: "error",
          });
        } else {
          toast({
            id: "error-network",
            title: "Network error",
            description: "Unable to reach server.",
            type: "error",
          });
        }
      } else {
        toast({
          id: "error-unknown",
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
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-semibold">Register School</h2>
      <p className="text-sm text-slate-600">
        Create an account for your school.
      </p>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField>
          <FormLabel>School Name</FormLabel>
          <FormControl>
            <Input {...form.register("name")} placeholder="Acme High School" />
          </FormControl>
          <FormMessage>{form.formState.errors.name?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              {...form.register("email")}
              placeholder="admin@school.edu"
              type="email"
            />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input
              {...form.register("password")}
              placeholder="Strong password"
              type="password"
            />
          </FormControl>
          <FormMessage>{form.formState.errors.password?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input {...form.register("address")} placeholder="123 Main St" />
          </FormControl>
          <FormMessage>{form.formState.errors.address?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Contact Number</FormLabel>
          <FormControl>
            <Input {...form.register("contact")} placeholder="(555) 555-5555" />
          </FormControl>
          <FormMessage>{form.formState.errors.contact?.message}</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Logo URL</FormLabel>
          <FormControl>
            <Input
              {...form.register("logoUrl")}
              placeholder="https://.../logo.png"
            />
          </FormControl>
          <FormMessage>{form.formState.errors.logoUrl?.message}</FormMessage>
        </FormField>

        <div>
          <Button
            type="submit"
            disabled={!form.formState.isValid || loading}
            className="w-full"
          >
            {loading ? "Registering..." : "Register School"}
          </Button>
        </div>
        <p>Already Registered? <a href="/admin/login" className="text-blue-600">Login here</a></p>
      </Form>
    </Card>
  );
}

export default RegisterSchoolForm;
