"use client";

import { Toaster } from "@/components/ui/sonner";
import { createContext, useContext } from "react";
import { toast } from "sonner";

interface ErrorContextType {
  handleError: (error: Error | { message: string; description?: string }) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error | { message: string; description?: string }) => {
    toast.dismiss();

    toast.error(error.message || "An unexpected error occurred", {
      description: "description" in error ? error.description : undefined,
    });
  };

  return (
    <ErrorContext.Provider value={{ handleError }}>
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
