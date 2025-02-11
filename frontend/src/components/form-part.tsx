"use client";

import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormPartProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string;
  type: string;
  description?: string;
  placeholder: string;
  muted?: boolean;
  className?: string;
  options?: string[];
}

export default function FormPart<T extends FieldValues>({
  form,
  name,
  type = "text",
  description,
  placeholder,
  muted = false,
  className,
  options,
}: FormPartProps<T>) {
  function renderInput({ field }: { field: FieldValues }) {
    switch (type) {
      case "text":
      case "email":
      case "number":
      case "password":
      default:
        return <Input type={type} placeholder={placeholder} {...field} className={className} />;
      case "switch":
        return <Switch {...field} checked={field.value} onCheckedChange={field.onChange} />;
      case "select":
        return (
          <Select {...field} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

  function Wrapper({ children }: { children: React.ReactNode }) {
    if (type === "switch") {
      return <div className="w-full flex justify-between items-start mt-0.5 mb-1">{children}</div>;
    }

    return <>{children}</>;
  }

  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <Wrapper>
            {description && (
              <FormDescription className={muted ? "text-muted-foreground text-xs" : "text-foreground"}>
                {description}
              </FormDescription>
            )}
            <FormControl>{renderInput({ field })}</FormControl>
          </Wrapper>
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
