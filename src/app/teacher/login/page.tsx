"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import Image from "next/image";

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
    <>
      <div className="min-h-screen w-full flex  p-4">
        <div className="absolute w-1/2  lg:flex items-start justify-start hidden   flex-col pl-20 pt-20">
          <div className="w-full flex items-center mb-92">
            <h1 className="font-bold text-2xl text-white max-w-[100px]">
              MAXUSE INSTITUTE
            </h1>
          </div>
          <div className="flex flex-col text-white">
            <h1 className="text-white text-[48px] max-w-[458px] font-[600] leading-[56px] mb-4">
              Your Classroom Awaits ✨
            </h1>
            <p>
              Take attendance, update lessons, and guide students—all in one
              place.
            </p>
          </div>

          <div className="flex items-center w-full bottom-0 mt-44 ">
            {" "}
            <p className="text-white pl-60">
              Your data is secure and encrypted
            </p>
          </div>
        </div>
        <Image
          src="/images/TeacherLoginImg.png"
          alt="Teacher Login Illustration"
          width={1600}
          height={800}
          className="hidden lg:flex"
        />
        <div className="min-w-1/2 flex w-full flex-col items-center justify-center">
          <div className="w-full flex flex-col  items-center justify-center ">
            <div className="w-1/2 max-w-[359px]">
              <div className="flex flex-col items-center py-8 justify-center">
                <div className="bg-gray-300 h-16 w-16 rounded-full p-2 flex items-center justify-center">
                  @
                </div>
                <h2 className="text-lg font-semibold text-[24px]">
                  Teacher Portal
                </h2>
                <p className="text-[#737373]">School Management System</p>
              </div>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormField>
                  <FormLabel>Email</FormLabel>
                  <FormMessage>{errors.email?.message}</FormMessage>
                  <FormControl>
                    <Input
                      placeholder="teacher@example.com"
                      {...register("email")}
                    />
                  </FormControl>
                </FormField>

                <FormField>
                  <div>
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <FormLabel>Forgot your Password</FormLabel>
                    </div>
                  </div>
                  <FormMessage>{errors.password?.message}</FormMessage>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password"
                      {...register("password")}
                    />
                  </FormControl>
                </FormField>

                <div className="flex w-full mt-8">
                  <Button
                    className="w-full max-w-[359px] bg-[#021034]"
                    type="submit"
                    variant="dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
                <div className="mt-4 flex flex-col items-center gap-1 font-[400] text-slate-600">
                  <p>Having trouble logging in?</p>
                  <p className="text-[#377DFF]">Contact IT Support</p>
                </div>
              </Form>
            </div>
          </div>
          <div className="py-4 text-center sticky bottom-0 text-sm text-slate-500">
            © 2025 Acme Inc. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
