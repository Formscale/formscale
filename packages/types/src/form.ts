import { z } from "zod";
import { SubmissionSentSchema } from "./submission";
import { ValidationSchema } from "./validations";

export const HookEnum = z.enum(["webhook", "discord", "email"]);

export const WebhookSchema = z.object({
  type: HookEnum.default("webhook"),
  enabled: z.boolean().default(false),
  url: z.string().url(),
  method: z.enum(["GET", "POST"]).optional().default("POST"),
  secret: z.string().optional(),
  headers: z.record(z.string()).optional().default({}),
});

export const DiscordSchema = WebhookSchema.extend({
  type: z.literal("discord").default("discord"),
  url: z
    .string()
    .url()
    .regex(/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/, "Please enter a valid Discord webhook URL"),
});

export const EmailSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  to: z
    .array(z.string().email({ message: "Please enter a valid email address" }))
    .optional()
    .default([]),
  template: z.enum(["Default", "Custom"]).optional().default("Default"),
  text: z.string().optional(),
});

export const ThemeSchema = z.object({
  name: z.string().optional().default("New Theme"),
  primary: z.string().optional(),
  background: z.string().optional(),
  logo: z.string().optional(),
  icon: z.string().optional(),
  branding: z.boolean().optional().default(true),
});

export const AdminSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "owner"]).default("admin"),
  verified: z.boolean().optional().default(false),
});

export const UTMSettingsSchema = z.object({
  enabled: z.boolean().optional().default(false),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
});

export const FormSettingsSchema = z.object({
  isPublic: z.boolean().optional().default(true),
  allowAnonymous: z.boolean().optional().default(true),
  saveResponses: z.boolean().optional().default(true),
  spamProtection: z.boolean().optional().default(false),
  emailSettings: EmailSettingsSchema.optional().default({}),
  admins: z.array(AdminSchema).optional().default([]),
  theme: ThemeSchema.optional().default({}),
  utm: UTMSettingsSchema.optional().default({}),
  reCaptcha: z
    .string()
    .regex(/^[0-9a-f]{32}$/, "Please enter a valid ReCaptcha site key")
    .optional()
    .or(z.literal("")),
  webhooks: z.array(WebhookSchema).optional().default([]),
  successUrl: z.string().url().optional().or(z.literal("")),
  customDomain: z.string().optional(),
  allowedOrigins: z
    .array(
      z
        .string()
        .refine(
          (origin) => origin === "*" || origin === "null" || /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(origin),
          `Origin must be a valid URL, "*", or blank`
        )
    )
    .optional()
    .default([]),
  validation: ValidationSchema.optional().default({}),
});

export const idString = "23456789abcdefghjkmnpqrstuvwxyz";
export const IdSchema = z.string().regex(new RegExp(`^[${idString}]{8}$`), "Please use a valid form ID");

export const FormSchema = z.object({
  id: IdSchema,
  name: z.string().min(3).max(60),
  settings: FormSettingsSchema,
  development: z.boolean().optional().default(true),
  submissions: z.array(SubmissionSentSchema).optional(),
  updatedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export const CreateFormSchema = z.object({
  name: z.string().min(3).max(60),
});

export const FormEditSchema = FormSchema.omit({
  submissions: true,
  updatedAt: true,
  createdAt: true,
});

export type Form = z.infer<typeof FormSchema>;
export type Id = z.infer<typeof IdSchema>;
export type CreateForm = z.infer<typeof CreateFormSchema>;
export type FormEdit = z.infer<typeof FormEditSchema>;
export type FormSettings = z.infer<typeof FormSettingsSchema>;
export type Webhook = z.infer<typeof WebhookSchema>;
export type Discord = z.infer<typeof DiscordSchema>;
export type EmailSettings = z.infer<typeof EmailSettingsSchema>;
export type Admin = z.infer<typeof AdminSchema>;
