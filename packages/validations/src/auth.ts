import { z } from "zod";

export const schemaLogin = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const schemaRegister = z
  .object({
    name: z.string().min(3).max(60),
    email: z.string().min(3).max(60),
    password: z
      .string()
      .min(8)
      .regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), {
        message:
          "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type RegisterSchema = z.infer<typeof schemaRegister>;
