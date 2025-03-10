import { FormPartProps } from "@formscale/types";
import { createFormSchema } from "@formscale/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

interface FormscaleProps<T extends FieldValues> {
  formId: string;
  fields?: FormPartProps<T>[];
  schema?: z.ZodSchema<T>;
  onSubmitAction?: (values: T) => void | Promise<void>;
}

export function useFormscale<T extends FieldValues>({ formId, fields, schema, onSubmitAction }: FormscaleProps<T>) {
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : zodResolver(createFormSchema(fields || [])),
    defaultValues: schema ? {} : undefined,
  });

  async function onSubmit(values: T) {
    if (onSubmitAction) {
      await onSubmitAction(values);
    }
  }

  return {
    form,
    onSubmit,
  };
}
