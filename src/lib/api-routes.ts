export const BASE_URL = "http://localhost:3000";

export const PUBLIC_API = {
  CONTACT: "/api/public/contact",
  REGISTER_SCHOOL: "/api/public/register-school",
};

export const ADMIN_API = {
  LOGIN: "/api/admin/auth/login",
  DASHBOARD: "/api/admin/dashboard",
  STUDENTS: "/api/admin/students",
  TEACHERS: "/api/admin/teachers",
  CLASSES: "/api/admin/classes",
  SUBJECTS: "/api/admin/subjects",
};

const routes = { BASE_URL, PUBLIC_API, ADMIN_API };

export default routes;
