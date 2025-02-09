import { Form } from "@formhook/types";

export const formData: Form[] = [
  {
    id: "1",
    name: "Dris Elamri's Form",
    settings: {
      isPublic: true,
      allowAnonymous: true,
      admins: ["dris@formhook.com"],
      successUrl: "https://formhook.com",
      customDomain: "https://formhook.com",
      allowedOrigins: ["https://formhook.com"],
      webhooks: [],
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
      admins: ["dris@formhook.com"],
      successUrl: "https://formhook.com",
      customDomain: "https://formhook.com",
      allowedOrigins: ["https://formhook.com"],
      webhooks: [],
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
