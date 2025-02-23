"use client";

import { useFetch } from "@/hooks/fetch";
import { Form } from "@formhook/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useError } from "./error";

interface FormContextType {
  form: Form | null;
  isLoading: boolean;
  refreshForm: () => Promise<void>;
  updateForm: (form: Form) => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children, formId }: { children: ReactNode; formId: string }) {
  const { get, put } = useFetch();
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useError();

  const refreshForm = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await get("forms/:id", {
        params: { id: formId },
      });

      if (response.success && response.data?.form) {
        setForm(response.data.form);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch form");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [get, formId, handleError]);

  const updateForm = useCallback(
    async (form: Form) => {
      try {
        setIsLoading(true);
        const response = await put("forms/:id/edit", form, {
          params: { id: formId },
        });

        if (response.success && response.data?.form) {
          setForm(response.data.form);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to update form");
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [put, formId, handleError]
  );

  useEffect(() => {
    refreshForm();
  }, [formId]);

  return (
    <FormContext.Provider
      value={{
        form,
        isLoading,
        refreshForm,
        updateForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used within FormProvider");
  return context;
};
