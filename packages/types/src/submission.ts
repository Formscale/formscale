import { z } from "zod";

export const SubmissionStatusSchema = z.enum(["pending", "completed", "failed"]);

export const SubmissionSchema = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export const SubmissionSentSchema = z.object({
  id: z.string().min(1),
  formId: z.string().min(1),
  data: z.any(),
  status: SubmissionStatusSchema.default("pending"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionSent = z.infer<typeof SubmissionSentSchema>;
