"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { uppercase } from "@formscale/utils";
import { TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import TagInput from "./tag-input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface FormPartProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string;
  type: string;
  description?: string;
  placeholder: string;
  muted?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  options?: string[];
}

function Wrapper({ children, type }: { children: React.ReactNode; type: string }) {
  if (["switch", "checkbox"].includes(type)) {
    return <div className="w-full flex justify-between items-start mt-0.5 -mb-1">{children}</div>;
  }

  return <>{children}</>;
}

export function DefaultSelect({
  field,
  options,
  placeholder,
  disabled,
}: {
  field: FieldValues;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <Select {...field} onValueChange={field.onChange} disabled={disabled}>
      <SelectTrigger className="max-w-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-full">
        {options?.map((option: string) => (
          <SelectItem key={option} value={option}>
            {uppercase(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function FormPart<T extends FieldValues>({
  form,
  name,
  type = "text",
  description,
  placeholder,
  muted = false,
  className,
  children,
  options,
  disabled,
}: FormPartProps<T>) {
  function renderInput({ field }: { field: FieldValues }) {
    switch (type) {
      case "text":
      case "email":
      case "number":
      case "password":
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            className={className}
            onChange={(e) => {
              if (type === "number") {
                const value = e.target.value === "" ? "" : Number(e.target.value);

                if (!isNaN(value as number)) {
                  field.onChange(value);
                }
              } else {
                field.onChange(e.target.value);
              }
            }}
            autoComplete={type === "password" ? "new-password" : "on"}
            style={
              type === "password"
                ? ({
                    WebkitTextSecurity: "none",
                    textSecurity: "none",
                    fontFamily: "text-security-asterisk",
                  } as React.CSSProperties)
                : undefined
            }
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            rows={6}
            className={`${className} resize-none bg-secondary/50`}
          />
        );
      case "upload":
        return (
          <div className="w-full flex flex-col gap-2">
            <Input
              type="file"
              placeholder={placeholder}
              disabled={disabled}
              className={`${className} hidden`}
              id={`file-upload-${name}`}
              onChange={(e) => {
                field.onChange(e.target.files?.[0] || null);
              }}
            />

            {typeof field.value === "string" && field.value && (
              <Link href={field.value} target="_blank" className="underline">
                {field.value.split("/").pop()}
              </Link>
            )}

            <Button
              variant="outline"
              className="w-fit"
              onClick={() => {
                if (field.value) {
                  field.onChange(null);
                } else {
                  document.getElementById(`file-upload-${name}`)?.click();
                }
              }}
              type="button"
            >
              {typeof field.value === "string" && field.value ? (
                <>
                  <TrashIcon />
                  <span className="text-xs">Remove file</span>
                </>
              ) : (
                <>
                  <UploadIcon />
                  <span className="text-xs">{field.value instanceof File ? field.value.name : "Upload file"}</span>
                </>
              )}
            </Button>
          </div>
        );
      case "switch":
        return <Switch {...field} checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />;
      case "checkbox":
        return <Checkbox {...field} checked={field.value} onCheckedChange={field.onChange} />;
      case "select":
        return <DefaultSelect field={field} options={options || []} placeholder={placeholder} />;
      case "tags":
        return (
          <TagInput
            field={{
              value: Array.isArray(field.value) ? field.value : [],
              onChange: field.onChange,
            }}
            placeholder={placeholder}
          />
        );
      case "otp":
        return (
          <InputOTP className="w-full" maxLength={6} {...field}>
            <InputOTPGroup className="w-full">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        );
    }
  }

  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <Wrapper type={type}>
            {description && (
              <FormDescription className={muted ? "text-muted-foreground text-xs" : "text-foreground"}>
                {description}
              </FormDescription>
            )}
            <FormControl>{renderInput({ field })}</FormControl>
          </Wrapper>
          {children && <div className="flex pt-1">{children}</div>}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

// {!isOtp ? (
//   <Input type={type} placeholder={placeholder} {...field} className={className} />
// ) : (
//   <InputOTP className="w-full" maxLength={6} {...field}>
//     <InputOTPGroup className="w-full">
//       <InputOTPSlot index={0} />
//       <InputOTPSlot index={1} />
//       <InputOTPSlot index={2} />
//       <InputOTPSlot index={3} />
//       <InputOTPSlot index={4} />
//       <InputOTPSlot index={5} />
//     </InputOTPGroup>
//   </InputOTP>
// )}
