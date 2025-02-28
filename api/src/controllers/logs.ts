import db from "@/db";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import { Form, SubmissionSent } from "@formhook/types";
import { Hono } from "hono";
import { findMany, secureFind, secureFindMany } from "../db/crud";

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

    const logs = await findMany(db(ctx.env), "log", {
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

    const submission = await secureFind(db(ctx.env), "submission", user.id, id, {
      where: {
        id,
        form: {
          userId: user.id,
          development: user.development,
        },
      },
      include: { form: true },
    });

    if (!submission) {
      return new Response(ctx).error("Submission not found");
    }

    const logs = await findMany(db(ctx.env), "log", {
      where: {
        submissionId: id,
      },
    });

    return new Response(ctx).success({ logs });
  });
