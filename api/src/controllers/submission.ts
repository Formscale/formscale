import App from "@/app";
import validator from "@/middleware/validation";
import Response from "@/utils/response";
import db from "@/db";
import { schema, schemaValidation } from "../validations/submission";

export const SubmissionController = App.basePath("/").post(
  ":id",
  validator(schema, (error, ctx) => {
    return new Response(ctx).error(error);
  }),
  async (ctx) => {
    const { id } = ctx.req.param();
    const formData = await ctx.req.formData();

    if (!id) {
      return new Response(ctx).error("Form ID is required", 400);
    }

    const form = await db(ctx.env).form.findUnique({
      where: { id },
    });

    if (!form) {
      return new Response(ctx).error("Form not found", 404);
    }

    if (form.settings.validation.enabled) {
      const validation = schemaValidation.safeParse(formData);
      if (!validation.success) {
        return new Response(ctx).error(validation.error.message, 400);
      }
    }

    const submission = await db(ctx.env).submission.create({
      data: {
        formId: id,
        data: formData,
      },
    });

    return new Response(ctx).success(submission);
  }
);
