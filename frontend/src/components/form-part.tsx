"use client";

import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface FormPartProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string;
  type: string;
  description?: string;
  placeholder: string;
  muted?: boolean;
  isOtp?: boolean;
  className?: string;
}

export default function FormPart<T extends FieldValues>({
  form,
  name,
  type,
  description,
  placeholder,
  isOtp = false,
  muted = false,
  className,
}: FormPartProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          {description && (
            <FormDescription className={muted ? "text-muted-foreground text-xs" : "text-foreground"}>
              {description}
            </FormDescription>
          )}
          <FormControl>
            {!isOtp ? (
              <Input type={type} placeholder={placeholder} {...field} className={className} />
            ) : (
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
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
