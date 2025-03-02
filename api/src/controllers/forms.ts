import db from "@/db";
import { create, findOne, secureDelete, secureFind, secureFindMany, secureUpdate } from "@/db/crud";
import validator from "@/middleware/validation";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import {
  Admin,
  CreateFormSchema,
  EmailSettings,
  Field,
  Form,
  FormEditSchema,
  FormSettings,
  idString,
  SafeUser,
  ValidationSchema,
  Webhook,
} from "@formhook/types";
import { createFormSchema } from "@formhook/utils";
import { Context, Hono } from "hono";
import { customAlphabet } from "nanoid";

async function getForm(ctx: Context, user: SafeUser, id: string) {
  const currentForm = await findOne(db(ctx.env), "form", {
    where: { id, userId: user.id, development: user.development },
  });

  if (!currentForm) {
    throw new Error("Form not found.");
  }

  return currentForm;
}

async function updateForm(
  ctx: Context,
  currentForm: Form,
  data: EmailSettings | Webhook[] | FormSettings,
  settingKey?: "validation" | "emailSettings"
) {
  let settings;

  if (settingKey) {
    settings = {
      ...currentForm.settings,
      [settingKey]: data,
    };
  } else {
    settings = data;
  }

  const formData = {
    ...currentForm,
    settings: JSON.stringify(settings),
  };

  const updatedForm = await secureUpdate(db(ctx.env), "form", getUser(ctx).id, currentForm.id, formData, {
    include: { submissions: true },
  });

  return new Response(ctx).success({ form: updatedForm });
}

const generateId = customAlphabet(idString, 8);

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

      const existingForm = await findOne(db(ctx.env), "form", {
        where: { name, userId: user.id, development: user.development },
      });

      if (existingForm) {
        return new Response(ctx).error(`Form named "${existingForm.name}" already exists in this account.`, 400);
      }

      const form = await create(db(ctx.env), "form", {
        id: generateId(),
        name,
        development: user.development,
        userId: user.id,
      });

      console.log(form);

      return new Response(ctx).success({ form });
    }
  )
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

    if (forms.length === 0) {
      return new Response(ctx).error(
        `No forms found in ${development ? "development" : "production"}. Create a new form to get started.`,
        404
      );
    }

    return new Response(ctx).success({ forms });
  })
  .get("/:id", async (ctx) => {
    const user = getUser(ctx);
    const { id } = ctx.req.param();

    const form = await secureFind(db(ctx.env), "form", user.id, id, {
      include: {
        submissions: true,
      },
    });

    if (!form) {
      return new Response(ctx).error("Form not found.", 404);
    }

    return new Response(ctx).success({ form });
  })
  .put(
    "/:id/edit",
    validator(FormEditSchema, (error, ctx) => {
      return new Response(ctx).error(error);
    }),
    async (ctx) => {
      try {
        const user = getUser(ctx);
        const { id } = ctx.req.param();
        const { ...form } = await ctx.req.json();

        const currentForm = await getForm(ctx, user, id);

        if (form.name && form.name !== currentForm.name) {
          const existingForm = await findOne(db(ctx.env), "form", {
            where: { name: form.name, userId: user.id, id: { not: id } },
          });

          if (existingForm) {
            return new Response(ctx).error(`Form named "${form.name}" already exists in this account.`, 400);
          }
        }

        // require allowed origins if in production

        if (form.settings.isPublic && !form.development) {
          const allowedOrigins = form.settings.allowedOrigins;

          if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
            const type = allowedOrigins.includes("*") ? "non-wildcard " : "";

            return new Response(ctx).error(`Must set ${type}allowed origins to accept submissions in production.`, 400);
          }
        }

        // check if emailsettings were changed and do validation stuff

        if (form.settings.emailSettings && form.settings.emailSettings.enabled) {
          const emailSettings = form.settings.emailSettings;

          if (emailSettings.to.length === 0) {
            return new Response(ctx).error("Email recipients cannot be empty.", 400);
          }

          const validEmails = [user.email, ...(form.settings.admins?.map((admin: Admin) => admin.email) || [])];

          const unverifiedEmails = emailSettings.to.filter((email: string) => !validEmails.includes(email));

          if (unverifiedEmails.length > 0) {
            const newAdmins = unverifiedEmails.map((email: string) => ({
              email,
              role: "admin" as const,
              verified: false,
            }));

            form.settings.admins = [...(form.settings.admins || []), ...newAdmins];

            console.log("sending email(s) to ", unverifiedEmails.join(", "));

            // send verification email
            // create route to add admins
            // update form with admins via email link to confirm
          }
        }

        // prevent user from editing id, admins, etc

        return updateForm(ctx, form, form.settings);
      } catch (error) {
        return new Response(ctx).error(error);
      }
    }
  )
  .put(
    "/:id/edit/validation",
    validator(ValidationSchema, (error, ctx) => {
      return new Response(ctx).error(error);
    }),
    async (ctx) => {
      try {
        const user = getUser(ctx);
        const { id } = ctx.req.param();
        const validation = await ctx.req.json();

        const currentForm = await getForm(ctx, user, id);

        // filter out honeypot fields?

        validation.fields.map((field: Field) => {
          const name = field.name;

          if (!name) {
            return new Response(ctx).error(`Field name for "${field.type}" cannot be empty.`, 400);
          }

          field.id = `formscale-${name.replace(/\s+/g, "_").toLowerCase()}`;
        });

        console.log(validation);

        const validationFields = validation.fields.filter((field: Field) => field.type !== "honeypot");
        const currentValidationFields = currentForm.settings.validation.fields.filter(
          (field: Field) => field.type !== "honeypot"
        );

        if (validationFields.length > 0 && validationFields !== currentValidationFields) {
          try {
            const schema = createFormSchema(validationFields);

            validation.schema = schema;
          } catch (error) {
            return new Response(ctx).error(error);
          }
        }

        return updateForm(ctx, currentForm, validation, "validation");
      } catch (error) {
        return new Response(ctx).error(error);
      }
    }
  )
  .delete("/:id/delete", async (ctx) => {
    try {
      const user = getUser(ctx);
      const { id } = ctx.req.param();

      await secureDelete(db(ctx.env), "form", user.id, id);

      return new Response(ctx).success({ message: "Form deleted successfully." });
    } catch (error) {
      return new Response(ctx).error(error as Error);
    }
  });
