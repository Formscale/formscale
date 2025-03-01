import Link from "next/link";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export const useProtectionFields = (formSettings: UseFormReturn<any>) => {
  const baseProtectionFields = [
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
      name: "settings.captchaService",
      type: "select",
      description: "CAPTCHA Service",
      placeholder: "None",
      options: ["None", "reCAPTCHA", "hCAPTCHA", "Turnstile"],
      children: (
        <span className="text-xs text-muted-foreground">Using a CAPTCHA service can prevent spam submissions.</span>
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

  const reCaptchaField = {
    name: "settings.reCaptcha",
    description: "CAPTCHA Site Key",
    placeholder: "MY_SITE_KEY",
    type: "text",
    children: (
      <p className="text-xs text-muted-foreground">
        Follow{" "}
        <Link target="_blank" href="https://developers.google.com/recaptcha/docs/v3" className="underline">
          these instructions
        </Link>{" "}
        to setup a CAPTCHA with Formscale.
      </p>
    ),
  };

  const [protectionFields, setProtectionFields] = useState(baseProtectionFields);

  const updateCaptcha = (captchaService: string | undefined) => {
    if (captchaService && captchaService !== "None") {
      const newFields = [...baseProtectionFields];
      newFields.splice(baseProtectionFields.length - 1, 0, reCaptchaField);
      setProtectionFields(newFields);
    } else {
      setProtectionFields(baseProtectionFields);
    }
  };

  useEffect(() => {
    const captchaService = formSettings.getValues("settings.captchaService");

    updateCaptcha(captchaService);
  }, []);

  useEffect(() => {
    const subscription = formSettings.watch((value, { name }) => {
      if (name === "settings.captchaService") {
        updateCaptcha(value.settings?.captchaService);
      }
    });

    return () => subscription.unsubscribe();
  }, [formSettings]);

  return protectionFields;
};
