"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { Discord, DiscordSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
