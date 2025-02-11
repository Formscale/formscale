import { Form } from "@formhook/types";

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
      emailSettings: {
        enabled: true,
        to: ["dris@formhook.com"],
        template: "default",
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
      allowAnonymous: true,
      admins: [{ email: "dris@formhook.com", role: "admin" }],
      successUrl: "https://formhook.com",
      customDomain: "https://formhook.com",
      allowedOrigins: ["https://formhook.com"],
      webhooks: [],
      emailSettings: {
        enabled: true,
        to: ["dris@formhook.com"],
        template: "default",
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
