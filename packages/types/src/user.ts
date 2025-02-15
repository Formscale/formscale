import { z } from "zod";

export enum SubscriptionTier {
  FREE = "free",
  PRO = "pro",
  BUSINESS = "business",
  ENTERPRISE = "enterprise",
  TEAM = "team",
}

export enum Roles {
  ADMIN = "admin",
  USER = "user",
}

export const TierLimitsSchema = z.object({
  maxForms: z.number(),
  maxSubmissionsPerMonth: z.number(),
});

export const UsageSchema = z.object({
  forms: z.number(),
  submissions: z.number(),
});

export const EditUserSchema = z.object({
  name: z.string().min(3).max(60),
  email: z.string().min(3).max(60).email(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(60),
  email: z.string().min(3).max(60).email(),
  role: z.nativeEnum(Roles),
  subscriptionTier: z.nativeEnum(SubscriptionTier),
  verified: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
export type EditUser = z.infer<typeof EditUserSchema>;
export type TierLimits = z.infer<typeof TierLimitsSchema>;
export type Usage = z.infer<typeof UsageSchema>;
