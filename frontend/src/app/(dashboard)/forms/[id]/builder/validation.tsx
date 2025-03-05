"use client";

import DataCard from "@/app/(dashboard)/components/data-card";
import { useForm as useFormProvider } from "@/providers/form";
import { Form, FormEdit, FormEditSchema } from "@formscale/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getDefaultFormSettings } from "../settings/settings";

export default function ValidationCard({ form }: { form: Form }) {
  const { updateForm, isLoading } = useFormProvider();

  const formSettings = useForm<FormEdit>({
    resolver: zodResolver(FormEditSchema),
    defaultValues: getDefaultFormSettings(form),
  });

  async function onSubmit(values: FormEdit) {
    console.log(values);
    await updateForm(values);
  }

  const validationFields = [
    {
      name: "settings.validation.enabled",
      description: "Enabled",
      placeholder: "true",
      type: "switch",
      children: (
        <p className="text-xs text-muted-foreground">Ensures submissions are validated before being processed.</p>
      ),
    },
    {
      name: "settings.validation.explicit",
      description: "Explicit Mode",
      placeholder: "true",
      type: "switch",
      children: (
        <p className="text-xs text-muted-foreground">
          Only submissions with explicitly defined fields will be accepted.
        </p>
      ),
    },
    {
      name: "settings.validation.template",
      type: "select",
      description: "Validation Template",
      placeholder: "Custom",
      options: ["Custom", "Contact", "Waitlist", "Email", "Feedback"],
      children: (
        <span className="text-xs text-muted-foreground">
          Loads a validation template. <span className="underline">This will override any custom fields.</span>
        </span>
      ),
    },
  ];

  return (
    <DataCard
      title="Validation"
      description="Save Changes"
      fields={validationFields}
      form={formSettings}
      disabled={isLoading}
      onSubmitAction={onSubmit}
    ></DataCard>
  );
}
