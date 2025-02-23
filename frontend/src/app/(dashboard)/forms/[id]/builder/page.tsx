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

export default function HooksPage() {
  const { form } = useForm();

  if (!form) return null;

  // const themeFields = [
  //   { name: "settings.theme.primary", description: "Primary Color", placeholder: "#000000", type: "text" },
  //   { name: "settings.theme.background", description: "Background Color", placeholder: "#FFFFFF", type: "text" },
  //   { name: "settings.theme.logo", description: "Logo", placeholder: "", type: "upload" },
  //   { name: "settings.theme.icon", description: "Icon", placeholder: "", type: "upload" },
  // ];

  const items = [
    {
      type: "text",
      title: "Text",
      icon: TextIcon,
      description: "Set a minimum and maximum length.",
      //   dialog: <EmailEditDialog emailSettings={form.settings.emailSettings} admins={form.settings?.admins || []} />,
      onClick: () => console.log("text"),
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
          <div className="mb-4 flex">
            <span className="text-[0.8rem]">
              Add form fields to validate submission data.{" "}
              <Link href="/docs/validation" className="text-muted-foreground underline">
                Learn more.
              </Link>
            </span>
          </div>
          {items.map((item) => (
            <Item key={item.title} {...item} />
          ))}
        </div>
      </DataCardSkeleton>

      {/* <DataCard
        title="Theme"
        description="Save Changes"
        fields={themeFields}
        form={form}
        onSubmitAction={onSubmit}
      ></DataCard> */}
    </div>
  );
}
