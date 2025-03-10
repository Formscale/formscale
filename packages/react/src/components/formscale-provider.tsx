import { FormPartProps } from "@formscale/types";
import { GoogleReCaptcha, GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { config } from "../config";

import { FormSkeleton } from "@formscale/ui/components";

interface FormscaleProviderType<T extends FieldValues> {
  children: React.ReactNode;
  fields?: FormPartProps<T>[];
  form: UseFormReturn<T>;
}

export function FormscaleProvider<T extends FieldValues>({ children, fields, form }: FormscaleProviderType<T>) {
  return (
    <FormSkeleton form={form} fields={fields}>
      <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaKey}>
        <GoogleReCaptcha
          onVerify={(token) => {
            console.log(token);
          }}
        />
        {children}
      </GoogleReCaptchaProvider>
    </FormSkeleton>
  );
}
