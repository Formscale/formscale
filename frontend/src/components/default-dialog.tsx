"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormPart from "@/components/form-part";
import { Button } from "@/components/ui/button";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface FormField {
  name: string;
  description: string;
  placeholder: string;
  type: string;
}

interface DefaultDialogProps<T extends FieldValues> {
  title: string;
  description: string;
  form: UseFormReturn<T>;
  onSubmitAction: (values: T) => void;
  children: React.ReactNode;
  fields: FormField[];
}

export default function DefaultDialog<T extends FieldValues>({
  title,
  description,
  form,
  onSubmitAction,
  children,
  fields,
}: DefaultDialogProps<T>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAction)} className="w-full flex flex-col gap-4">
            {fields.map((field: FormField) => (
              <FormPart key={field.name} form={form} {...field} />
            ))}
            <Button type="submit" variant="action" className="text-xs font-bold">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
