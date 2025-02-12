"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { EmailSettingsSchema, EmailSettings, Admin } from "@formhook/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EmailEditDialogProps {
  emailSettings: EmailSettings;
  admins: Admin[];
}

export default function EmailEditDialog({ emailSettings, admins }: EmailEditDialogProps) {
  const form = useForm<EmailSettings>({
    resolver: zodResolver(EmailSettingsSchema),
    defaultValues: {
      ...emailSettings,
      enabled: emailSettings.enabled || true,
      to: emailSettings.to || admins.map((admin) => admin.email),
    },
  });

  if (!emailSettings) return null;

  async function onSubmit(values: EmailSettings) {
    console.log(values);
  }

  const fields = [
    {
      name: "to",
      type: "tags",
      description: "Recipients",
      placeholder: "dris@example.com, ryan@example.com",
    },
    {
      name: "template",
      type: "select",
      description: "Template",
      placeholder: "default",
      options: ["default", "custom"],
    },
    { name: "enabled", type: "switch", description: "Email Enabled", placeholder: "true" },
  ];

  return (
    <DialogContentSkeleton title="Edit email settings" description="Submissions will be forwarded to recipients.">
      <FormSkeleton form={form} onSubmitAction={onSubmit} fields={fields} buttonText="Save" />
    </DialogContentSkeleton>
  );
}
