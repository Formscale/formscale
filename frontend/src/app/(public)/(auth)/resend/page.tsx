"use client";

import { useEffect } from "react";

import { ResendOtp, ResendOtpSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormPart from "@/components/form-part";
import { Form } from "@/components/ui/form";
import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { useAuth } from "@/providers/auth";
import AuthButton from "../components/button";
import AuthHeader from "../components/header";
import OtpVerify from "../components/otp-verify";
const formFields = [{ name: "email", description: "Email", placeholder: "dris@formhook.com", type: "email" }];

export default function LoginPage() {
  const { setEmail, startVerification, isVerifying, resetAuth } = useAuth();
  const { post, isLoading } = useFetch<ResendOtp>();
  const { handleError } = useError();

  useEffect(() => {
    resetAuth();
  }, [resetAuth]);

  const form = useForm<ResendOtp>({
    resolver: zodResolver(ResendOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ResendOtp) {
    try {
      const data = await post("auth/resend", values);

      if (data.success) {
        setEmail(values.email);
        startVerification();
      }
    } catch (error) {
      handleError({
        message: "Resend failed",
        description: (error as Error).message,
      });
    }
  }

  if (isVerifying) {
    return <OtpVerify />;
  }

  return (
    <>
      <AuthHeader title="Resend OTP" description="Don't have an account?" link="/signup" linkText="Sign Up." />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-3 ">
          {formFields.map((field) => (
            <FormPart key={field.name} form={form} {...field} />
          ))}
          <AuthButton text="Resend OTP" props={{ disabled: isLoading }} />
        </form>
      </Form>
    </>
  );
}
