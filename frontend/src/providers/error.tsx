"use client";

import { Toaster } from "@/components/ui/sonner";
import { createContext, useContext } from "react";
import { toast } from "sonner";

type ToastType = "success" | "warning" | "info";

interface ErrorContextType {
  handleError: (error: Error | { message: string; description?: string }) => void;
  handleToast: (type: ToastType, message: string, description?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error | { message: string; description?: string }) => {
    toast.dismiss();
    const description =
      error && typeof error === "object" && "description" in error ? (error.description as string) : undefined;

    toast.error(error.message || "An unexpected error occurred", { description });
  };

  const handleToast = (type: ToastType, message: string, description?: string) => {
    toast.dismiss();
    const title = message || type.charAt(0).toUpperCase() + type.slice(1);
    toast[type](title, {
      description: description || undefined,
    });
  };

  return (
    <ErrorContext.Provider value={{ handleError, handleToast }}>
      {children}
      <Toaster />
    </ErrorContext.Provider>
  );
}

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
