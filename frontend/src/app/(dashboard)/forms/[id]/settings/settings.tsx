"use client";

import DataCard from "@/app/(dashboard)/components/data-card";
import { useForm as useFormProvider } from "@/providers/form";
import { Form, FormEdit, FormEditSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function Settings({ form }: { form: Form }) {
  const { updateForm, isLoading } = useFormProvider();

  const formSettings = useForm<FormEdit>({
    resolver: zodResolver(FormEditSchema),
    defaultValues: {
      ...form,
      settings: {
        ...form.settings,
        isPublic: form.settings.isPublic,
        saveResponses: form.settings.saveResponses,
        spamProtection: form.settings.spamProtection,
        reCaptcha: form.settings.reCaptcha || "",
        allowedOrigins: form.settings.allowedOrigins || [],
        successUrl: form.settings.successUrl || "",
      },
    },
  });

  console.log(formSettings.formState.errors);

  async function onSubmit(values: FormEdit) {
    await updateForm(values);
  }

  const generalFields = [
    { name: "name", description: "Name", placeholder: "Untitled Form", type: "text" },
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
    // {
    //   name: "settings.utm.enabled",
    //   description: "UTM Tracking",
    //   placeholder: "true",
    //   type: "switch",
    //   children: (
    //     <p className="text-xs text-muted-foreground">
    //       Formscale will automatically add UTM tracking parameters to your form submissions.
    //     </p>
    //   ),
    // },
    // {
    //   name: "settings.utm.source",
    //   description: "UTM Source",
    //   placeholder: "formhook",
    //   type: "text",
    // },
    // {
    //   name: "settings.utm.medium",
    //   description: "UTM Medium",
    //   placeholder: "email",
    //   type: "text",
    // },
    // {
    //   name: "settings.utm.campaign",
    //   description: "UTM Campaign",
    //   placeholder: "formhook",
    //   type: "text",
    // },
  ];

  const protectionFields = [
    {
      name: "settings.spamProtection",
      description: "Spam Protection",
      placeholder: "true",
      type: "switch",
      children: (
        <p className="text-xs text-muted-foreground">
          Formscale will automatically block spam submissions before reaching your inbox.
        </p>
      ),
    },
    {
      name: "settings.reCaptcha",
      description: "ReCaptcha Site Key",
      placeholder: "MY_SITE_KEY",
      type: "text",
      children: (
        <p className="text-xs text-muted-foreground">
          Follow{" "}
          <Link target="_blank" href="https://developers.google.com/recaptcha/docs/v3" className="underline">
            these instructions
          </Link>{" "}
          to setup ReCaptcha with Formscale.
        </p>
      ),
    },
    {
      name: "settings.allowedOrigins",
      description: "Allowed Origins",
      placeholder: "https://formscale.dev, http://localhost:3000",
      type: "tags",
      children: <p className="text-xs text-muted-foreground">Separate each origin with a comma or press enter.</p>,
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
    </div>
  );
}
