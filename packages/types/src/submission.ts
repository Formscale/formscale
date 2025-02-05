import { z } from "zod";

export const SubmissionSchema = z.object({
  formId: z.string().min(1),
  data: z.any(),
});

export type Submission = z.infer<typeof SubmissionSchema>;
