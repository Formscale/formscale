"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Otp, OtpSchema, User } from "@formscale/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { useAuth } from "@/providers/auth";
import { Form, FormPart } from "@formscale/ui/components";

import AuthButton from "../components/button";
import AuthHeader from "../components/header";

export default function VerifyPage() {
  const { email, login } = useAuth();
  const { post, isLoading } = useFetch();
  const { handleError } = useError();
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

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

      if (data.success && data.data?.token) {
        login(data.data.token, data.data.user as User);
      }
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
