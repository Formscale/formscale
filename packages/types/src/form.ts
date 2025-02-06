import { z } from "zod";
import { SubmissionSentSchema } from "./submission";

export const FormSettingsSchema = z.object({
  isPublic: z.boolean().optional().default(true),
  allowAnonymous: z.boolean().optional().default(true),
  emailNotifications: z
    .object({
      enabled: z.boolean().default(true),
      to: z.array(z.string()).optional().default([]),
      template: z.string().optional().default(""),
    })
    .optional(),
  admins: z.array(z.string()).optional().default([]),
  reCaptcha: z
    .object({
      enabled: z.boolean().default(false),
      siteKey: z.string().optional().default(""),
    })
    .optional(),
  webhook: z
    .object({
      enabled: z.boolean().default(false),
      url: z.string().url().optional().default(""),
      method: z.enum(["GET", "POST"]).optional().default("POST"),
      secret: z.string().optional().default(""),
      headers: z.record(z.string()).optional().default({}),
    })
    .optional(),
  successUrl: z.string().url().optional().default(""),
  customDomain: z.string().optional().default(""),
  allowedOrigins: z.array(z.string()).optional().default([]),
  validation: z
    .object({
      enabled: z.boolean().default(false),
      schema: z.any().default({}),
    })
    .optional(),
  theme: z
    .object({
      primary: z.string().default("#000000"),
      background: z.string().default("#FFFFFF"),
      logo: z.string().default(""),
      icon: z.string().default(""),
    })
    .optional(),
});

export const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(60),
  settings: FormSettingsSchema,
  submissions: z.array(SubmissionSentSchema),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export const CreateFormSchema = z.object({
  name: z.string().min(3).max(60),
});

export type Form = z.infer<typeof FormSchema>;
export type CreateForm = z.infer<typeof CreateFormSchema>;
export type FormSettings = z.infer<typeof FormSettingsSchema>;
