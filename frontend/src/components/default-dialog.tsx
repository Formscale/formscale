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

export interface DefaultFormProps<T extends FieldValues> {
  title: string;
  description: string;
  form: UseFormReturn<T>;
  onSubmitAction: (values: T) => void;
  children?: React.ReactNode;
  fields: FormField[];
}

export interface DialogSkeletonProps {
  title: string;
  description: string;
  button: React.ReactNode;
  children: React.ReactNode;
  props?: React.ComponentProps<typeof Dialog>;
}

export function DialogSkeleton({ title, description, button, children, props }: DialogSkeletonProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default function DefaultDialog<T extends FieldValues>({
  title,
  description,
  form,
  onSubmitAction,
  children,
  fields,
}: DefaultFormProps<T>) {
  return (
    <DialogSkeleton title={title} description={description} button={children}>
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
    </DialogSkeleton>
  );
}
