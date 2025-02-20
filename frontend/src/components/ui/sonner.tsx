"use client";

import { CheckCircledIcon, CrossCircledIcon, SymbolIcon } from "@radix-ui/react-icons";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // theme={theme as ToasterProps["theme"]}
      className="toaster group font-heading-pro shadow-none"
      icons={{
        success: <CheckCircledIcon className="h-4 w-4" />,
        error: <CrossCircledIcon className="h-4 w-4" />,
        loading: <SymbolIcon className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-sm group-[.toaster]:gap-2 group-[.toaster]:py-4",
          title: "font-bold",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:mt-0.5",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
