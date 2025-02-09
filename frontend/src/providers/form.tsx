"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { Form } from "@formhook/types";

interface FormContext {
  form: Form | null;
  setForm: (form: Form | null) => void;
  updateForm: (updates: Partial<Form>) => void;
}

const FormContext = createContext<FormContext | undefined>(undefined);

export function FormProvider({ children, initialForm }: { children: ReactNode; initialForm: Form | null }) {
  const [form, setForm] = useState<Form | null>(initialForm);

  const updateForm = (updates: Partial<Form>) => {
    setForm((currentForm) => (currentForm ? { ...currentForm, ...updates } : null));
  };

  return <FormContext.Provider value={{ form, setForm, updateForm }}>{children}</FormContext.Provider>;
}

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used within FormProvider");
  return context;
};
