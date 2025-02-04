"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemaForm, FormSchema } from "@formhook/validations";

import { Button } from "@/components/ui/button";
import DefaultDialog from "@/components/default-dialog";

const fields = [{ name: "name", type: "text", description: "Name", placeholder: "FormHook" }];

export default function FormButton({ variant = "action" }: { variant?: "action" | "default" }) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    console.log(values);
  }

  return (
    <DefaultDialog
      title="Create a form"
      description="Add a form to your site in seconds."
      form={form}
      onSubmitAction={onSubmit}
      fields={fields}
    >
      <Button variant={variant} className="w-full" size="sm">
        <PlusCircledIcon />
        <span className={`text-xs font-bold ${variant === "action" ? "text-foreground" : ""}`}>Create Form</span>
      </Button>
    </DefaultDialog>
  );
}
