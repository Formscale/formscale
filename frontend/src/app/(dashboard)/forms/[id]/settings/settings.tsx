"use client";

import DataCard from "@/app/(dashboard)/components/data-card";
import { useForm as useFormProvider } from "@/providers/form";
import { Form, FormEdit, FormEditSchema } from "@formscale/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useProtectionFields } from "./captcha";
import DangerCard from "./danger";

export const getDefaultFormSettings = (form: Form) => {
  return {
    ...form,
    settings: {
      ...form.settings,
      isPublic: form.settings.isPublic,
      saveResponses: form.settings.saveResponses,
      spamProtection: form.settings.spamProtection,
      defaultStatus: form.settings.defaultStatus || "completed",
      captchaService: form.settings.captchaService || "None",
      reCaptcha: form.settings.reCaptcha || "",
      allowedOrigins: form.settings.allowedOrigins || [],
      successUrl: form.settings.successUrl || "",
      theme: {
        name: form.settings.theme?.name || "",
        accent: form.settings.theme?.accent || "",
        logo: form.settings.theme?.logo || "",
        branding: form.settings.theme?.branding,
      },
    },
  };
};

export default function Settings({ form }: { form: Form }) {
  const { updateForm, isLoading } = useFormProvider();

  const formSettings = useForm<FormEdit>({
    resolver: zodResolver(FormEditSchema),
    defaultValues: getDefaultFormSettings(form),
  });

  const protectionFields = useProtectionFields(formSettings);

  // console.log(formSettings.formState.errors);

  async function onSubmit(values: FormEdit) {
    await updateForm(values);
  }

  const generalFields = [
    {
      name: "name",
      description: "Name",
      placeholder: "Untitled Form",
      type: "text",
    },
    // { name: "settings.admins", description: "Admins", placeholder: "dris@formscale.dev", type: "tags" },
    {
      name: "settings.isPublic",
      description: "Active",
      placeholder: "true",
      type: "switch",
      children: (
        <p className="text-xs text-muted-foreground">Your form will no longer accept submissions when disabled.</p>
      ),
    },
    {
      name: "settings.saveResponses",
      description: "Save Responses",
      placeholder: "true",
      type: "switch",
      children: (
        <p className="text-xs text-muted-foreground">
          Formscale automatically saves submission data (including file uploads) from your form.
        </p>
      ),
    },
  ];

  const processingFields = [
    {
      name: "settings.successUrl",
      description: "Success URL",
      placeholder: "https://formscale.dev/success",
      type: "text",
      children: (
        <p className="text-xs text-muted-foreground">Users will be redirected to this URL after submitting the form.</p>
      ),
    },
    {
      name: "settings.defaultStatus",
      type: "select",
      description: "Default Status",
      placeholder: "completed",
      options: ["completed", "pending", "blocked", "failed"],
      children: (
        <span className="text-xs text-muted-foreground">
          The default status of successful submissions. Can be edited per submission.
        </span>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <DataCard
        title="General"
        description="Save Changes"
        fields={generalFields}
        form={formSettings}
        disabled={isLoading}
        onSubmitAction={onSubmit}
      ></DataCard>
      <DataCard
        title="Processing"
        description="Save Changes"
        fields={processingFields}
        form={formSettings}
        disabled={isLoading}
        onSubmitAction={onSubmit}
      ></DataCard>
      <DataCard
        title="Protection"
        description="Save Changes"
        fields={protectionFields}
        form={formSettings}
        disabled={isLoading}
        onSubmitAction={onSubmit}
      ></DataCard>
      <DangerCard form={form} />
    </div>
  );
}
