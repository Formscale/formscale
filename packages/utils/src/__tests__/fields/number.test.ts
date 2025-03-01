import { Field } from "@formhook/types";
import { fieldToZodSchema } from "../../validations";

describe("number field validation", () => {
  it("accepts valid number when required", () => {
    const field: Field = {
      type: "number",
      id: "number",
      name: "Number",
      required: true,
      placeholder: "Number",
      description: "Number",
      min: 1,
      max: 10,
    };

    const schema = fieldToZodSchema(field);
    expect(() => schema.parse(5)).not.toThrow();
    expect(() => schema.parse(0)).toThrow();
    expect(() => schema.parse(11)).toThrow();
  });
});
