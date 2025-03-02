"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { useForm as useFormProvider } from "@/providers/form";
import { Form, FormEdit, Webhook, WebhookSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parseForm } from "./page";

export async function updateWebhook(
  webhook: Webhook,
  formContext: Form,
  updateForm: (form: FormEdit) => Promise<void>
) {
  const formEdit = parseForm(formContext!);

  const form = {
    ...formEdit,
    settings: {
      ...formEdit.settings,
      webhooks: [...formEdit.settings.webhooks.filter((w) => w.type !== webhook.type), webhook],
    },
  };

  await updateForm(form);
}

export default function WebhookEditDialog(webhook: Webhook) {
  const { updateForm, form: formContext, isLoading } = useFormProvider();

  const form = useForm<Webhook>({
    resolver: zodResolver(WebhookSchema),
    defaultValues: {
      ...webhook,
      enabled: webhook.enabled,
    },
  });

  if (!webhook) return null;

  // console.log(form.formState.errors);

  async function onSubmit(values: Webhook) {
    await updateWebhook(values, formContext!, updateForm);
  }

  const fields = [
    { name: "url", type: "text", description: "URL", placeholder: "https://api.formscale.dev/hooks" },
    { name: "method", type: "select", description: "Method", placeholder: "POST", options: ["POST", "GET"] },
    { name: "secret", type: "text", description: "Signing Secret (optional)", placeholder: "MY-SECRET" },
    // {
    //   name: "headers",
    //   type: "textarea",
    //   description: "Headers (optional)",
    //   placeholder: '"Content-Type": "application/json"',
    // },
    { name: "enabled", type: "switch", description: "Hook Enabled", placeholder: "true" },
  ];

  return (
    <DialogContentSkeleton title="Edit webhook" description="Form data will be sent to this webhook.">
      <FormSkeleton form={form} onSubmitAction={onSubmit} fields={fields} buttonText="Save" />
    </DialogContentSkeleton>
  );
}
