import db from "@/db";
import { create, findOne, update } from "@/db/crud";
import hasSpam from "@/lib/spam";
import { sendSubmissionEmail } from "@/services/email";
import { uploadFiles } from "@/services/storage";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import { IdSchema, SubmissionStatus, Webhook } from "@formhook/types";
import { Context, Hono } from "hono";
import { z } from "zod";
import logger from "../utils/logs";

function getLocation(ctx: Context): string {
  const cf = ctx.req.raw.cf;

  if (!cf) return "Unknown";

  const location = ["city", "region", "country"].map((key) => cf[key]).filter((value) => value && value !== "XX");
  const timezone = cf.timezone ? ` (${cf.timezone.toString().replace("_", " ")})` : "";

  return location.length !== 0 ? `${location.join(", ")}${timezone}` : "Unknown";
}

async function blockSubmission(ctx: Context, submissionId: string, message?: string, type?: SubmissionStatus) {
  await update(db(ctx.env), "submission", {
    where: { id: submissionId },
    data: {
      status: type || "blocked",
      data: message ? JSON.stringify({ error: message }) : undefined,
    },
  });
}

const submit = new Hono<{ Bindings: Env }>();

let submissionId: string;

export const SubmitController = submit
  .post("/:id", async (ctx) => {
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

      const saveResponses = form.settings.saveResponses;

      const submission = await create(db(ctx.env), "submission", {
        formId,
      });

      submissionId = submission.id;

      if (!form.settings.isPublic) {
        const message = "Form is not active";

        await logger({
          env: ctx.env,
          submissionId,
          message,
          code: 403,
          data: { formId, submissionId },
        });

        await blockSubmission(ctx, submissionId);

        return new Response(ctx).error(message, 403);
      }

      if (form.settings.allowedOrigins.length > 0) {
        if (!form.settings.allowedOrigins.includes("*")) {
          const origin = ctx.req.header("origin");

          const message = origin ? `Form cannot be submitted from ${origin}.` : "Origin is required.";

          if (!origin) {
            await logger({
              env: ctx.env,
              submissionId,
              message,
              code: 400,
              data: { formId, submissionId },
            });

            await blockSubmission(ctx, submissionId);

            // redirect to custom page instead of error?
            return new Response(ctx).error(message, 400);
          }

          const normalizedOrigin = origin?.toLowerCase().trim();
          const normalizedAllowedOrigins = form.settings.allowedOrigins.map((o: string) => o.toLowerCase().trim());

          if (!normalizedAllowedOrigins.includes(normalizedOrigin)) {
            await logger({
              env: ctx.env,
              submissionId,
              message,
              code: 403,
              data: { formId, submissionId, origin },
            });

            await blockSubmission(ctx, submissionId);

            return new Response(ctx).error(message, 403);
          }
        }
      }

      if (!form.settings.allowAnonymous && !getUser(ctx)) {
        const message = "Form is not public";

        await logger({
          env: ctx.env,
          submissionId,
          message,
          code: 403,
          data: { formId, submissionId },
        });

        await blockSubmission(ctx, submissionId);

        return new Response(ctx).error(message, 403);
      }

      await logger({
        env: ctx.env,
        submissionId,
        message: "Submission created",
        data: { formId, submissionId },
      });

      const fileFormData = new FormData();
      const entries = Array.from(formData.entries());

      for (const [key, value] of entries) {
        if (value instanceof File) {
          fileFormData.append(key, value);
        } else if (typeof value === "string") {
          fileFormData.append(key, value);
        } else if ((value as unknown) instanceof Blob) {
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
          await logger({
            env: ctx.env,
            submissionId,
            message: "Validation failed",
            code: 400,
            data: { formId, submissionId, error: err },
          });

          await update(db(ctx.env), "submission", {
            where: { id: submissionId },
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
        const dataString = typeof data === "string" ? data : JSON.stringify(data);
        const spam = hasSpam(dataString);

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

          const message = "Spam detected";

          await logger({
            env: ctx.env,
            submissionId,
            message,
            code: 403,
            data: { formId, submissionId, spam },
          });

          // redirect early

          return new Response(ctx).error(message, 403);
        }
      }

      const fileUploads = await uploadFiles(fileFormData, ctx.env, ctx);
      let uploadedFiles: string[] = [];
      for (const { field, url } of fileUploads) {
        data[field] = url;
        uploadedFiles.push(url);
      }

      if (fileUploads.length > 0) {
        await logger({
          env: ctx.env,
          submissionId,
          message: "Files uploaded",
          data: { formId, submissionId, files: uploadedFiles },
        });
      }

      if (form.settings.webhooks && form.settings.webhooks.length > 0) {
        const webhooks = form.settings.webhooks.filter((webhook: Webhook) => webhook.enabled);

        if (webhooks.length > 0) {
          const results = await Promise.allSettled(
            webhooks.map(async (webhook: Webhook) => {
              try {
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

                const message = response.ok ? "Webhook delivered" : `Webhook failed: ${response.statusText}`;

                await logger({
                  env: ctx.env,
                  submissionId,
                  type: "webhook",
                  message,
                  code: response.status,
                  data: { formId, submissionId, webhookUrl: webhook.url, method: webhook.method },
                });

                if (!response.ok) {
                  return { success: false, url: webhook.url, status: response.status, statusText: response.statusText };
                }

                return { success: true, url: webhook.url };
              } catch (error) {
                const err = error instanceof Error ? error.message : "Unknown error";

                await logger({
                  env: ctx.env,
                  submissionId,
                  type: "webhook",
                  message: `Webhook error`,
                  code: 500,
                  data: {
                    formId,
                    submissionId,
                    webhookUrl: webhook.url,
                    error: err,
                  },
                });

                return {
                  success: false,
                  url: webhook.url,
                  error: err,
                };
              }
            })
          );

          const allFailed = results.every(
            (result) => result.status === "rejected" || (result.status === "fulfilled" && !result.value.success)
          );

          if (allFailed && webhooks.length > 0) {
            await update(db(ctx.env), "submission", {
              where: { id: submissionId },
              data: {
                status: "failed",
                data: JSON.stringify(
                  saveResponses
                    ? { ...data, error: "All webhooks failed" }
                    : { message: "Response not saved", error: "All webhooks failed" }
                ),
              },
            });

            // return early if on production !!!
          }
        }
      }

      const updatedSubmission = await update(db(ctx.env), "submission", {
        where: { id: submission.id },
        data: {
          data: JSON.stringify(saveResponses ? { ...data } : { message: "Response not saved" }),
          location: getLocation(ctx),
          site: ctx.req.header("referer") ? ctx.req.header("referer") : undefined,
          status: form.settings.defaultStatus || "completed",
        },
      });

      if (
        form.settings.emailSettings &&
        form.settings.emailSettings.enabled &&
        form.settings.emailSettings.to.length > 0
      ) {
        const submissionData = {
          ...updatedSubmission,
          data:
            typeof updatedSubmission.data === "string" ? JSON.parse(updatedSubmission.data) : updatedSubmission.data,
        };

        await sendSubmissionEmail(form.settings.emailSettings.to, form, submissionData, ctx.env);
      }

      await update(db(ctx.env), "form", {
        where: { id: formId },
        data: { updatedAt: new Date() },
      });

      // console.log(updatedSubmission);

      const sendJson = ctx.req.header("accept") === "application/json";

      if (form.settings.successUrl) {
        await logger({
          env: ctx.env,
          submissionId,
          message: sendJson
            ? `JSON response sent`
            : `Redirected to ${form.settings.successUrl.replace(/^https?:\/\//, "")}`,
          code: sendJson ? 200 : 302,
          data: { formId, submissionId, url: form.settings.successUrl },
        });

        return sendJson
          ? new Response(ctx).success("Submission created")
          : new Response(ctx).redirect(form.settings.successUrl);
      }

      return sendJson
        ? new Response(ctx).success("Submission created")
        : new Response(ctx).redirect(`${ctx.env.FRONTEND_URL}/success/${updatedSubmission.id}`);
    } catch (err) {
      const message = typeof err === "string" ? err : (err as Error).message || "Unknown error";

      await blockSubmission(ctx, submissionId, message, "failed");

      await logger({
        env: ctx.env,
        submissionId,
        message,
        code: 500,
        data: { error: err },
      });

      console.error(err);
      return new Response(ctx).error(err);
    }
  })
  .get("/:id/click", async (ctx) => {
    // let user = null;
    // try {
    //   user = getUser(ctx);
    // } catch (error) {
    //   // do nothing
    // }

    const submissionId = ctx.req.param("id");
    const submission = await findOne(db(ctx.env), "submission", { where: { id: submissionId } });

    if (!submission) {
      return new Response(ctx).error("Submission not found", 404);
    }

    const origin = ctx.req.header("origin");

    await logger({
      env: ctx.env,
      submissionId,
      message: `Button clicked on ${origin ? origin : "unknown page"}`,
      code: 200,
      // data: { formId: submission.formId, submissionId, userId: user?.id },
      data: { formId: submission.formId, submissionId },
    });

    return new Response(ctx).success("Submission updated");
  });
