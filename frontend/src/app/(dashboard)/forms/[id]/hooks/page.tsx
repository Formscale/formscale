"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DiscordLogoIcon, EnvelopeOpenIcon, Link1Icon, LinkBreak2Icon, Pencil1Icon } from "@radix-ui/react-icons";

import { DialogSkeleton } from "@/components/default-dialog";
import { useForm } from "@/providers/form";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import Item from "@/app/(dashboard)/components/item";
import { DeleteDialog } from "@/components/default-dialog";

import { useError } from "@/providers/error";
import { useUser } from "@/providers/user";
import { Discord, EmailSettings, FormEdit, Webhook } from "@formscale/types";
import { useEffect, useState } from "react";
import DiscordEditDialog from "./discord";
import EmailEditDialog from "./email";
import parseForm from "./parse";
import WebhookEditDialog from "./webhook";

const defaultWebhook = {
  enabled: true,
  url: "",
  method: "POST" as const,
  headers: {},
};

export default function HooksPage() {
  const [open, setOpen] = useState(false);
  const { handleError, handleToast } = useError();
  const { user } = useUser();
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [hooks, setHooks] = useState<Webhook[]>([]);

  const { form, updateForm } = useForm();

  useEffect(() => {
    if (!form) return;
    setHooks(form.settings.webhooks);
    setEmailSettings(form.settings.emailSettings);
  }, [form?.settings?.webhooks, form?.settings?.emailSettings]);

  if (!form) return null;

  const items = [
    {
      type: "email",
      title: "Email",
      icon: EnvelopeOpenIcon,
      description: "Forward submissions to email addresses",
      dialog: <EmailEditDialog emailSettings={emailSettings as EmailSettings} admins={form.settings?.admins || []} />,
      onClick: () => {
        if (!emailSettings?.template) {
          setEmailSettings({
            enabled: true,
            to: [user?.email || ""],
            template: "Default",
            text: "",
          });
          setOpen(false);

          handleToast("warning", "Unsaved changes. Save email settings to connect.");
          return;
        }

        handleError(new Error("Email already connected."));
      },
    },
    {
      type: "webhook",
      title: "Webhook",
      icon: Link1Icon,
      description: "Send submission data to a webhook",
      dialog: <WebhookEditDialog {...(hooks.find((webhook) => webhook.type === "webhook") as Webhook)} />,
      onClick: () => {
        if (!hooks.find((webhook) => webhook.type === "webhook")) {
          setHooks([
            ...hooks,
            {
              type: "webhook",
              ...defaultWebhook,
            },
          ]);

          handleToast("warning", "Unsaved changes. Edit webhook settings to connect.");
          setOpen(false);
          return;
        }

        handleError(new Error("Webhook already connected."));
      },
    },
    {
      type: "discord",
      title: "Discord",
      icon: DiscordLogoIcon,
      description: "Send submissions to a Discord channel",
      dialog: <DiscordEditDialog {...(hooks.find((webhook) => webhook.type === "discord") as Discord)} />,
      onClick: () => {
        if (!hooks.find((webhook) => webhook.type === "discord")) {
          setHooks([
            ...hooks,
            {
              type: "discord",
              ...defaultWebhook,
            },
          ]);

          handleToast("warning", "Unsaved changes. Edit Discord settings to connect.");
          setOpen(false);
          return;
        }

        handleError(new Error("Discord webhook already connected."));
      },
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
            onDeleteAction={async () => {
              const formEdit = parseForm(form!);

              const updatedForm = {
                ...formEdit,
                settings: {
                  ...formEdit.settings,
                  webhooks:
                    service.type === "webhook" || service.type === "discord"
                      ? formEdit.settings.webhooks.filter((webhook: Webhook) => webhook.type !== service.type)
                      : formEdit.settings.webhooks,
                  emailSettings: service.type === "email" ? {} : formEdit.settings.emailSettings,
                },
              };

              await updateForm(updatedForm as FormEdit);
            }}
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
          props={{ open, onOpenChange: setOpen }}
          button={
            <Button type="submit" size="sm" onClick={() => setOpen(true)}>
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
        <div className={`${emailSettings?.template ? "mb-4" : ""} flex`}>
          <span className="text-[0.8rem]">
            Connect your form to other services.{" "}
            <Link href="/integrations" className="text-muted-foreground underline">
              See integrations.
            </Link>
          </span>
        </div>
        {/* {items.map((item) => (
          <Item key={item.title} {...item} />
        ))} */}

        {emailSettings?.template && <Item {...items.find((item) => item.type === "email")!} />}
        {hooks.map((hook, index) => (
          <Item key={index} {...items.find((item) => item.type === hook.type)!} />
        ))}
      </div>
    </DataCardSkeleton>
  );
}
