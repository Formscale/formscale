import { z } from "zod";

export const schemaSubmission = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export const schemaValidation = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export type SubmissionSchema = z.infer<typeof schemaSubmission>;
export type SubmissionValidationSchema = z.infer<typeof schemaValidation>;
