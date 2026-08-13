import { loginSchema } from "@/modules/auth/schemas/loginSchema";
import * as authServices from "@/modules/auth/api/authServices";
import type { Role } from "@/types/auth";

export type { Role };

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
};

const sharedLoginFields: Field[] = [
  {
    name: "email",
    label: "Email",
    placeholder: "you@school.edu",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    type: "password",
  },
];

export const loginConfig: Record<
  Role,
  {
    schema: unknown;
    submit: (values: { email: string; password: string }) => Promise<unknown>;
    fields: Field[];
    redirectPath: string;
    title: string;
  }
> = {
  admin: {
    schema: loginSchema,
    submit: authServices.adminLogin,
    fields: sharedLoginFields,
    redirectPath: "/admin/dashboard",
    title: "Admin Portal",
  },
  teacher: {
    schema: loginSchema,
    submit: authServices.teacherLogin,
    fields: [
      {
        name: "email",
        label: "Email",
        placeholder: "teacher@example.com",
        type: "email",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Your password",
        type: "password",
      },
    ],
    redirectPath: "/teacher/dashboard",
    title: "Teacher Portal",
  },
  student: {
    schema: loginSchema,
    submit: authServices.studentLogin,
    fields: sharedLoginFields,
    redirectPath: "/student/dashboard",
    title: "Student Portal",
  },
  parent: {
    schema: loginSchema,
    submit: authServices.parentLogin,
    fields: sharedLoginFields,
    redirectPath: "/parent/dashboard",
    title: "Parent Portal",
  },
};

export default loginConfig;
