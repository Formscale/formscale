"use client";

import Link from "next/link";

import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { Signup, SignupSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormPart from "@/components/form-part";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/providers/auth";
import AuthButton from "../components/button";
import AuthHeader from "../components/header";
import OtpVerify from "../components/otp-verify";

const formFields = [
  { name: "name", description: "Name", placeholder: "Dris Elamri", type: "text" },
  { name: "email", description: "Email", placeholder: "dris@formhook.com", type: "email" },
  { name: "password", description: "Password", placeholder: "********", type: "password" },
  { name: "passwordConfirmation", description: "Confirm Password", placeholder: "********", type: "password" },
];

export default function SignupPage() {
  const { isVerifying, startVerification, setEmail } = useAuth();
  const { post, isLoading } = useFetch<Signup>();
  const { handleError } = useError();

  const form = useForm<Signup>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: Signup) {
    try {
      const data = await post("auth/signup", values);

      if (data.success && data.data?.email) {
        setEmail(data.data.email);
        startVerification();
      }
    } catch (error) {
      handleError({
        message: "Signup failed",
        description: (error as Error).message,
      });
    }
  }

  if (isVerifying) {
    return <OtpVerify />;
  }

  return (
    <>
      <AuthHeader
        title="Create your FormHook account"
        description="Already have an account?"
        link="/login"
        linkText="Log In."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-3 ">
          {formFields.map((field) => (
            <FormPart key={field.name} form={form} {...field} />
          ))}
          <AuthButton text="Create Account" props={{ disabled: isLoading }} />
          <span className="text-xs mt-2 text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </span>
        </form>
      </Form>
    </>
  );
}
