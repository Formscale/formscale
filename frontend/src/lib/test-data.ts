import { Form } from "@formhook/types";
import { User, Roles, SubscriptionTier } from "@formhook/types";

export const userData: User[] = [
  {
    id: "1",
    name: "Dris Elamri",
    email: "dris@formhook.com",
    role: Roles.ADMIN,
    subscriptionTier: SubscriptionTier.FREE,
    verified: true,
  },
];

export const formData: Form[] = [
  {
    id: "1",
    name: "Dris Elamri's Form",
    settings: {
      isPublic: true,
      allowAnonymous: true,
      admins: [
        { email: "dris@formhook.com", role: "owner" },
        { email: "john@doe.com", role: "admin" },
      ],
      successUrl: "https://formhook.com",
      customDomain: "https://formhook.com",
      allowedOrigins: ["https://formhook.com"],
      reCaptcha: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
      spamProtection: true,
      webhooks: [
        {
          type: "discord",
          url: "https://discord.com/api/webhooks",
          enabled: true,
          method: "POST",
          secret: "",
          headers: {},
        },
        {
          type: "webhook",
          url: "https://formhook.com/webhook",
          enabled: true,
          method: "POST",
          secret: "MY-SECRET",
          headers: {},
        },
      ],
      utm: {
        enabled: true,
        source: "formhook",
        medium: "email",
        campaign: "formhook",
      },
      emailSettings: {
        enabled: true,
        to: ["dris@formhook.com"],
        template: "Default",
        theme: {
          primary: "#000000",
          background: "#FFFFFF",
          logo: "",
          icon: "",
          text: "",
        },
      },
    },
    submissions: [
      {
        formId: "1",
        id: "1",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
        data: {
          name: "John Doe",
          email: "john@doe.com",
          message: "Hello, world!",
        },
        status: "pending",
      },
      {
        formId: "1",
        id: "2",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
        data: {
          name: "Jane Doe",
          email: "jane@doe.com",
          age: 25,
        },
        status: "failed",
      },
    ],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "2",
    name: "Dris Elamri's Form 2",
    settings: {
      isPublic: false,
      reCaptcha: "7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c",
      allowAnonymous: true,
      admins: [{ email: "dris@formhook.com", role: "admin" }],
      successUrl: "https://formhook.com",
      customDomain: "https://formhook.com",
      allowedOrigins: ["https://formhook.com"],
      spamProtection: true,
      webhooks: [],
      emailSettings: {
        enabled: true,
        to: ["dris@formhook.com"],
        template: "Default",
        theme: {
          primary: "#000000",
          background: "#FFFFFF",
          logo: "",
          icon: "",
          text: "",
        },
      },
      utm: {
        enabled: true,
        source: "formhook",
        medium: "email",
        campaign: "formhook",
      },
    },
    submissions: [
      {
        formId: "2",
        id: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        data: {},
        status: "pending",
      },
      {
        formId: "2",
        id: "2",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
        data: {},
        status: "pending",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];
