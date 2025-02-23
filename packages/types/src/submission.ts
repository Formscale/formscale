import { z } from "zod";

export const SubmissionStatusSchema = z.enum(["pending", "completed", "failed", "blocked"]);

export const SubmissionSchema = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export const SubmissionSentSchema = z.object({
  id: z.string().min(1),
  formId: z.string().min(1),
  data: z.any(),
  status: SubmissionStatusSchema.default("pending"),
  updatedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionSent = z.infer<typeof SubmissionSentSchema>;
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;
