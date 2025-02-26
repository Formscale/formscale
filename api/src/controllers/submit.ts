import db from "@/db";
import { create, findOne, update } from "@/db/crud";
import hasSpam from "@/lib/spam";
import { sendSubmissionEmail } from "@/services/email";
import { uploadFiles } from "@/services/storage";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import { IdSchema, Webhook } from "@formhook/types";
import { Context, Hono } from "hono";
import { z } from "zod";

function getLocation(ctx: Context): string {
  const cf = ctx.req.raw.cf;

  if (!cf) return "Unknown";

  const location = ["city", "region", "country"].map((key) => cf[key]).filter((value) => value && value !== "XX");
  const timezone = cf.timezone ? ` (${cf.timezone.toString().replace("_", " ")})` : "";

  return location.length !== 0 ? `${location.join(", ")}${timezone}` : "Unknown";
}

const submit = new Hono<{ Bindings: Env }>();

export const SubmitController = submit.post("/:id", async (ctx) => {
  // add ip to submission schema
  // and replace updates & stuff with logs

  try {
    const formData = await ctx.req.formData();

    if (!formData) {
      return new Response(ctx).error("Form data is required", 400);
    }

    const formId = ctx.req.param("id");

    if (!IdSchema.safeParse(formId).success) {
      return new Response(ctx).error("Invalid form ID", 400);
    }

    if (!formId) {
      return new Response(ctx).error("Form ID is required", 400);
    }

    const form = await findOne(db(ctx.env), "form", { where: { id: formId } });

    if (!form) {
      return new Response(ctx).error("Form not found", 404);
    }

    if (!form.settings.isPublic) {
      return new Response(ctx).error("Form is not active", 403);
    }

    if (form.settings.allowedOrigins.length > 0) {
      if (!form.settings.allowedOrigins.includes("*")) {
        const origin = ctx.req.header("origin");

        if (!origin) {
          return new Response(ctx).error("Origin is required.", 400);
        }

        const normalizedOrigin = origin?.toLowerCase().trim();
        const normalizedAllowedOrigins = form.settings.allowedOrigins.map((o: string) => o.toLowerCase().trim());

        if (!normalizedAllowedOrigins.includes(normalizedOrigin)) {
          return new Response(ctx).error("Form cannot be submitted from this origin.", 403);
        }
      }
    }

    if (!form.settings.allowAnonymous && !getUser(ctx)) {
      return new Response(ctx).error("Form is not public", 403);
    }

    const saveResponses = form.settings.saveResponses;

    const submission = await create(db(ctx.env), "submission", {
      formId,
    });

    const fileFormData = new FormData();
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      const file = value as unknown as File;
      if (file instanceof File) {
        fileFormData.append(key, value);
      }
    }

    let data: Record<string, any> = {};
    for (const [key, value] of entries) {
      if (data[key] === undefined) {
        const values = formData.getAll(key);
        data[key] = values.length === 1 ? values[0] : values;
      }
    }

    if (form.settings.validation && form.settings.validation.enabled) {
      try {
        const validationSchema = z.object(form.settings.validation);
        const validation = await validationSchema.parseAsync(data);

        data = validation;
      } catch (err) {
        await update(db(ctx.env), "submission", {
          where: { id: submission.id },
          data: {
            data: JSON.stringify(
              saveResponses ? { ...data, error: err } : { message: "Response not saved", error: err }
            ),
            status: "blocked",
          },
        });

        return new Response(ctx).error(err);
      }
    }

    if (form.settings.spamProtection) {
      // check user agent, rate limit ip, check email, check honeypot, check keywords
      // pkgs: hono-rate-limiter, isBot
      // check keywords
      const spam = hasSpam(data);

      if (spam) {
        await update(db(ctx.env), "submission", {
          where: { id: submission.id },
          data: {
            data: JSON.stringify(
              saveResponses
                ? { ...data, error: "Spam detected" }
                : { message: "Response not saved", error: "Spam detected" }
            ),
            status: "blocked",
          },
        });

        return new Response(ctx).error("Spam detected", 403);
      }
    }

    const fileUploads = await uploadFiles(fileFormData, ctx.env, ctx);
    for (const { field, url } of fileUploads) {
      data[field] = url;
    }

    if (form.settings.webhooks && form.settings.webhooks.length > 0) {
      const webhooks = form.settings.webhooks.filter((webhook: Webhook) => webhook.enabled);

      try {
        const results = await Promise.allSettled(
          webhooks.map(async (webhook: Webhook) => {
            const response = await fetch(webhook.url, {
              method: webhook.method,
              ...(webhook.method === "POST" && {
                body: JSON.stringify(data),
              }),
              headers: {
                "Content-Type": "application/json",
                ...(webhook.secret && {
                  Authorization: `Bearer ${webhook.secret}`,
                }),
                ...webhook.headers,
              },
            });

            if (!response.ok) {
              throw new Error(`Webhook failed: ${response.statusText}`);
            }

            return response;
          })
        );
      } catch (err) {
        await update(db(ctx.env), "submission", {
          where: { id: submission.id },
          data: {
            data: JSON.stringify(
              saveResponses ? { ...data, error: err } : { message: "Response not saved", error: err }
            ),
            status: "failed",
          },
        });

        return new Response(ctx).error(err);
      }
    }

    const updatedSubmission = await update(db(ctx.env), "submission", {
      where: { id: submission.id },
      data: {
        data: JSON.stringify(saveResponses ? { ...data } : { message: "Response not saved" }),
        location: getLocation(ctx),
        site: ctx.req.header("referer") ? ctx.req.header("referer") : undefined,
        status: "completed",
      },
    });

    if (
      form.settings.emailSettings &&
      form.settings.emailSettings.enabled &&
      form.settings.emailSettings.to.length > 0
    ) {
      const submissionData = {
        ...updatedSubmission,
        data: typeof updatedSubmission.data === "string" ? JSON.parse(updatedSubmission.data) : updatedSubmission.data,
      };

      await sendSubmissionEmail(form.settings.emailSettings.to, form, submissionData, ctx.env);
    }

    await update(db(ctx.env), "form", {
      where: { id: formId },
      data: { updatedAt: new Date() },
    });

    console.log(updatedSubmission);

    // console.log(
    //   "request",
    //   ctx.req,
    //   ctx.req.url,
    //   ctx.req.header("host"),
    //   ctx.req.header("origin"),
    //   ctx.req.header("referer")
    // );

    if (form.settings.successUrl) {
      return new Response(ctx).redirect(form.settings.successUrl);
    }

    return new Response(ctx).redirect(`${ctx.env.FRONTEND_URL}/success/${updatedSubmission.id}`);
  } catch (err) {
    console.error(err);
    return new Response(ctx).error(err);
  }
});
