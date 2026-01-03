import { adminLoginSchema } from "./validators/adminAuth";
import teacherLoginSchema from "./validators/teacherAuth";
import studentLoginSchema from "./validators/studentAuth";
import * as authServices from "./authServices";

export type Role = "admin" | "teacher" | "student";

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
};

export const loginConfig: Record<
  Role,
  {
    schema: unknown;
    submit: (values: any) => Promise<any>;
    fields: Field[];
    redirectPath: string;
    title: string;
  }
> = {
  admin: {
    schema: adminLoginSchema,
    submit: authServices.adminLogin,
    fields: [
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
    ],
    redirectPath: "/admin/dashboard",
    title: "Admin Portal",
  },
  teacher: {
    schema: teacherLoginSchema,
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
    schema: studentLoginSchema,
    submit: authServices.studentLogin,
    fields: [
      {
        name: "rollNumber",
        label: "Roll Number",
        placeholder: "e.g. 1C-AA-8561",
        type: "text",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Your password",
        type: "password",
      },
    ],
    redirectPath: "/student/dashboard",
    title: "Student Portal",
  },
};

export default loginConfig;
