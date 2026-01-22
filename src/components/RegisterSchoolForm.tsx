"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../lib/axios";
import { PUBLIC_API } from "../lib/api-routes";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
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
  adminName: z.string().min(1, "Administrator name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(1, "Mobile number is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number and special character",
    ),
  address: z.string().optional().or(z.literal("")),
  contact: z.string().optional().or(z.literal("")),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  board: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  academicYear: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  timezone: z.string().optional().or(z.literal("")),
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
      adminName: "",
      email: "",
      mobile: "",
      password: "",
      address: "",
      contact: "",
      logoUrl: "",
      board: "",
      city: "",
      state: "",
      academicYear: "",
      language: "",
      timezone: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        adminName: values.adminName,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        address: values.address || "",
        contact: values.contact || "",
        logoUrl: values.logoUrl || "",
        board: values.board || "",
        city: values.city || "",
        state: values.state || "",
        academicYear: values.academicYear || "",
        language: values.language || "",
        timezone: values.timezone || "",
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
    <div className="w-full max-w-full flex md:items-center md:px-8">
      <div className="w-full max-w-full bg-[#FFFFFF] border border-[#D7E3FC] rounded-lg">
        <div className="h-[8px] hidden md:flex w-full bg-[#1E40AF] rounded-t-lg"></div>
        <div className="w-full max-w-full p-8">
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6 ">
              <h2 className="text-2xl font-semibold">
                Administrator Information
              </h2>
              <p className="text-sm text-slate-600">
                You are registering as the primary administrator for this
                school.{" "}
              </p>
              <FormField>
                <FormLabel>What is your Full name?</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("adminName")}
                    placeholder="Full Name"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.adminName?.message}
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>
                  What email address should be used for this account?
                </FormLabel>
                <FormControl>
                  <Input
                    {...form.register("email")}
                    placeholder="You'll use this email to log in"
                    type="email"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormField>
              <FormField>
                <FormLabel>What is your mobile phone number?</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("mobile") || {...form.register("contact")}}
                    placeholder="(555)12358645"
                    type="tel"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.mobile?.message}
                </FormMessage>
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Create a password</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register("password")}
                      placeholder="Create a Strong Password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormField>
                <FormField>
                  <FormLabel>Confirm your password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your Strong Password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage>
                    {/* {form.formState.errors.email?.message} */}
                  </FormMessage>
                </FormField>
              </div>
            </div>

            <div className="space-y-6 ">
              <h2 className="text-2xl font-semibold">School Information</h2>
              <p className="text-sm text-slate-600">
                Fill your school information.
              </p>

              <FormField>
                <FormLabel>
                  What is the name of your school or institution?
                </FormLabel>
                <FormControl>
                  <Input
                    {...form.register("name")}
                    placeholder="Acme High School"
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormField>

              <FormField>
                <FormLabel>
                  Which board or curriculum does your school follow?
                </FormLabel>
                <FormControl>
                  <Input
                    {...form.register("board")}
                    placeholder="Select Board/Curriculum"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.board?.message}
                </FormMessage>
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>What city is the school located in?</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register("city") || {...form.register("address")}}
                      placeholder="City"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage>
                    {/* {form.formState.errors.password?.message} */}
                  </FormMessage>
                </FormField>
                <FormField>
                  <FormLabel>What state is the school located in?</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register("state")}
                      placeholder="State"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage>
                    {/* {form.formState.errors.email?.message} */}
                  </FormMessage>
                </FormField>
              </div>

              <FormField>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("logoUrl")}
                    placeholder="https://.../logo.png"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.logoUrl?.message}
                </FormMessage>
              </FormField>
            </div>

            <div className="space-y-6 ">
              <h2 className="text-2xl font-semibold">Academic Setup</h2>
              <p className="text-sm text-slate-600">
                Fill your school information.
              </p>

              <FormField>
                <FormLabel>
                  Select the academic year for this registration
                </FormLabel>
                <FormControl>
                  <Input
                    {...form.register("academicYear")}
                    placeholder="Academic year 2024-2025"
                  />
                </FormControl>
                {/* <FormMessage>{form.formState.errors.name?.message}</FormMessage> */}
              </FormField>

              <FormField>
                <FormLabel>
                  Preferred language for system communication
                </FormLabel>
                <FormControl>
                  <Input
                    {...form.register("language")}
                    placeholder="Select Language"
                  />
                </FormControl>
                {/* <FormMessage>{form.formState.errors.name?.message}</FormMessage> */}
              </FormField>
              <FormField>
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("timezone")}
                    placeholder="Automatically detected based on your location"
                  />
                </FormControl>
                {/* <FormMessage>{form.formState.errors.name?.message}</FormMessage> */}
              </FormField>
            </div>

            <div>
              <Button
                type="submit"
                // disabled={!form.formState.isValid || loading}
                className="w-full"
                variant="dark"
              >
                {loading ? "Registering..." : "Continue"}
              </Button>
            </div>
            <p className="text-center text-slate-400 text-sm">
              By continuing, you confirm that the information provided is
              accurate to the best of your knowledge.
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterSchoolForm;
