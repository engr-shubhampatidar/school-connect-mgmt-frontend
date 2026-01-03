import axios from "axios";
import API from "./axios";
import { ADMIN_API } from "./api-routes";
import { loginTeacher } from "./teacherApi";
import studentApi from "./studentApi";
import { setToken, setUser } from "./auth";

export async function adminLogin(values: { email: string; password: string }) {
  const res = await API.post(ADMIN_API.LOGIN, values);
  const { accessToken, refreshToken, user: respUser } = res.data ?? {};

  if (accessToken) {
    setToken("admin", accessToken);
    if (respUser) {
      const userToStore = {
        id: respUser.id,
        name: respUser.fullName ?? respUser.name,
        email: respUser.email,
        role: respUser.role,
        school: respUser.school ?? null,
      };
      setUser("admin", userToStore);
    }
  }

  return res.data;
}

export async function teacherLogin(values: {
  email: string;
  password: string;
}) {
  // loginTeacher already handles token storage for teacher
  const data = await loginTeacher(values);
  return data;
}

export async function studentLogin(values: {
  rollNumber: string;
  password: string;
}) {
  const res = await studentApi.post("/api/student/auth/login", {
    identifier: values.rollNumber,
    password: values.password,
  });
  const token = res.data?.accessToken as string | undefined;
  if (token) setToken("student", token);
  return res.data;
}

export default {
  adminLogin,
  teacherLogin,
  studentLogin,
};
