"use client";

import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { Form } from "@formhook/types";
import { useCallback, useEffect, useState } from "react";

export function useForms() {
  const { get } = useFetch();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useError();

  const getForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await get("forms/all");

      if (response.success && response.data?.forms) {
        setForms(response.data.forms);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch form");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [get, handleError]);

  useEffect(() => {
    getForms();
  }, []);

  return { forms, isLoading, getForms };
}
