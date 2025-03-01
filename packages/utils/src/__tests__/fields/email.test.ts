import { Field } from "@formhook/types";
import { fieldToZodSchema } from "../../validations";

describe("email field validation", () => {
  it("accepts valid email when required", () => {
    const field: Field = {
      type: "email",
      id: "email",
      name: "Email",
      required: true,
      placeholder: "Email",
      description: "Email",
      allowedDomains: ["example.com"],
    };

    const schema = fieldToZodSchema(field);
    expect(() => schema.parse("john@example.com")).not.toThrow();
    expect(() => schema.parse("john@invalid.com")).toThrow("Email domain not allowed");
  });
});
