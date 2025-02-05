import { z } from "zod";

export const AuthSettingsSchema = z.object({
  tokenExpiry: z.number().default(3600),
  maxLoginAttempts: z.number().default(3),
});

export const LoginSchema = z.object({
  email: z.string().min(3).max(60).email(),
  password: z
    .string()
    .min(8)
    .regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
});

export const RegisterSchema = z
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

export const OtpSchema = z.object({
  otp: z.string().length(6).regex(/^\d+$/, {
    message: "OTP must be a number",
  }),
});

export type AuthSettings = z.infer<typeof AuthSettingsSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Otp = z.infer<typeof OtpSchema>;
