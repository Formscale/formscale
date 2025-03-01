import { z } from "zod";
import { SafeUserSchema } from "./user";

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  });

export const LoginSchema = z.object({
  email: z.string().email(),
  password: password,
});

export const SignupSchema = z
  .object({
    name: z.string().min(3).max(60),
    email: z.string().email(),
    password: password,
    passwordConfirmation: password,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const OtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d+$/, {
    message: "OTP must be a 6 digit number",
  }),
});

export const ResendOtpSchema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z
  .object({
    password: password,
    passwordConfirmation: password,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: SafeUserSchema,
});

export type Signup = z.infer<typeof SignupSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Otp = z.infer<typeof OtpSchema>;
export type ResendOtp = z.infer<typeof ResendOtpSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
