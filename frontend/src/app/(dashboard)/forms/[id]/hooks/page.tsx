"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DiscordLogoIcon, EnvelopeOpenIcon, Link1Icon, LinkBreak2Icon, Pencil1Icon } from "@radix-ui/react-icons";

import { DialogSkeleton } from "@/components/default-dialog";
import { useForm } from "@/providers/form";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import Item from "@/app/(dashboard)/components/item";
import { DeleteDialog } from "@/components/default-dialog";

import { Discord } from "@formhook/types";
import DiscordEditDialog from "./discord";
import EmailEditDialog from "./email";
import WebhookEditDialog from "./webhook";

export default function HooksPage() {
  const { form } = useForm();

  if (!form) return null;

  const discordWebhook = form.settings.webhooks.find((webhook) => webhook.type === "discord") as Discord;

  const items = [
    {
      type: "webhook",
      title: "Webhook",
      icon: Link1Icon,
      description: "Send submission data to a webhook",
      dialog: <WebhookEditDialog {...form.settings.webhooks.find((w) => w.type === "webhook")!} />,
      onClick: () => console.log("webhook"),
    },
    {
      type: "email",
      title: "Email",
      icon: EnvelopeOpenIcon,
      description: "Forward submissions to email addresses",
      dialog: <EmailEditDialog emailSettings={form.settings.emailSettings} admins={form.settings?.admins || []} />,
      onClick: () => console.log("email"),
    },
    {
      type: "discord",
      title: "Discord",
      icon: DiscordLogoIcon,
      description: "Send submissions to a Discord channel",
      dialog: <DiscordEditDialog {...discordWebhook} />,
      onClick: () => console.log("discord"),
    },
  ].map((service) => ({
    ...service,
    dropdownItems: [
      {
        title: "Edit",
        icon: Pencil1Icon,
        dialog: service.dialog,
      },
      {
        title: "Disconnect",
        icon: LinkBreak2Icon,
        dialog: (
          <DeleteDialog
            title={`Disconnect ${service.title === "Discord" ? "Discord" : service.title.toLowerCase()}?`}
            description="This action cannot be undone."
            buttonText={`Disconnect ${service.title}`}
            onDeleteAction={() => console.log(`disconnect ${service.type}`)}
          />
        ),
      },
    ],
  }));

  return (
    <DataCardSkeleton
      title="Workflow"
      button={
        <DialogSkeleton
          title="Add a service"
          description="Connect your form to automate your workflow."
          button={
            <Button type="submit" size="sm">
              <span className="text-xs font-bold">Add Service</span>
            </Button>
          }
        >
          {items.map((item) => (
            <Item key={item.title} {...item} button />
          ))}
          <div className="mt-2 w-full">
            <Button variant="secondary" className="text-xs font-bold w-full" asChild>
              <Link href="/integrations">See More Integrations</Link>
            </Button>
          </div>
        </DialogSkeleton>
      }
    >
      <div className="space-y-2">
        <div className="mb-4 flex">
          <span className="text-[0.8rem]">
            Connect your form to other services.{" "}
            <Link href="/integrations" className="text-muted-foreground underline">
              See integrations.
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
