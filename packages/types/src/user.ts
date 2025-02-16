import { z } from "zod";
import { SubscriptionTier } from "./subscription";

export enum Roles {
  ADMIN = "admin",
  USER = "user",
  DEMO = "demo",
}

export const EditUserSchema = z.object({
  name: z.string().min(3).max(60),
  email: z.string().min(3).max(60).email(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(60),
  email: z.string().min(3).max(60).email(),
  role: z.nativeEnum(Roles).default(Roles.USER),
  subscriptionTier: z.nativeEnum(SubscriptionTier).default(SubscriptionTier.FREE),
  verified: z.boolean().default(false),
});

export type User = z.infer<typeof UserSchema>;
export type EditUser = z.infer<typeof EditUserSchema>;
