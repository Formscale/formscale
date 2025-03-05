import db from "@/db";
import { secureDeleteLinked, secureFind, secureFindMany, update } from "@/db/crud";
import validator from "@/middleware/validation";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import { EditStatusSchema } from "@formscale/types";
import { Hono } from "hono";
import logger from "../utils/logs";

const submissions = new Hono<{ Bindings: Env }>();

export const SubmissionsController = submissions
  .get("/:id", async (ctx) => {
    const { id } = ctx.req.param();
    const user = getUser(ctx);

    const submission = await secureFind(db(ctx.env), "submission", user.id, id, {
      include: {
        logs: true,
      },
    });

    if (!submission) {
      return new Response(ctx).error("Submission not found", 404);
    }

    return new Response(ctx).success({ submission });
  })
  .get("/:id/all", async (ctx) => {
    const { id } = ctx.req.param();
    const user = getUser(ctx);

    const submissions = await secureFindMany(db(ctx.env), "submission", user.id, {
      where: { formId: id },
      include: {
        logs: true,
      },
    });

    if (!submissions) {
      return new Response(ctx).error("Submissions not found", 404);
    }

    return new Response(ctx).success({ submissions });
  })
  .put(
    "/:id/status",
    validator(EditStatusSchema, (error, ctx) => {
      return new Response(ctx).error(error);
    }),
    async (ctx) => {
      const { id } = ctx.req.param();
      const user = getUser(ctx);
      const { status } = await ctx.req.json();

      const submission = await secureFindMany(db(ctx.env), "form", user.id, {
        where: { submissions: { some: { id } } },
      });

      if (!submission) {
        return new Response(ctx).error("Submission not found or you don't have permission to edit it.", 404);
      }

      await update(db(ctx.env), "submission", {
        where: { id },
        data: { status },
      });

      await logger({
        env: ctx.env,
        submissionId: id,
        message: `Submission status updated to ${status}`,
        data: { status },
      });

      return new Response(ctx).success({ message: "Submission status updated" });
    }
  )
  .delete("/:id/delete", async (ctx) => {
    try {
      const { id } = ctx.req.param();
      const user = getUser(ctx);

      await secureDeleteLinked(db(ctx.env), "submission", "form", user.id, id);

      // await logger({
      //   env: ctx.env,
      //   submissionId: id,
      //   message: `Submission deleted`,
      //   data: { id },
      // });

      return new Response(ctx).success({ message: "Submission deleted" });
    } catch (error) {
      console.error(error);
      return new Response(ctx).error("Failed to delete submission.", 500);
    }
  });
