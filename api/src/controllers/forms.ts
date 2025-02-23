import db from "@/db";
import { create, findOne, secureFind, secureFindMany, secureUpdate } from "@/db/crud";
import validator from "@/middleware/validation";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import { CreateFormSchema, FormSchema } from "@formhook/types";
import { Hono } from "hono";
import { customAlphabet } from "nanoid";

const generateId = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 8);

const forms = new Hono<{ Bindings: Env }>();

export const FormController = forms
  .post(
    "/create",
    validator(CreateFormSchema, (error, ctx) => {
      return new Response(ctx).error(error);
    }),
    async (ctx) => {
      const { name } = await ctx.req.json();
      const user = getUser(ctx);

      const existingForm = await findOne(db(ctx.env), "form", { where: { name, userId: user.id } });

      if (existingForm) {
        return new Response(ctx).error(`Form named "${existingForm.name}" already exists in this account.`, 400);
      }

      const form = await create(db(ctx.env), "form", {
        id: generateId(),
        name,
        userId: user.id,
      });

      console.log(form);

      return new Response(ctx).success({ form });
    }
  )
  .get("/all", async (ctx) => {
    const user = getUser(ctx);

    const forms = await secureFindMany(db(ctx.env), "form", user.id);

    if (!forms) {
      return new Response(ctx).error("No forms found. Create a new form to get started.", 404);
    }

    return new Response(ctx).success({ forms });
  })
  .get("/:id", async (ctx) => {
    const user = getUser(ctx);
    const { id } = ctx.req.param();

    const form = await secureFind(db(ctx.env), "form", user.id, id);

    return new Response(ctx).success({ form });
  })
  .put(
    "/:id/edit",
    validator(FormSchema, (error, ctx) => {
      return new Response(ctx).error(error);
    }),
    async (ctx) => {
      const user = getUser(ctx);
      const { id } = ctx.req.param();
      const { ...form } = await ctx.req.json();

      const formData = {
        ...form,
        settings: JSON.stringify(form.settings),
      };

      const updatedForm = await secureUpdate(db(ctx.env), "form", user.id, id, formData);

      return new Response(ctx).success({ form: updatedForm });
    }
  );
