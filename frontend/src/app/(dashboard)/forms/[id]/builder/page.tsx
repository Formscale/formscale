"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EnvelopeOpenIcon, MixIcon, Pencil1Icon, TextIcon, TrashIcon } from "@radix-ui/react-icons";

import { DialogSkeleton } from "@/components/default-dialog";
import { useForm } from "@/providers/form";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import Item from "@/app/(dashboard)/components/item";
import { DeleteDialog } from "@/components/default-dialog";
import { useValidation } from "@/hooks/use-validation";
import { useError } from "@/providers";
import { Field, TextSchema, Validation } from "@formscale/types";
import { useEffect, useState } from "react";
import TextDialog from "./fields/text";
// import ThemeCard from "./theme";
import ValidationCard from "./validation";

function getFieldWithDefaults(type: string, id: string = "", validations: Validation) {
  const field = validations?.fields?.find((f) => f.type === type && (id ? f.id === id : true));

  const defaults = {
    type,
    required: false,
    name: "",
    id: id || "",
    placeholder: "",
    description: "",
  };

  return { ...defaults, ...field };
}

export default function BuilderPage() {
  const { form } = useForm();
  const [validations, setValidations] = useState<Validation>({} as Validation);
  const [fieldId, setFieldId] = useState<string>("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { removeField } = useValidation(form?.id || "");
  const [open, setOpen] = useState(false);
  const { handleToast } = useError();

  if (!form) return null;

  useEffect(() => {
    const existingFields = form.settings.validation.fields as Field[];

    setValidations({ ...form.settings.validation, fields: existingFields });
  }, [form.settings.validation.fields]);

  const items = [
    {
      type: "text",
      title: "Text",
      icon: TextIcon,
      description: "Set a minimum and maximum length.",
      dialog: (
        <TextDialog
          {...validations?.fields?.find((field) => field.type === "text")!}
          // type="text"
          // required={false}
          // name=""
          // id=""
          // placeholder=""
          // description=""
        />
      ),
      onClick: () => {
        if (!unsavedChanges) {
          setValidations({
            ...validations,
            fields: [
              ...validations.fields,
              TextSchema.parse({
                type: "text",
                min: 0,
                max: 0,
              }),
            ],
          });

          setUnsavedChanges(true);
          handleToast("warning", "Unsaved changes. Save text settings by editing the field.");

          setOpen(false);
          return;
        }

        handleToast("warning", "Save previous changes before adding a new field.");
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
    // {
    //   type: "date",
    //   title: "Date",
    //   icon: CalendarIcon,
    //   description: "Set a minimum and maximum date.",
    //   onClick: () => console.log("date"),
    // },
    // {
    //   type: "url",
    //   title: "URL",
    //   icon: Link1Icon,
    //   description: "Validate URLs, allow certain domains.",
    //   onClick: () => console.log("url"),
    // },
    // {
    //   type: "tel",
    //   title: "Tel",
    //   icon: ChatBubbleIcon,
    //   description: "Validate phone numbers, allow certain countries.",
    //   onClick: () => console.log("tel"),
    // },
    // {
    //   type: "checkbox",
    //   title: "Checkbox",
    //   icon: CheckboxIcon,
    //   description: "Create a list of options, allow selections.",
    //   onClick: () => console.log("checkbox"),
    // },
    // {
    //   type: "select",
    //   title: "Select",
    //   icon: DropdownMenuIcon,
    //   description: "Create a list of options, allow selections.",
    //   onClick: () => console.log("select"),
    // },
    // {
    //   type: "file",
    //   title: "File",
    //   icon: FileIcon,
    //   description: "Validate file types, set a maximum size and file count.",
    //   onClick: () => console.log("file"),
    // },
  ].map((field) => ({
    ...field,
    dropdownItems: [
      {
        title: "Edit",
        icon: Pencil1Icon,
        dialog: field?.dialog,
      },
      {
        title: "Delete",
        icon: TrashIcon,
        dialog: (
          <DeleteDialog
            title={`Delete field?`}
            description="This action cannot be undone."
            buttonText={`Delete ${field.title}`}
            onDeleteAction={() => {
              // removeField(field.id);
            }}
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
            {/* <div className="mt-2 w-full">
              <Button variant="secondary" className="text-xs font-bold w-full" asChild>
                <Link href="/components">Use Component</Link>
              </Button>
            </div> */}
          </DialogSkeleton>
        }
      >
        <div className="space-y-2">
          <div className={`${validations?.fields?.length !== 0 ? "mb-4" : ""} flex`}>
            <span className="text-[0.8rem]">
              Add form fields to validate submission data.{" "}
              <Link href="/docs/validation" className="text-muted-foreground underline">
                Learn more.
              </Link>
            </span>
          </div>
          {validations?.fields?.map((item, index) => {
            const matchingItem = items.find((i) => i.type === item.type)!;
            return (
              <Item
                key={index}
                {...matchingItem}
                title={item?.name || matchingItem.title}
                description={item?.description || matchingItem.description}
              />
            );
          })}
        </div>
      </DataCardSkeleton>

      <ValidationCard form={form} />
      {/* <ThemeCard form={form} /> */}
    </div>
  );
}
