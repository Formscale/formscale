import { zValidator } from "@hono/zod-validator";
import { Context } from "hono";
import { ZodSchema } from "zod";

function validator<T>(schema: ZodSchema<T>, errorResponse: (error: any, ctx: Context) => void) {
  return zValidator("json", schema, (result, ctx) => {
    if (!result.success) {
      return errorResponse(result.error, ctx);
    }
  });
}

export default validator;
