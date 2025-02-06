import { z } from "zod";

export const SubmissionSchema = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export const SubmissionSentSchema = z.object({
  id: z.string().min(1),
  formId: z.string().min(1),
  data: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionSent = z.infer<typeof SubmissionSentSchema>;
