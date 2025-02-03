import { z } from "zod";

export const schemaLogin = z.object({
  email: z.string().min(3).max(60).email(),
  password: z
    .string()
    .min(8)
    .regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
});

export const schemaRegister = z
  .object({
    name: z.string().min(3).max(60),
    email: z.string().min(3).max(60).email(),
    password: z
      .string()
      .min(8)
      .regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), {
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const schemaOtpVerify = z.object({
  otp: z.string().length(6).regex(/^\d+$/, {
    message: "OTP must be a number",
  }),
});

export type RegisterSchema = z.infer<typeof schemaRegister>;
export type LoginSchema = z.infer<typeof schemaLogin>;
export type OtpVerifySchema = z.infer<typeof schemaOtpVerify>;
