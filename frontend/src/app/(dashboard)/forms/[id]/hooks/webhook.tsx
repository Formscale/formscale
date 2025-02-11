"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { WebhookSchema, Webhook } from "@formhook/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function WebhookEditDialog(webhook: Webhook) {
  const form = useForm<Webhook>({
    resolver: zodResolver(WebhookSchema),
    defaultValues: {
      ...webhook,
      enabled: webhook.enabled || true,
    },
  });

  if (!webhook) return null;

  async function onSubmit(values: Webhook) {
    console.log(values);
  }

  const fields = [
    { name: "url", type: "text", description: "URL", placeholder: "https://api.formhook.com/hooks" },
    { name: "method", type: "select", description: "Method", placeholder: "POST", options: ["POST", "GET"] },
    { name: "secret", type: "text", description: "Signing Secret (optional)", placeholder: "MY-SECRET" },
    { name: "enabled", type: "switch", description: "Hook Enabled", placeholder: "true" },
    // {
    //   name: "headers",
    //   type: "json",
    //   description: "Headers (optional)",
    //   placeholder: '{\n  "Content-Type": "application/json"\n}',
    // },
  ];

  return (
    <DialogContentSkeleton title="Edit webhook" description="Form data will be sent to this webhook.">
      <FormSkeleton form={form} onSubmitAction={onSubmit} fields={fields} buttonText="Save" />
    </DialogContentSkeleton>
  );
}
