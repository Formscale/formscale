"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { useForm as useFormProvider } from "@/providers/form";
import { Discord, DiscordSchema } from "@formscale/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWebhook } from "./webhook";

export default function DiscordEditDialog(discord: Discord) {
  const { updateForm, form: formContext, isLoading } = useFormProvider();

  const form = useForm<Discord>({
    resolver: zodResolver(DiscordSchema),
    defaultValues: {
      ...discord,
      enabled: discord.enabled,
    },
  });

  if (!discord) return null;

  async function onSubmit(values: Discord) {
    await updateWebhook(values, formContext!, updateForm);
  }

  const fields = [
    {
      name: "url",
      type: "text",
      description: "Webhook URL",
      placeholder: "https://discord.com/api/webhooks",
    },
    {
      name: "enabled",
      type: "switch",
      description: "Hook Enabled",
      placeholder: "true",
    },
  ];

  return (
    <DialogContentSkeleton title="Edit Discord webhook" description="Submissions will be sent to this Discord webhook.">
      <FormSkeleton form={form} onSubmitAction={onSubmit} fields={fields} buttonText="Save" />
    </DialogContentSkeleton>
  );
}
