"use client";

import DataCard from "@/app/(dashboard)/components/data-card";
import { useForm as useFormProvider } from "@/providers/form";
import { Form, FormEdit, FormEditSchema } from "@formscale/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getDefaultFormSettings } from "../settings/settings";

export default function ThemeCard({ form }: { form: Form }) {
  const { updateForm, isLoading } = useFormProvider();

  const formSettings = useForm<FormEdit>({
    resolver: zodResolver(FormEditSchema),
    defaultValues: getDefaultFormSettings(form),
  });

  // console.log(formSettings.formState.errors);

  async function onSubmit(values: FormEdit) {
    await updateForm(values);
  }

  const themeFields = [
    {
      name: "settings.theme.name",
      description: "App Name",
      placeholder: "Formscale",
      type: "text",
      children: (
        <p className="text-xs text-muted-foreground">This name will be used within emails and default components.</p>
      ),
    },
    {
      name: "settings.theme.accent",
      description: "Accent",
      placeholder: "#ffce00",
      type: "text",
      children: <p className="text-xs text-muted-foreground">Used for buttons and highlights.</p>,
    },
    { name: "settings.theme.logo", description: "Logo", placeholder: "", type: "upload" },
    {
      name: "settings.theme.branding",
      description: '"Powered by Formscale" branding',
      placeholder: "true",
      type: "switch",
      disabled: true,
      children: (
        <p className="text-xs text-muted-foreground">Displays Formscale branding below emails and form components.</p>
      ),
    },
  ];

  return (
    <DataCard
      title="Theme"
      description="Save Changes"
      fields={themeFields}
      form={formSettings}
      disabled={isLoading}
      onSubmitAction={onSubmit}
    ></DataCard>
  );
}
