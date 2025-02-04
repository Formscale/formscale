import { z } from "zod";

export const schemaForm = z.object({
  name: z.string().min(3).max(60),
});

export type FormSchema = z.infer<typeof schemaForm>;
