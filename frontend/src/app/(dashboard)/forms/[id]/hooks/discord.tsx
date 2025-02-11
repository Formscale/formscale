"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { DiscordSchema, Discord } from "@formhook/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function DiscordEditDialog(discord: Discord) {
  const form = useForm<Discord>({
    resolver: zodResolver(DiscordSchema),
    defaultValues: {
      ...discord,
      enabled: discord.enabled || true,
    },
  });

  if (!discord) return null;

  async function onSubmit(values: Discord) {
    console.log(values);
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
