import { z } from "zod";
import { FormSettings } from "@formhook/types";

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
  webhook: {
    enabled: false,
    url: "",
    method: "POST",
    headers: {},
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
