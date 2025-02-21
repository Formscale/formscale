"use client";

import { ResendOtp, ResendOtpSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import FormPart from "@/components/form-part";
import { Form } from "@/components/ui/form";
import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { useAuth } from "@/providers/auth";
import AuthButton from "../components/button";
import AuthHeader from "../components/header";

const formFields = [{ name: "email", description: "Email", placeholder: "dris@formhook.com", type: "email" }];

export default function ResendPage() {
  const { setEmail, email } = useAuth();
  const { post, isLoading } = useFetch();
  const { handleError } = useError();
  const router = useRouter();

  const form = useForm<ResendOtp>({
    resolver: zodResolver(ResendOtpSchema),
    defaultValues: {
      email: email,
    },
  });

  async function onSubmit(values: ResendOtp) {
    try {
      const data = await post("auth/resend", values);

      if (data.success && data.data?.email) {
        setEmail(data.data.email);
        router.push("/verify");
      }
    } catch (error) {
      handleError({
        message: "Resend failed",
        description: (error as Error).message,
      });
    }
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
