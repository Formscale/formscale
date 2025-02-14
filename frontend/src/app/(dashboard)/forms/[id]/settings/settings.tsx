"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormSchema, Form } from "@formhook/types";
import DataCard from "@/app/(dashboard)/components/data-card";
import Link from "next/link";

export default function Settings({ form }: { form: Form }) {
  const formSettings = useForm<Form>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...form,
    },
  });

  async function onSubmit(values: Form) {
    console.log(values);
  }

  const generalFields = [
    { name: "name", description: "Name", placeholder: "Untitled Form", type: "text" },
    // { name: "settings.admins", description: "Admins", placeholder: "dris@formhook.com", type: "tags" },
    {
      name: "settings.isPublic",
      description: "Active",
      placeholder: "true",
      type: "switch",
      children: (
        <p className="text-xs text-muted-foreground">Your form will no longer accept submissions when disabled.</p>
      ),
    },
  ];

  const processingFields = [
    {
      name: "settings.successUrl",
      description: "Success URL",
      placeholder: "https://formhook.com/success",
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
    //       FormHook will automatically add UTM tracking parameters to your form submissions.
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
          FormHook will automatically block spam submissions before reaching your inbox.
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
          to setup ReCaptcha with FormHook.
        </p>
      ),
    },
    {
      name: "settings.allowedOrigins",
      description: "Allowed Origins",
      placeholder: "https://formhook.com, http://localhost:3000",
      type: "tags",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <DataCard
        title="General"
        description="Save Changes"
        fields={generalFields}
        form={formSettings}
        onSubmitAction={onSubmit}
      ></DataCard>
      <DataCard
        title="Processing"
        description="Save Changes"
        fields={processingFields}
        form={formSettings}
        onSubmitAction={onSubmit}
      ></DataCard>
      <DataCard
        title="Protection"
        description="Save Changes"
        fields={protectionFields}
        form={formSettings}
        onSubmitAction={onSubmit}
      ></DataCard>
    </div>
  );
}
