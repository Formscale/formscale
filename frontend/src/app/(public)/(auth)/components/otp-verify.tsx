"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemaOtpVerify, OtpVerifySchema } from "@formhook/validations";

import { Form } from "@/components/ui/form";
import FormPart from "@/components/form-part";
import AuthHeader from "./auth-header";
import AuthButton from "./auth-button";

export default function OtpVerify() {
  const form = useForm<OtpVerifySchema>({
    resolver: zodResolver(schemaOtpVerify),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(values: OtpVerifySchema) {
    console.log(values);
  }

  return (
    <>
      <AuthHeader title="Verify your email" description="Enter the OTP sent to your email" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-3 ">
          <FormPart form={form} name="otp" type="text" placeholder="123456" isOtp={true} />
          <AuthButton text="Verify Email" />
        </form>
      </Form>
    </>
  );
}
