import { z } from "zod";

export interface FormSettings {
  isPublic?: boolean;
  allowAnonymous?: boolean;
  emailNotifications?: {
    enabled: boolean;
    to?: string[];
    template?: string;
  };
  admins?: string[];
  reCaptcha?: {
    enabled: boolean;
    siteKey?: string;
  };
  successUrl?: string;
  customDomain?: string;
  validation?: {
    enabled: boolean;
    schema: z.AnyZodObject;
  };
  theme?: {
    primary: string;
    background: string;
    logo: string;
    icon: string;
  };
}
