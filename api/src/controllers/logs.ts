import db from "@/db";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import { Form, SubmissionSent } from "@formhook/types";
import { Hono } from "hono";
import { findMany, secureFindMany } from "../db/crud";

const logs = new Hono<{ Bindings: Env }>();

export const LogsController = logs
  .get("/all", async (ctx) => {
    const user = getUser(ctx);

    const development = user.development;

    const forms = await secureFindMany(db(ctx.env), "form", user.id, {
      where: {
        development,
      },
      include: {
        submissions: true,
      },
    });

    if (!forms) {
      return new Response(ctx).error("Forms not found", 404);
    }

    const logs = await findMany(db(ctx.env), "logs", {
      where: {
        submissionId: {
          in: forms.flatMap((form: Form) => form.submissions?.map((submission: SubmissionSent) => submission.id)),
        },
      },
    });

    return new Response(ctx).success({ logs });
  })
  .get("/submissions/:id", async (ctx) => {
    const user = getUser(ctx);

    const development = user.development;

    const { id } = ctx.req.param();

    const forms = await secureFindMany(db(ctx.env), "form", user.id, {
      where: {
        development,
      },
      include: {
        submissions: true,
      },
    });

    const submission = forms.flatMap((form: Form) =>
      form.submissions?.find((submission: SubmissionSent) => submission.id === id)
    );

    if (!submission) {
      return new Response(ctx).error("Submission not found");
    }

    const logs = await findMany(db(ctx.env), "logs", {
      where: {
        submissionId: submission.id,
      },
    });

    return new Response(ctx).success({ logs });
  });
