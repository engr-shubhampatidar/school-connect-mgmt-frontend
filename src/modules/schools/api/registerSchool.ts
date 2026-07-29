import { PUBLIC_API } from "@/config/api-routes";
import API from "@/services/axios";

export interface RegisterSchoolPayload {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolType: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  adminMobile: string;
  date_of_birth: string;
}

export async function registerSchool(payload: RegisterSchoolPayload) {
  const res = await API.post(PUBLIC_API.REGISTER_SCHOOL, payload);
  return res.data;
}
