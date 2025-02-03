"use client";

import Link from "next/link";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function SignupPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="flex flex-col items-start justify-center gap-1 w-full">
      <Image src="/logos/formhook-icon.svg" className="mb-4" alt="FormHook" width={20} height={20} />
      <h1 className="text-xl font-bold">Create a FormHook account</h1>
      <p className="text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">
          Log In
        </Link>
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormDescription className="text-foreground">Email address</FormDescription>
                <FormControl>
                  <Input placeholder="dris@formhook.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="action" className="w-full font-bold mt-4">
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  );
}
