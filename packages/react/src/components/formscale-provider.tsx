import { FormPartProps } from "@formscale/types";
import { FieldValues } from "react-hook-form";

import { FormSkeleton } from "@formscale/ui/components";

interface FormscaleProviderType {
  children: React.ReactNode;
  fields: FormPartProps<FieldValues>[];
  form: any;
}

export function FormscaleProvider({ children, fields, form }: FormscaleProviderType) {
  return (
    <FormSkeleton form={form} fields={fields}>
      {children}
    </FormSkeleton>
  );
}
