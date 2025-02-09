"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormPart from "@/components/form-part";

import { DefaultFormProps } from "@/components/default-dialog";

/* yeah this code is also scuffed im sorry */

function Wrapper<T extends FieldValues>({
  children,
  form,
  onSubmitAction,
}: {
  children: React.ReactNode;
  form?: UseFormReturn<T>;
  onSubmitAction: (values: T) => void;
}) {
  if (form) {
    return (
      <form onSubmit={form.handleSubmit(onSubmitAction)} className="w-full">
        {children}
      </form>
    );
  }

  return <>{children}</>;
}

export function DataCardSkeleton<T extends FieldValues>({
  children,
  title,
  button,
  form,
  onSubmitAction,
}: {
  children: React.ReactNode;
  title: string;
  button: React.ReactNode;
  form?: UseFormReturn<T>;
  onSubmitAction?: (values: T) => void;
}) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="py-4 pb-3 border-b border-border">
        <CardTitle className="text-md font-bold">{title}</CardTitle>
      </CardHeader>
      <Wrapper form={form} onSubmitAction={onSubmitAction || (() => {})}>
        <CardContent className="py-6 pt-5">
          <div className="flex flex-col gap-4">{children}</div>
        </CardContent>
        <CardFooter className="py-3 border-t border-border flex justify-start items-center gap-2">{button}</CardFooter>
      </Wrapper>
    </Card>
  );
}

export default function DataCard<T extends FieldValues>({
  title,
  description,
  fields,
  form,
  onSubmitAction,
  children,
}: DefaultFormProps<T>) {
  return (
    <Form {...form}>
      <DataCardSkeleton
        button={
          <Button type="submit" size="sm">
            <span className="text-xs font-bold">{description}</span>
          </Button>
        }
        title={title}
        onSubmitAction={onSubmitAction}
        form={form}
      >
        {children}
        {fields.map((field) => (
          <FormPart key={field.name} form={form} {...field} className="max-w-sm" />
        ))}
      </DataCardSkeleton>
    </Form>
  );
}
