import { FormField, FormSkeletonProps } from "@formscale/types";
import { FieldValues } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { FormPart } from "./form-part";

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
        {fields &&
          fields.length > 0 &&
          fields.map((field: FormField) => <FormPart key={field.name} form={form} {...field} />)}
        {children}

        {button ? (
          button
        ) : (
          <SubmitButton disabled={disabled} isDirty={isDirty}>
            {buttonText || "Submit"}
          </SubmitButton>
        )}
      </form>
    </Form>
  );
}

interface SubmitButtonProps {
  disabled?: boolean;
  isDirty?: boolean;
  children: React.ReactNode;
}

export function SubmitButton({ disabled, isDirty, children }: SubmitButtonProps) {
  return (
    <Button type="submit" variant="default" className="text-xs font-bold" disabled={disabled || !isDirty}>
      {children}
    </Button>
  );
}
