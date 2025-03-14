"use client";

import { FormSkeleton } from "@/components/default-dialog";
import { useUser } from "@/providers";
import { useError } from "@/providers/error";
import { Feedback, FeedbackSchema } from "@formscale/types";
import { Popover, PopoverContent, PopoverTrigger } from "@formscale/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function FeedbackForm({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { handleToast, handleError } = useError();
  const [open, setOpen] = useState(false);

  const form = useForm<Feedback>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      userId: user?.id?.toString(),
      email: user?.email?.toString(),
      message: "",
      anonymous: false,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        userId: user.id?.toString(),
        email: user.email?.toString(),
        message: "",
        anonymous: false,
      });
    }
  }, [user, form]);

  // console.log(form.formState.errors);

  async function onSubmit(values: Feedback) {
    setIsLoading(true);

    fetch("https://api.formscale.dev/s/6za5792f", {
      method: "POST",
      body: (() => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
        return formData;
      })(),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          handleToast("success", "Thanks for your feedback!", "Your message has been sent.");
          setOpen(false);
          form.reset();
        } else {
          return response.json().then((data: any) => {
            const error = data.error || "Submission failed. Please try again.";
            handleError(error);
          });
        }
      })
      .catch((error) => {
        handleError(error.message || "Network error. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const fields = [
    {
      name: "message",
      type: "textarea",
      placeholder: "Your ideas to improve your experience...",
    },
    {
      name: "anonymous",
      type: "checkbox",
      description: "Send Anonymously",
      placeholder: "false",
      children: <p className="text-xs text-muted-foreground -mt-1">Don&apos;t be shy, we&apos;ll listen either way.</p>,
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96 mt-1.5" align="end">
        <FormSkeleton form={form} onSubmitAction={onSubmit} fields={fields} disabled={isLoading} buttonText="Share" />
      </PopoverContent>
    </Popover>
  );
}
