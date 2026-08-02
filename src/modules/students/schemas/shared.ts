import { z } from "zod";

/** Indian mobile: exactly 10 digits, starting with 6–9 */
export const MOBILE_REGEX = /^[6-9]\d{9}$/;

export const GENDER_VALUES = ["MALE", "FEMALE", "OTHER"] as const;
export type GenderValue = (typeof GENDER_VALUES)[number];

export const GENDER_OPTIONS = [
  { id: "MALE", name: "Male" },
  { id: "FEMALE", name: "Female" },
  { id: "OTHER", name: "Other" },
] as const;

export const optionalMobile = z
  .string()
  .trim()
  .refine((v) => v === "" || MOBILE_REGEX.test(v), {
    message: "Enter a valid 10-digit mobile number",
  });
