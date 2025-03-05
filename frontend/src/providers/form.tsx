"use client";

import { useFetch } from "@/hooks/fetch";
import { Form, FormEdit } from "@formscale/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useError } from "./error";
import { useForms } from "./forms";

interface FormContextType {
  form: Form | null;
  isLoading: boolean;
  refreshForm: () => Promise<void>;
  updateForm: (form: FormEdit) => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children, formId }: { children: ReactNode; formId: string }) {
  const { get, put } = useFetch();
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError, handleToast } = useError();
  const { updateForm: updateFormContext } = useForms();
  const fetchedRef = useRef(false);

  const refreshForm = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await get("forms/:id", {
        params: { id: formId },
      });

      if (response.success && response.data?.form) {
        setForm(response.data.form);
        updateFormContext(response.data.form);
      }
    } catch (err) {
      handleError({
        message: "Failed to fetch form",
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [get, formId, handleError]);

  const updateForm = useCallback(
    async (form: FormEdit) => {
      try {
        setIsLoading(true);
        const response = await put("forms/:id/edit", form, {
          params: { id: formId },
        });

        if (response.success && response.data?.form) {
          setForm(response.data.form);
          updateFormContext(response.data.form);
          handleToast("success", "Form updated successfully");
        }
      } catch (err) {
        handleError({
          message: "Failed to update form",
          description: (err as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [put, formId, handleError]
  );

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      refreshForm();
    }
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
