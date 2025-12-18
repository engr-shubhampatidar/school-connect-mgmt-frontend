"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "../../../components/ui/Card";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "../../../components/ui/Form";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";
import { loginTeacher } from "../../../lib/teacherApi";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function TeacherLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (vals: FormData) => {
    try {
      await loginTeacher(vals);
      router.push("/teacher/dashboard");
    } catch (err: unknown) {
      let message = "Unable to login";
      if (typeof err === "object" && err !== null) {
        const e = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = e.response?.data?.message ?? e.message ?? message;
      }
      toast({
        title: "Login failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-lg font-semibold">Teacher Sign in</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel>Email</FormLabel>
            <FormMessage>{errors.email?.message}</FormMessage>
            <FormControl>
              <Input placeholder="teacher@example.com" {...register("email")} />
            </FormControl>
          </FormField>

          <FormField>
            <FormLabel>Password</FormLabel>
            <FormMessage>{errors.password?.message}</FormMessage>
            <FormControl>
              <Input
                type="password"
                placeholder="Your password"
                {...register("password")}
              />
            </FormControl>
          </FormField>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
