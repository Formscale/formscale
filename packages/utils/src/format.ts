import { format } from "date-fns";
import { FieldValues } from "react-hook-form";

// i will fix this one day

export interface Formatter {
  number: (value: number) => string;
  percentage: (value: string) => string;
  currency: (value: number) => string;
  date: (value: Date) => string;
  boolean: (value: boolean) => string;
  array: (value: any[]) => string;
  object: (value: object) => string;
  default: (value: any) => string;
  link: (value: string, type: string) => { value: string; content: string; href: string };
}

export const contentFormatter: Formatter = {
  number: (value: number) => Intl.NumberFormat().format(value),

  percentage: (value: string) => value.toLocaleString(),

  currency: (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value),

  date: (value: Date) => format(value, "MMM d, yyyy"),

  link: (value: string, type: string) => {
    const href = type === "email" ? `mailto:${value}` : type === "phone" ? `tel:${value}` : value;

    let content = value;
    content = type === "file" ? `File (${value.split(".").pop() || "file"})` : content;

    return { value, content, href };
  },

  boolean: (value: boolean) => (value ? "Yes" : "No"),

  array: (value: any[]) => value.join(", "),

  object: (value: object) => JSON.stringify(value),

  default: (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    return String(value);
  },
};

export function FormatCell(value: FieldValues[keyof FieldValues], formatter: Formatter) {
  if (typeof value !== "string") {
    if (typeof value === "number") return formatter.number(value);
    if (typeof value === "boolean") return formatter.boolean(value);
    if (value instanceof Date) return formatter.date(value);
    if (Array.isArray(value)) return formatter.array(value);
    if (typeof value === "object" && value !== null) return formatter.object(value);
    return formatter.default(value);
  }
  if (value.includes(process.env.NEXT_PUBLIC_BUCKET_URL || ".png")) return formatter.link(value, "file");
  if (/^-?\d+\.?\d*%$/.test(value)) return formatter.percentage(value);
  if (/^(https?:\/\/[^\s]+)$/.test(value)) return formatter.link(value, "url");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return formatter.link(value, "email");
  if (/^\$?\d+(\.\d{2})?$/.test(value)) return formatter.currency(Number(value));
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return formatter.date(new Date(value));
  if (/^\+?[\d\s-()]+$/.test(value)) return formatter.link(value, "phone");

  return formatter.default(value);
}
