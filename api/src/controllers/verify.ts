import db from "@/db";
import { findUnique, secureFind } from "@/db/crud";
import Response from "@/utils/response";
import { Admin, TeamPayload } from "@formhook/types";
import { Hono } from "hono";
import { verify as verifyJWT } from "hono/jwt";
import { updateForm } from "./forms";

const verify = new Hono<{ Bindings: Env }>();

export const VerifyController = verify
  .put("/team/:token", async (ctx) => {
    try {
      const { token } = ctx.req.param();

      const decoded = await verifyJWT(token, ctx.env.JWT_SECRET);

      if (!decoded) {
        return new Response(ctx).error("Invalid or expired token. Contact the invitee to get a new one.", 401);
      }

      const { email, formId, invitee } = decoded.data as TeamPayload;

      const form = await secureFind(db(ctx.env), "form", invitee, formId);

      if (!form) {
        return new Response(ctx).error("Form not found or invalid permissions.", 404);
      }

      const emailSettingsTo = form.settings.emailSettings.to;
      const admins = form.settings.admins;

      const admin = admins?.find((admin: Admin) => admin.email === email);

      if (!admin) {
        return new Response(ctx).error("Invitation not found. Contact the invitee to get a new one.", 401);
      }

      if (admin.verified) {
        return new Response(ctx).error("Email already verified.", 400);
      }

      if (!emailSettingsTo.includes(email)) {
        const updatedAdmins = admins?.filter((admin: Admin) => admin.email !== email);

        await updateForm(ctx, form, updatedAdmins, "admins", invitee);

        return new Response(ctx).error("Invitation not found. Contact the invitee to get a new one.", 401);
      }

      const updatedAdmins = admins?.map((admin: Admin) => {
        if (admin.email === email) {
          return { ...admin, verified: true };
        }
        return admin;
      });

      await updateForm(ctx, form, updatedAdmins, "admins", invitee);

      return new Response(ctx).success("Email verified successfully. Submissions will be forwarded to your email.");
    } catch (error) {
      console.error(error);
      return new Response(ctx).error("Error verifying email. Please try again later.", 500);
    }
  })
  .get("/form/:id", async (ctx) => {
    const { id } = ctx.req.param();

    const form = await findUnique(db(ctx.env), "form", { where: { id } });

    if (!form) {
      return new Response(ctx).error("Form not found", 404);
    }

    return new Response(ctx).success({ name: form.name });
  });
