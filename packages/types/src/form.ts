import { z } from "zod";
import { SubmissionSchema } from "./submission";

export const FormSettingsSchema = z.object({
  isPublic: z.boolean().optional(),
  allowAnonymous: z.boolean().optional(),
  emailNotifications: z
    .object({
      enabled: z.boolean(),
      to: z.array(z.string()).optional(),
      template: z.string().optional(),
    })
    .optional(),
  admins: z.array(z.string()).optional(),
  reCaptcha: z
    .object({
      enabled: z.boolean(),
      siteKey: z.string().optional(),
    })
    .optional(),
  webhook: z
    .object({
      enabled: z.boolean(),
      url: z.string().url().optional(),
      method: z.enum(["GET", "POST"]).optional(),
      headers: z.record(z.string()).optional(),
    })
    .optional(),
  successUrl: z.string().url().optional(),
  customDomain: z.string().optional(),
  validation: z
    .object({
      enabled: z.boolean(),
      schema: z.any(),
    })
    .optional(),
  theme: z
    .object({
      primary: z.string(),
      background: z.string(),
      logo: z.string(),
      icon: z.string(),
    })
    .optional(),
});

export const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(60),
  userId: z.string(),
  settings: FormSettingsSchema,
  submissions: z.array(SubmissionSchema),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export const CreateFormSchema = z.object({
  name: z.string().min(3).max(60),
});

export type Form = z.infer<typeof FormSchema>;
export type CreateForm = z.infer<typeof CreateFormSchema>;
export type FormSettings = z.infer<typeof FormSettingsSchema>;
