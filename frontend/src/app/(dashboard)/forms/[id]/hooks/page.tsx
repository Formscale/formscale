"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Link1Icon, EnvelopeOpenIcon, DiscordLogoIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";

import { useForm } from "@/providers/form";
import { DialogSkeleton } from "@/components/default-dialog";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import Item from "@/app/(dashboard)/components/item";
import { DeleteDialog } from "@/components/default-dialog";

import WebhookEditDialog from "./webhook";

export default function HooksPage() {
  const { form } = useForm();

  if (!form) return null;

  const items = [
    {
      title: "Webhook",
      icon: Link1Icon,
      description: "Send submission data to a webhook",
      onClick: () => {
        console.log("webhook");
      },
      dropdownItems: [
        {
          title: "Edit",
          icon: Pencil1Icon,
          dialog: <WebhookEditDialog />,
        },
        {
          title: "Delete",
          icon: TrashIcon,
          dialog: (
            <DeleteDialog
              title="Delete Webhook"
              description="This action cannot be undone."
              buttonText="Delete Webhook"
              onDeleteAction={() => {
                console.log("delete");
              }}
            />
          ),
        },
      ],
    },
    {
      title: "Email",
      icon: EnvelopeOpenIcon,
      description: "Forward submissions to an email address",
      onClick: () => {
        console.log("email");
      },
    },
    {
      title: "Discord",
      icon: DiscordLogoIcon,
      description: "Send submissions to a Discord channel",
      onClick: () => {
        console.log("discord");
      },
    },
  ];

  return (
    <DataCardSkeleton
      title="Workflow"
      button={
        <DialogSkeleton
          title="Add a service"
          description="Connect your form to automate your workflow."
          button={
            <Button
              type="submit"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/forms/${form.id}`);
              }}
            >
              <span className="text-xs font-bold">Add Service</span>
            </Button>
          }
        >
          {items.map((item) => (
            <Item key={item.title} {...item} button />
          ))}
          <div className="mt-2 w-full">
            <Button variant="secondary" className="text-xs font-bold w-full" asChild>
              <Link href="/integrations">Add More Integrations</Link>
            </Button>
          </div>
        </DialogSkeleton>
      }
    >
      <div className="space-y-2">
        <div className="mb-4">
          <span className="text-[0.8rem]">
            Integrate your form with other services.{" "}
            <Link href="/integrations" className="text-muted-foreground underline">
              Add integrations.
            </Link>
          </span>
        </div>
        {/* <Input
          type="text"
          placeholder="https://api.formhook.com/123"
          value={`https://api.formhook.com/forms/${form.id}`}
          disabled
          className="max-w-sm"
        /> */}
        {items.map((item) => (
          <Item key={item.title} {...item} />
        ))}
      </div>
    </DataCardSkeleton>
  );
}
