"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormPart,
} from "@formscale/ui/components";
import { DialogProps } from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface FormField {
  name: string;
  description?: string;
  placeholder: string;
  type: string;
  options?: string[];
}

export interface DialogBaseProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export interface DialogSkeletonProps extends DialogBaseProps {
  button: React.ReactNode;
  props?: React.ComponentProps<typeof Dialog>;
}

export interface DialogContentSkeletonProps extends DialogBaseProps {
  props?: React.ComponentProps<typeof DialogContent>;
}

export interface DeleteDialogProps extends DialogBaseProps {
  onDeleteAction: () => void;
  buttonText?: string;
}

export interface DefaultFormProps<T extends FieldValues> extends DialogBaseProps, DialogProps {
  form: UseFormReturn<T>;
  onSubmitAction: (values: T) => void | Promise<void>;
  fields: FormField[];
  buttonText?: string;
  disabled?: boolean;
}

interface FormSkeletonProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmitAction?: (values: T) => void | Promise<void>;
  fields: FormField[];
  buttonText?: string;
  disabled?: boolean;
  ignoreDirty?: boolean;
  children?: React.ReactNode;
}

export function DialogContentSkeleton({ title, description, children, props }: DialogContentSkeletonProps) {
  return (
    <DialogContent className="sm:max-w-[425px]" {...props}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription className="text-xs text-muted-foreground">{description}</DialogDescription>}
      </DialogHeader>
      {children}
    </DialogContent>
  );
}

export function DeleteDialog({
  title,
  description = "This action cannot be undone.",
  onDeleteAction,
  buttonText = "Delete",
  children,
}: DeleteDialogProps) {
  return (
    <DialogContentSkeleton title={title} description={description}>
      {children}
      <Button variant="destructive" className="text-xs font-bold mt-1" onClick={onDeleteAction}>
        <XIcon />
        {buttonText}
      </Button>
    </DialogContentSkeleton>
  );
}

export function DialogSkeleton({ title, description, button, children, props }: DialogSkeletonProps) {
  return (
    <Dialog modal={true} {...props}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContentSkeleton title={title} description={description}>
        {children}
      </DialogContentSkeleton>
    </Dialog>
  );
}

export function FormSkeleton<T extends FieldValues>({
  form,
  onSubmitAction,
  fields,
  buttonText,
  disabled,
  ignoreDirty = false,
  children,
}: FormSkeletonProps<T>) {
  const isDirty = ignoreDirty || form.formState.isDirty;

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmitAction ? form.handleSubmit(onSubmitAction) : undefined}
        className="w-full flex flex-col gap-4"
      >
        {fields.map((field: FormField) => (
          <FormPart key={field.name} form={form} {...field} />
        ))}
        {children}
        {buttonText && (
          <Button type="submit" variant="action" className="text-xs font-bold" disabled={disabled || !isDirty}>
            {buttonText}
          </Button>
        )}
      </form>
    </Form>
  );
}

export default function DefaultDialog<T extends FieldValues>(props: DefaultFormProps<T>) {
  const { children, ...formProps } = props;

  return (
    <DialogSkeleton title={props.title} description={props.description} button={children} props={props}>
      <FormSkeleton {...formProps} buttonText={props.buttonText || "Create"} />
    </DialogSkeleton>
  );
}
