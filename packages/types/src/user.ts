import { z } from "zod";
import { SubscriptionTier } from "./subscription";

export enum Roles {
  ADMIN = "admin",
  USER = "user",
  DEMO = "demo",
}

export const EditUserSchema = z.object({
  name: z.string().min(3).max(60),
  email: z.string().email(),
  development: z.boolean().default(true),
  twoFactor: z.boolean().default(false),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().min(3).max(60).email(),
  name: z.string().min(3).max(60),
  password: z.string(),
  role: z.nativeEnum(Roles).default(Roles.USER),
  verified: z.boolean().default(false),
  otp: z.string().optional(),
  otpExpiry: z.date().optional(),
  attempts: z.number().default(3),
  twoFactor: z.boolean().default(false),
  development: z.boolean().default(true),
  stripeCustomerId: z.string().optional(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).default(SubscriptionTier.FREE),
  stripeSubscriptionId: z.string().optional(),
  updatedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export const SafeUserSchema = UserSchema.omit({
  password: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  otp: true,
  otpExpiry: true,
  attempts: true,
  updatedAt: true,
});

export type User = z.infer<typeof UserSchema>;
export type EditUser = z.infer<typeof EditUserSchema>;
export type SafeUser = z.infer<typeof SafeUserSchema>;
