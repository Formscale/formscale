import { z } from "zod";
import { SubmissionSentSchema } from "./submission";

export const WebhookSchema = z.object({
  type: z.enum(["webhook", "discord", "slack"]).default("webhook"),
  enabled: z.boolean().default(false),
  url: z.string().url().default(""),
  method: z.enum(["GET", "POST"]).optional().default("POST"),
  secret: z.string().optional().default(""),
  headers: z.record(z.string()).optional().default({}),
});

export const DiscordSchema = WebhookSchema.extend({
  type: z.literal("discord").default("discord"),
  url: z
    .string()
    .url()
    .regex(/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/, "Please enter a valid Discord webhook URL")
    .default(""),
});

export const ValidationSchema = z.object({
  enabled: z.boolean().default(false),
  schema: z.any().default({}),
});

export const EmailSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  to: z
    .array(z.string().email({ message: "Please enter a valid email address" }))
    .optional()
    .default([]),
  template: z.enum(["Default", "Custom"]).optional().default("Default"),
  theme: z
    .object({
      primary: z.string().default("#000000"),
      background: z.string().default("#FFFFFF"),
      logo: z.string().default(""),
      icon: z.string().default(""),
      text: z.string().default(""),
    })
    .optional(),
});

export const AdminSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "owner"]).default("admin"),
});

export const UTMSettingsSchema = z.object({
  enabled: z.boolean().optional().default(false),
  source: z.string().optional().default(""),
  medium: z.string().optional().default(""),
  campaign: z.string().optional().default(""),
});

export const FormSettingsSchema = z.object({
  isPublic: z.boolean().optional().default(true),
  allowAnonymous: z.boolean().optional().default(true),
  spamProtection: z.boolean().optional().default(false),
  emailSettings: EmailSettingsSchema.optional().default({}),
  admins: z.array(AdminSchema).optional().default([]),
  utm: UTMSettingsSchema.optional().default({}),
  reCaptcha: z
    .string()
    .regex(/^[0-9a-f]{32}$/, "Please enter a valid ReCaptcha site key")
    .optional()
    .default(""),
  webhooks: z.array(WebhookSchema).optional().default([]),
  successUrl: z.string().url().optional().default(""),
  customDomain: z.string().optional().default(""),
  allowedOrigins: z.array(z.string()).optional().default([]),
  validation: ValidationSchema.optional(),
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
export type Webhook = z.infer<typeof WebhookSchema>;
export type Discord = z.infer<typeof DiscordSchema>;
export type EmailSettings = z.infer<typeof EmailSettingsSchema>;
export type Admin = z.infer<typeof AdminSchema>;
export type Validation = z.infer<typeof ValidationSchema>;
