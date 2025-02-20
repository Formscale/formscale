"use client";

import { Otp, OtpSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormPart from "@/components/form-part";
import { Form } from "@/components/ui/form";
import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { useAuth } from "@/providers/auth";

import AuthButton from "./button";
import AuthHeader from "./header";

export default function OtpVerify() {
  const { email } = useAuth();
  const { post, isLoading } = useFetch<Otp>();
  const { handleError } = useError();

  const form = useForm<Otp>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  async function onSubmit(values: Otp) {
    try {
      const data = await post("auth/verify", values);
    } catch (error) {
      handleError({
        message: "Verification failed",
        description: (error as Error).message,
      });
    }
  }

  return (
    <>
      <AuthHeader
        title="Verify your email"
        description={`Enter the OTP sent to ${email}.`}
        link="/resend"
        linkText="Resend OTP."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-3 ">
          <FormPart form={form} name="otp" type="otp" placeholder="123456" />
          <AuthButton text="Verify Email" props={{ disabled: isLoading }} />
        </form>
      </Form>
    </>
  );
}
