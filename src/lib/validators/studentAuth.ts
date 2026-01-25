import * as z from "zod";

export const studentLoginSchema = z.object({
  rollNumber: z
    .string()
    .regex(
      /^[0-9]{1,2}[A-Za-z]-[A-Za-z]{2}-[0-9]{4}$/,
      "Roll number must match pattern (e.g. 1C-AA-8561 or 10K-MY-4822)",
    ),
  password: z.string().min(6),
});

export type StudentLoginSchema = z.infer<typeof studentLoginSchema>;

export default studentLoginSchema;
