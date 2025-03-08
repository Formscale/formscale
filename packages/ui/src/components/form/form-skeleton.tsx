import { FieldValues, UseFormReturn } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { FormPart } from "./form-part";

interface FormField {
  name: string;
  description?: string;
  placeholder: string;
  type: string;
  options?: string[];
}

interface FormSkeletonProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmitAction?: (values: T) => void | Promise<void>;
  fields: FormField[];
  buttonText?: string;
  button?: React.ReactNode;
  disabled?: boolean;
  ignoreDirty?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function FormSkeleton<T extends FieldValues>({
  form,
  onSubmitAction,
  fields,
  buttonText,
  button,
  disabled,
  ignoreDirty = false,
  children,
  className,
}: FormSkeletonProps<T>) {
  const isDirty = ignoreDirty || form.formState.isDirty;

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmitAction ? form.handleSubmit(onSubmitAction) : undefined}
        className={cn("w-full flex flex-col gap-4", className)}
      >
        {fields.map((field: FormField) => (
          <FormPart key={field.name} form={form} {...field} />
        ))}
        {children}

        {button ? (
          button
        ) : (
          <Button type="submit" variant="action" className="text-xs font-bold" disabled={disabled || !isDirty}>
            {buttonText || "Submit"}
          </Button>
        )}
      </form>
    </Form>
  );
}
