"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, Login } from "@formhook/types";

import { Form } from "@/components/ui/form";
import FormPart from "@/components/form-part";
import AuthHeader from "../components/auth-header";
import AuthButton from "../components/auth-button";

const formFields = [
  { name: "email", description: "Email", placeholder: "dris@formhook.com", type: "email" },
  { name: "password", description: "Password", placeholder: "********", type: "password" },
];

export default function LoginPage() {
  const form = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: Login) {
    console.log(values);
  }

  return (
    <>
      <AuthHeader title="Log in to FormHook" description="Don't have an account?" link="/signup" linkText="Sign Up" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-3 ">
          {formFields.map((field) => (
            <FormPart key={field.name} form={form} {...field} />
          ))}
          <AuthButton text="Log In" />
        </form>
      </Form>
    </>
  );
}
