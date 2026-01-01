"use client";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import studentApi from "../../../lib/studentApi";
import { setToken } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import Form, {
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "../../../components/ui/Form";
import { useToast } from "../../../components/ui/use-toast";

const schema = z.object({
  rollNumber: z
    .string()
    .regex(
      /^[0-9][A-Za-z]-[A-Za-z]{2}-[0-9]{4}$/,
      "Roll number must match pattern 1C-AA-8561"
    ),
  password: z.string().min(6),
});

type Form = z.infer<typeof schema>;

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
  });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: Form) => {
    try {
      // send rollNumber and password to authenticate
      const res = await studentApi.post("/api/student/auth/login", {
        identifier: data.rollNumber,
        password: data.password,
      });
      const token = res.data?.accessToken;
      if (token) {
        setToken("student", token);
        router.push("/student/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "No token returned",
          type: "error",
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err.message ?? "Login failed";
      toast({ title: "Login error", description: String(msg), type: "error" });
    }
  };

  return (
    <div className="min-h-screen w-full flex  p-4">
      <div className="absolute w-1/2  lg:flex items-start justify-start hidden   flex-col pl-20 pt-20">
        <div className="w-full flex items-center mb-92">
          <h1 className="font-bold text-2xl text-white max-w-[100px]">
            MAXUSE INSTITUTE
          </h1>
        </div>
        <div className="flex flex-col text-white">
          <h1 className="text-white text-[48px] max-w-[458px] font-[600] leading-[56px] mb-4">
            Welcome Back, Learner 👋
          </h1>
          <p>Check your classes, attendance, and progress—all in one place.</p>
        </div>

        <div className="flex items-center w-full bottom-0 mt-44 ">
          <p className="text-white pl-60">Your data is secure and encrypted</p>
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
              <div className="bg-gray-300 h-16 w-16 rounded-full  flex items-center justify-center">
                <Image
                  src="/images/Avatar.png"
                  alt="Student Login Icon"
                  width={74}
                  height={74}
                  className="w-16 h-16 object-cover rounded-full"
                />    
              </div>
              <h2 className="text-lg font-semibold text-[24px]">
                Student Portal
              </h2>
              <p className="text-[#737373]">School Management System</p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormField>
                <FormLabel>Roll Number</FormLabel>
                <FormMessage>
                  {errors.rollNumber?.message as React.ReactNode}
                </FormMessage>
                <FormControl>
                  <Input
                    placeholder="e.g. 1C-AA-8561"
                    {...register("rollNumber")}
                    inputMode="text"
                    maxLength={11}
                    pattern="^[0-9][A-Za-z]-[A-Za-z]{2}-[0-9]{4}$"
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
                <FormMessage>
                  {errors.password?.message as React.ReactNode}
                </FormMessage>
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
  );
}
