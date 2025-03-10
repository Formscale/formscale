import { Field } from "@formscale/types";
import { z } from "zod";

export function fieldToZodSchema(field: Field): z.ZodType {
  switch (field.type) {
    case "text": {
      let schema = z.string();
      if (field.min) schema = schema.min(field.min);
      if (field.max) schema = schema.max(field.max);
      return field.required ? schema.min(1, "This field is required") : schema.optional();
    }

    case "number": {
      let schema = z.number();
      if (field.min) schema = schema.min(field.min);
      if (field.max) schema = schema.max(field.max);
      return field.required ? schema : schema.optional();
    }

    case "email": {
      let schema = z.string().email();
      if (field.allowedDomains?.length) {
        schema = schema.refine(
          (email: string) => field.allowedDomains!.some((domain: string) => email.endsWith(`@${domain}`)),
          "Email domain not allowed"
        ) as unknown as z.ZodString;
      }
      return field.required ? schema : schema.optional();
    }

    case "date": {
      let schema = z.coerce.date();
      if (field.min) schema = schema.min(new Date(field.min));
      if (field.max) schema = schema.max(new Date(field.max));
      return field.required ? schema : schema.optional();
    }

    case "url": {
      let schema = z.string().url();
      if (field.allowedDomains?.length) {
        schema = schema.refine(
          (url: string) => field.allowedDomains!.some((domain: string) => url.includes(domain)),
          "URL domain not allowed"
        ) as unknown as z.ZodString;
      }
      return field.required ? schema : schema.optional();
    }

    case "tel": {
      let schema = z.string();
      if (field.format) {
        schema = schema.regex(new RegExp(field.format));
      }
      if (field.allowedCountries?.length) {
        schema = schema.refine(
          (tel: string) => field.allowedCountries!.some((country: string) => tel.startsWith(country)),
          "Phone number country code not allowed"
        ) as unknown as z.ZodString;
      }
      return field.required ? schema : schema.optional();
    }

    case "checkbox": {
      let schema = z.array(z.string());
      if (field.minSelected) schema = schema.min(field.minSelected);
      if (field.maxSelected) schema = schema.max(field.maxSelected);
      return field.required ? schema : schema.optional();
    }

    case "select": {
      if (field.multiple) {
        let schema = z.array(z.enum(field.options as [string, ...string[]]));
        if (field.minSelected) schema = schema.min(field.minSelected);
        if (field.maxSelected) schema = schema.max(field.maxSelected);
        return field.required ? schema.min(1, "At least one option must be selected") : schema.optional();
      }

      return field.required
        ? z.enum(field.options as [string, ...string[]])
        : z.enum(field.options as [string, ...string[]]).optional();
    }

    case "file": {
      let schema = z.instanceof(File);
      if (field.maxSize) {
        schema = schema.refine((file) => file.size <= field.maxSize!, "File size exceeds maximum allowed");
      }
      if (field.acceptedTypes?.length) {
        schema = schema.refine(
          (file: File) => field.acceptedTypes!.some((type: string) => file.type.match(type)),
          "File type not allowed"
        );
      }
      const arraySchema = z.array(schema);
      if (field.maxFiles) {
        return arraySchema.max(field.maxFiles);
      }
      return field.required ? arraySchema : arraySchema.optional();
    }

    default:
      throw new Error(`Unsupported field type: ${field["type"]}`);
  }
}

export function createFormSchema(fields: Field[]) {
  const schemaObject: Record<string, z.ZodType> = {};

  for (const field of fields) {
    if (field.id) {
      schemaObject[field.id] = fieldToZodSchema(field);
    }
  }

  return z.object(schemaObject);
}

export function validateField(field: Field, value: any) {
  const schema = fieldToZodSchema(field);
  return schema.safeParse(value);
}
