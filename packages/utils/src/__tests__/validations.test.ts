import { Field } from "@formhook/types";
import { createFormSchema, validateField } from "../validations";

describe("createFormSchema", () => {
  it("creates a schema for multiple fields", () => {
    const fields: Field[] = [
      {
        type: "text",
        id: "name",
        name: "Name",
        required: true,
        placeholder: "Name",
        description: "Name",
        min: 3,
      },
      {
        type: "email",
        id: "email",
        name: "Email",
        required: true,
        placeholder: "Email",
        description: "Email",
        allowedDomains: ["example.com"],
      },
    ];

    const schema = createFormSchema(fields);

    expect(() =>
      schema.parse({
        name: "John",
        email: "john@example.com",
      })
    ).not.toThrow();

    expect(() =>
      schema.parse({
        name: "John",
        email: "john@example.com",
      })
    ).not.toThrow();

    expect(() =>
      schema.parse({
        name: "Jo",
        email: "invalid-email",
      })
    ).toThrow();
  });
});

describe("validateField", () => {
  it("validates a field", () => {
    const fields: Field[] = [
      {
        type: "text",
        id: "name",
        name: "Name",
        required: true,
        placeholder: "Name",
        description: "Name",
        min: 3,
      },
      {
        type: "email",
        id: "email",
        name: "Email",
        required: true,
        placeholder: "Email",
        description: "Email",
        allowedDomains: ["example.com"],
      },
      {
        type: "number",
        id: "number",
        name: "Number",
        required: true,
        placeholder: "Number",
        description: "Number",
        min: 1,
        max: 10,
      },
    ];

    const result = validateField(fields[0], "John");
    expect(result.success).toBe(true);

    const result2 = validateField(fields[1], "john@example.com");
    expect(result2.success).toBe(true);

    const result3 = validateField(fields[2], 5);
    expect(result3.success).toBe(true);

    const result4 = validateField(fields[2], 11);
    expect(result4.success).toBe(false);
  });
});
