"use client";

import { Login, LoginSchema } from "@formhook/types";
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

const formFields = [
  { name: "email", description: "Email", placeholder: "dris@formhook.com", type: "email" },
  { name: "password", description: "Password", placeholder: "********", type: "password" },
];

export default function LoginPage() {
  const { setEmail, startVerification, isVerifying } = useAuth();
  const { post, isLoading } = useFetch<Login>();
  const { handleError } = useError();

  const form = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: Login) {
    try {
      const data = await post("auth/login", values);
    } catch (error) {
      if ((error as any).status === 403) {
        setEmail(values.email);
        startVerification();
      } else {
        handleError({
          message: "Login failed",
          description: (error as Error).message,
        });
      }
    }
  }

  if (isVerifying) {
    return <OtpVerify />;
  }

  return (
    <>
      <AuthHeader title="Log in to FormHook" description="Don't have an account?" link="/signup" linkText="Sign Up." />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-3 ">
          {formFields.map((field) => (
            <FormPart key={field.name} form={form} {...field} />
          ))}
          <AuthButton text="Log In" props={{ disabled: isLoading }} />
        </form>
      </Form>
    </>
  );
}
