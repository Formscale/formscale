import { z } from "zod";

export const schema = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export const schemaValidation = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export type SubmissionSchema = z.infer<typeof schema>;
export type SubmissionValidationSchema = z.infer<typeof schemaValidation>;
