import { z } from "zod";
const MAX_FILE_SIZE = 1024 * 1024 * 10;

export const BaseFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().default(false),
});

export const TextSchema = BaseFieldSchema.extend({
  type: z.literal("text"),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
});

export const NumberSchema = BaseFieldSchema.extend({
  type: z.literal("number"),
  min: z.number().optional(),
  max: z.number().optional(),
});

export const EmailSchema = BaseFieldSchema.extend({
  type: z.literal("email"),
  allowedDomains: z.array(z.string().url()).optional().default([]),
});

export const DateSchema = BaseFieldSchema.extend({
  type: z.literal("date"),
  min: z.string().optional(),
  max: z.string().optional(),
});

export const UrlSchema = BaseFieldSchema.extend({
  type: z.literal("url"),
  allowedDomains: z.array(z.string()).optional().default([]),
});

export const TelSchema = BaseFieldSchema.extend({
  type: z.literal("tel"),
  format: z.string().optional(),
  allowedCountries: z.array(z.string()).optional().default([]),
});

export const CheckboxSchema = BaseFieldSchema.extend({
  type: z.literal("checkbox"),
  options: z.array(z.string()),
  minSelected: z.number().optional(),
  maxSelected: z.number().optional(),
});

export const SelectSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  options: z.array(z.string()),
  multiple: z.boolean().default(false),
  minSelected: z.number().optional(),
  maxSelected: z.number().optional(),
});

export const FileSchema = BaseFieldSchema.extend({
  type: z.literal("file"),
  acceptedTypes: z.array(z.string()).default([]),
  maxSize: z.number().max(MAX_FILE_SIZE).optional(),
  maxFiles: z.number().optional(),
});

export const FieldSchema = z.discriminatedUnion("type", [
  TextSchema,
  NumberSchema,
  EmailSchema,
  DateSchema,
  UrlSchema,
  TelSchema,
  CheckboxSchema,
  SelectSchema,
  FileSchema,
]);

export const ValidationSchema = z.object({
  enabled: z.boolean().default(false),
  explicit: z.boolean().default(false),
  template: z.enum(["Custom", "Contact", "Feedback", "Support", "Registration"]).default("Custom"),
  fields: z.array(FieldSchema).default([]),
  schema: z.any().default({}),
});

export type BaseField = z.infer<typeof BaseFieldSchema>;
export type Text = z.infer<typeof TextSchema>;
export type Number = z.infer<typeof NumberSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Date = z.infer<typeof DateSchema>;
export type Url = z.infer<typeof UrlSchema>;
export type Tel = z.infer<typeof TelSchema>;
export type Checkbox = z.infer<typeof CheckboxSchema>;
export type Select = z.infer<typeof SelectSchema>;
export type File = z.infer<typeof FileSchema>;
export type Field = z.infer<typeof FieldSchema>;
export type Validation = z.infer<typeof ValidationSchema>;
