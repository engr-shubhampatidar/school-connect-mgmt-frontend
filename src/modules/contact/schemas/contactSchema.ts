import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
