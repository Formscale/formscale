import { z } from "zod";

export const MAX_FILE_SIZE = 1024 * 1024 * 10;
export enum FILE_TYPES {
  PNG = "image/png",
  JPEG = "image/jpeg",
  GIF = "image/gif",
  HEIC = "image/heic",
  HEIF = "image/heif",
  MP4 = "video/mp4",
  MP3 = "audio/mpeg",
  M4A = "audio/mp4",
  OGG = "audio/ogg",
  WAV = "audio/wav",
  AAC = "audio/aac",
  WEBM = "video/webm",
  WEBP = "image/webp",
  PDF = "application/pdf",
  DOC = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLS = "application/vnd.ms-excel",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  TXT = "text/plain",
  CSV = "text/csv",
  ZIP = "application/zip",
}

export enum TEMPLATES {
  CUSTOM = "Custom",
  CONTACT = "Contact",
  WAITLIST = "Waitlist",
  EMAIL = "Email",
  FEEDBACK = "Feedback",
}

export const BaseFieldSchema = z.object({
  id: z.string().optional().default(""),
  name: z.string().optional().default(""),
  placeholder: z.string().optional().default(""),
  description: z.string().optional().default(""),
  required: z.boolean().default(false),
});

export const TextSchema = BaseFieldSchema.extend({
  type: z.literal("text"),
  min: z.number().min(0, "Minimum value cannot be less than 0").optional(),
  max: z.number().min(0, "Maximum value cannot be less than 0").optional(),
});

export const NumberSchema = BaseFieldSchema.extend({
  type: z.literal("number"),
  min: z.number().min(0, "Minimum value cannot be less than 0").optional(),
  max: z.number().min(0, "Maximum value cannot be less than 0").optional(),
});

export const EmailSchema = BaseFieldSchema.extend({
  type: z.literal("email"),
  allowedDomains: z.array(z.string().url()).optional().default([]),
});

export const DateSchema = BaseFieldSchema.extend({
  type: z.literal("date"),
  min: z.number().min(0, "Minimum value cannot be less than 0").optional(),
  max: z.number().min(0, "Maximum value cannot be less than 0").optional(),
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
  minSelected: z.number().min(0, "Minimum selected value cannot be less than 0").optional(),
  maxSelected: z.number().min(0, "Maximum selected value cannot be less than 0").optional(),
});

export const SelectSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  options: z.array(z.string()),
  multiple: z.boolean().default(false),
  minSelected: z.number().min(0, "Minimum selected value cannot be less than 0").optional(),
  maxSelected: z.number().min(0, "Maximum selected value cannot be less than 0").optional(),
});

export const FileSchema = BaseFieldSchema.extend({
  type: z.literal("file"),
  acceptedTypes: z
    .array(z.nativeEnum(FILE_TYPES))
    .default([
      FILE_TYPES.PNG,
      FILE_TYPES.JPEG,
      FILE_TYPES.GIF,
      FILE_TYPES.PDF,
      FILE_TYPES.TXT,
      FILE_TYPES.CSV,
      FILE_TYPES.ZIP,
    ]),
  maxSize: z.number().max(MAX_FILE_SIZE).optional(),
  maxFiles: z.number().min(0, "Maximum files cannot be less than 0").optional(),
});

export const HoneypotSchema = BaseFieldSchema.extend({
  type: z.literal("honeypot"),
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
  HoneypotSchema,
]);

export const ValidationSchema = z.object({
  enabled: z.boolean().default(false),
  explicit: z.boolean().default(false),
  template: z.nativeEnum(TEMPLATES).default(TEMPLATES.CUSTOM),
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
export type Honeypot = z.infer<typeof HoneypotSchema>;
export type Field = z.infer<typeof FieldSchema>;
export type Validation = z.infer<typeof ValidationSchema>;
