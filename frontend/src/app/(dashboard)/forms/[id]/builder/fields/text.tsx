"use client";

import { DialogContentSkeleton, FormSkeleton } from "@/components/default-dialog";
import { useValidation } from "@/hooks/use-validation";
import { useForm as useFormProvider } from "@/providers/form";
import { Text, TextSchema } from "@formscale/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { baseFields, requiredFields } from ".";

export default function TextDialog(textField?: Text) {
  const { form: formContext } = useFormProvider();
  const { saveField, isLoading } = useValidation(formContext?.id || "");

  const form = useForm<Text>({
    resolver: zodResolver(TextSchema),
    defaultValues: {
      ...textField,
      min: textField?.min || "",
      max: textField?.max || "",
    },
  });

  if (!textField) return null;

  async function onSubmit(values: Text) {
    console.log(values);

    await saveField(values);
  }

  const fields = [
    ...baseFields,
    {
      name: "min",
      type: "number",
      description: "Minimum length",
      placeholder: "1",
    },
    {
      name: "max",
      type: "number",
      description: "Maximum length",
      placeholder: "100",
    },
    ...requiredFields,
  ];

  return (
    <DialogContentSkeleton title="Edit text settings" description="Set a minimum and maximum length.">
      <FormSkeleton form={form} onSubmitAction={onSubmit} fields={fields} buttonText="Save" disabled={isLoading} />
    </DialogContentSkeleton>
  );
}
