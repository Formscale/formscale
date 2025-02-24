import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon, Cross2Icon, CrossCircledIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { FieldValues } from "react-hook-form";
import DashBadge from "../badge";

// base columns

export function SortButton<T>(title: string, column: Column<T>) {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      <span className="text-xs">{title}</span>
      <CaretSortIcon />
    </Button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <DashBadge variant="secondary">
          <DotsHorizontalIcon className="h-4 w-4" />
          Pending
        </DashBadge>
      );
    case "completed":
      return (
        <DashBadge variant="success">
          <CheckIcon className="h-4 w-4" />
          Completed
        </DashBadge>
      );
    case "failed":
      return (
        <DashBadge variant="destructive">
          <Cross2Icon className="h-4 w-4" />
          Failed
        </DashBadge>
      );
    case "blocked":
      return (
        <DashBadge variant="destructive">
          <CrossCircledIcon className="h-4 w-4" />
          Blocked
        </DashBadge>
      );
  }
}

export function FormatDate(date: Date) {
  return (
    <div className="text-right" title={format(date, "MMM d, yyyy")}>
      {formatDistanceToNow(date, { addSuffix: true }).replace("about ", "")}
    </div>
  );
}

export function FormatNumber(number: number) {
  return <div className="text-right">{Intl.NumberFormat().format(number)}</div>;
}

// dynamic columns

// i will fix this one day

export const contentFormatters = {
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

const formatters = {
  number: (value: number) => <div className="text-right">{contentFormatters.number(value)}</div>,

  percentage: (value: string) => <div className="text-right">{contentFormatters.percentage(value)}</div>,

  currency: (value: number) => <div className="text-right">{contentFormatters.currency(value)}</div>,

  date: (value: Date) => <div className="text-right">{contentFormatters.date(value)}</div>,

  link: (value: string, type: string) => {
    const { href, content } = contentFormatters.link(value, type);
    return (
      <Link href={href} className="underline" target="_blank">
        {content}
      </Link>
    );
  },

  boolean: (value: boolean) => <div>{contentFormatters.boolean(value)}</div>,

  array: (value: any[]) => <div>{contentFormatters.array(value)}</div>,

  object: (value: object) => <div>{contentFormatters.object(value)}</div>,

  default: (value: any) => <div>{contentFormatters.default(value)}</div>,
};

export function FormatCell(value: FieldValues[keyof FieldValues]) {
  if (typeof value !== "string") {
    if (typeof value === "number") return formatters.number(value);
    if (typeof value === "boolean") return formatters.boolean(value);
    if (value instanceof Date) return formatters.date(value);
    if (Array.isArray(value)) return formatters.array(value);
    if (typeof value === "object" && value !== null) return formatters.object(value);
    return formatters.default(value);
  }
  if (value.includes(process.env.NEXT_PUBLIC_BUCKET_URL || ".png")) return formatters.link(value, "file");
  if (/^-?\d+\.?\d*%$/.test(value)) return formatters.percentage(value);
  if (/^(https?:\/\/[^\s]+)$/.test(value)) return formatters.link(value, "url");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return formatters.link(value, "email");
  if (/^\$?\d+(\.\d{2})?$/.test(value)) return formatters.currency(Number(value));
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return formatters.date(new Date(value));
  if (/^\+?[\d\s-()]+$/.test(value)) return formatters.link(value, "phone");

  return formatters.default(value);
}
