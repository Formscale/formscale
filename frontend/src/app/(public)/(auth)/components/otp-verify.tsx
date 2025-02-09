"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { OtpSchema, Otp } from "@formhook/types";

import { Form } from "@/components/ui/form";
import FormPart from "@/components/form-part";
import AuthHeader from "./header";
import AuthButton from "./button";
import { useAuth } from "@/providers/auth";

export default function OtpVerify() {
  const { email } = useAuth();

  const form = useForm<Otp>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(values: Otp) {
    console.log(values);
  }

  return (
    <>
      <AuthHeader title="Verify your email" description={`Enter the OTP sent to ${email}`} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-3 ">
          <FormPart form={form} name="otp" type="text" placeholder="123456" isOtp={true} />
          <AuthButton text="Verify Email" />
        </form>
      </Form>
    </>
  );
}
