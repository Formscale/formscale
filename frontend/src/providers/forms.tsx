"use client";

import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { Form } from "@formscale/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
interface FormsContextType {
  forms: Form[];
  isLoading: boolean;
  refreshForms: () => Promise<void>;
  addForm: (form: Form) => void;
  updateForm: (form: Form) => void;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export function FormsProvider({ children }: { children: ReactNode }) {
  const { get } = useFetch();
  const [forms, setForms] = useState<Form[]>([]);
  // const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useError();
  const fetchedRef = useRef(false);
  // const router = useRouter();

  const refreshForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await get("forms/all");

      if (response.success && response.data?.forms) {
        setForms(response.data.forms);
      } else {
        setForms([]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch form");
      handleError({
        message: "Failed to fetch form",
        description: (err as Error).message,
      });
      setForms([]);

      // if (forms.length === 0 && user?.development) {
      //   router.push("/onboarding");
      // }
    } finally {
      setIsLoading(false);
    }
  }, [get, handleError]);

  const addForm = useCallback((form: Form) => {
    setForms((prevForms) => [...prevForms, form]);
  }, []);

  const updateForm = useCallback((form: Form) => {
    setForms((prevForms) => prevForms.map((f) => (f.id === form.id ? form : f)));
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      refreshForms();
    }
  }, [refreshForms]);

  const value = { forms, isLoading, refreshForms, addForm, updateForm };

  return <FormsContext.Provider value={value}>{children}</FormsContext.Provider>;
}

export const useForms = () => {
  const context = useContext(FormsContext);
  if (!context) throw new Error("useForms must be used within FormsProvider");
  return context;
};
