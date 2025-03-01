"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { useForm as useFormProvider } from "@/providers/form";
import { Admin, EmailSettings, EmailSettingsSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { parseForm } from "./page";

interface EmailEditDialogProps {
  emailSettings: EmailSettings;
  admins: Admin[];
}

export default function EmailEditDialog({ emailSettings, admins }: EmailEditDialogProps) {
  const { updateForm, form: formContext, isLoading } = useFormProvider();

  const form = useForm<EmailSettings>({
    resolver: zodResolver(EmailSettingsSchema),
    defaultValues: {
      ...emailSettings,
      enabled: emailSettings.enabled,
      to: emailSettings.to || admins.map((admin) => admin.email),
    },
  });

  if (!emailSettings) return null;

  async function onSubmit(values: EmailSettings) {
    const formEdit = parseForm(formContext!);

    const form = {
      ...formEdit,
      settings: {
        ...formEdit.settings,
        emailSettings: values,
      },
    };

    await updateForm(form);
  }

  const enabledChildren = formContext?.development ? (
    <span className="text-xs text-muted-foreground">Email delivery is disabled in development mode.</span>
  ) : null;

  const fields = [
    {
      name: "to",
      type: "tags",
      description: "Recipients",
      placeholder: "dris@example.com, ryan@example.com",
      children: <span className="text-xs text-muted-foreground">Recipients will be invited to receive emails.</span>,
    },
    {
      name: "template",
      type: "select",
      description: "Template",
      placeholder: "Default",
      options: ["Default", "Custom"],
      children: (
        <span className="text-xs text-muted-foreground">
          Uses the default branding or a{" "}
          <Link href={`/forms/${formContext?.id}/builder`} className="underline" target="_blank">
            custom theme
          </Link>
          .
        </span>
      ),
    },
    {
      name: "enabled",
      type: "switch",
      description: "Email Enabled",
      placeholder: "true",
      children: enabledChildren,
    },
  ];

  return (
    <DialogContentSkeleton title="Edit email settings" description="Submissions will be forwarded to recipients.">
      <FormSkeleton
        form={form}
        onSubmitAction={onSubmit}
        fields={fields}
        buttonText="Save"
        disabled={isLoading}
        ignoreDirty={true}
      />
    </DialogContentSkeleton>
  );
}
