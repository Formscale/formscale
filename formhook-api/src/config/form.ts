import { z } from "zod";
import { FormSettings } from "@/types";

export const DefaultFormSettings: FormSettings = {
  isPublic: true,
  allowAnonymous: true,
  emailNotifications: {
    enabled: true,
    to: [],
    template: "",
  },
  admins: [],
  reCaptcha: {
    enabled: false,
    siteKey: "",
  },
  successUrl: "",
  customDomain: "",
  validation: {
    enabled: false,
    schema: z.object({}),
  },
  theme: {
    primary: "#000000",
    background: "#ffffff",
    logo: "",
    icon: "",
  },
};
