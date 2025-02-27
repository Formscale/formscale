"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ChatBubbleIcon,
  CheckboxIcon,
  DropdownMenuIcon,
  EnvelopeOpenIcon,
  FileIcon,
  Link1Icon,
  MixIcon,
  Pencil1Icon,
  TextIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { DialogSkeleton } from "@/components/default-dialog";
import { useForm } from "@/providers/form";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import Item from "@/app/(dashboard)/components/item";
import { DeleteDialog } from "@/components/default-dialog";
import { Field, TextSchema } from "@formhook/types";
import { ComponentType, useState } from "react";

export default function HooksPage() {
  const { form } = useForm();
  const [fields, setFields] = useState<Field[]>([]);
  const [open, setOpen] = useState(false);

  if (!form) return null;

  const validations = form.settings.validation;

  const items = [
    {
      type: "text",
      title: "Text",
      icon: TextIcon,
      description: "Set a minimum and maximum length.",
      onClick: () => {
        setFields([
          ...fields,
          TextSchema.parse({
            type: "text",
          }),
        ]);
        setOpen(false);
      },
    },
    {
      type: "number",
      title: "Number",
      icon: MixIcon,
      description: "Set a minimum and maximum value.",
      //   dialog: <DiscordEditDialog {...discordWebhook} />,
      onClick: () => console.log("number"),
    },
    {
      type: "email",
      title: "Email",
      icon: EnvelopeOpenIcon,
      description: "Validate email addresses, allow certain domains.",
      //   dialog: <WebhookEditDialog {...form.settings.webhooks.find((w) => w.type === "webhook")!} />,
      onClick: () => console.log("email"),
    },
    {
      type: "date",
      title: "Date",
      icon: CalendarIcon,
      description: "Set a minimum and maximum date.",
      onClick: () => console.log("date"),
    },
    {
      type: "url",
      title: "URL",
      icon: Link1Icon,
      description: "Validate URLs, allow certain domains.",
      onClick: () => console.log("url"),
    },
    {
      type: "tel",
      title: "Tel",
      icon: ChatBubbleIcon,
      description: "Validate phone numbers, allow certain countries.",
      onClick: () => console.log("tel"),
    },
    {
      type: "checkbox",
      title: "Checkbox",
      icon: CheckboxIcon,
      description: "Create a list of options, allow selections.",
      onClick: () => console.log("checkbox"),
    },
    {
      type: "select",
      title: "Select",
      icon: DropdownMenuIcon,
      description: "Create a list of options, allow selections.",
      onClick: () => console.log("select"),
    },
    {
      type: "file",
      title: "File",
      icon: FileIcon,
      description: "Validate file types, set a maximum size and file count.",
      onClick: () => console.log("file"),
    },
  ].map((service) => ({
    ...service,
    dropdownItems: [
      {
        title: "Edit",
        icon: Pencil1Icon,
        // dialog: service.dialog,
      },
      {
        title: "Delete",
        icon: TrashIcon,
        dialog: (
          <DeleteDialog
            title={`Delete field?`}
            description="This action cannot be undone."
            buttonText={`Delete ${service.title}`}
            onDeleteAction={() => console.log(`delete ${service.type}`)}
          />
        ),
      },
    ],
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      <DataCardSkeleton
        title="Fields"
        button={
          <DialogSkeleton
            title="New field"
            props={{ open, onOpenChange: setOpen }}
            description="Each form field will be validated before processing."
            button={
              <Button size="sm">
                <span className="text-xs font-bold">Add Field</span>
              </Button>
            }
          >
            {items.map((item) => (
              <Item key={item.title} {...item} button />
            ))}
            <div className="mt-2 w-full">
              <Button variant="secondary" className="text-xs font-bold w-full" asChild>
                <Link href="/templates">Use A Template</Link>
              </Button>
            </div>
          </DialogSkeleton>
        }
      >
        <div className="space-y-2">
          {/* <div className="mb-4 flex"> */}
          <div className="flex">
            <span className="text-[0.8rem]">
              Add form fields to validate submission data.{" "}
              <Link href="/docs/validation" className="text-muted-foreground underline">
                Learn more.
              </Link>
            </span>
          </div>
          {fields.map((item, index) => (
            <Item
              key={index}
              {...item}
              title={item.name || items.find((i) => i.type === item.type)?.title || ""}
              description={item.description || items.find((i) => i.type === item.type)?.description || ""}
              icon={items.find((i) => i.type === item.type)?.icon as ComponentType}
            />
          ))}
        </div>
      </DataCardSkeleton>
    </div>
  );
}
