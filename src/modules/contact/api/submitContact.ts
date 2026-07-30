import API from "@/services/axios";
import { PUBLIC_API } from "@/config/api-routes";
import type { ContactInput } from "../schemas/contactSchema";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export async function submitContact(values: ContactInput) {
  const payload: ContactPayload = {
    name: values.name,
    email: values.email,
    phone: values.phone || "",
    message: values.message || "",
  };
  const res = await API.post(PUBLIC_API.CONTACT, payload);
  return res.data;
}
