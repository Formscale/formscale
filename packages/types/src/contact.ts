import { z } from "zod";

export const FeedbackSchema = z.object({
  userId: z.string().min(1).optional().default(""),
  email: z.string().email().optional().default(""),
  message: z.string().min(3).max(1000),
  anonymous: z.boolean().optional().default(false),
});

export const ContactSchema = z.object({
  userId: z.string().min(1).optional().default(""),
  name: z.string().min(1),
  email: z.string().email(),
  formId: z.string().min(1).optional().default(""),
  message: z.string().min(3).max(1000),
});

export type Feedback = z.infer<typeof FeedbackSchema>;
export type Contact = z.infer<typeof ContactSchema>;
