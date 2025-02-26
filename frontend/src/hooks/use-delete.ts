"use client";

import { useError } from "@/providers";
import { useState } from "react";
import { Endpoints, useFetch } from "./fetch";

interface UseDeleteOptions {
  onSuccess?: () => Promise<void>;
}

export function useDelete() {
  const { remove } = useFetch();
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleError } = useError();

  const deleteItem = async (
    endpoint: keyof Endpoints,
    params: Record<string, string> = {},
    options: UseDeleteOptions = {}
  ) => {
    try {
      setIsDeleting(true);
      const response = await remove(endpoint, { params });

      if (options.onSuccess) {
        await options.onSuccess();
      }

      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete item");
      handleError(error);
      return { success: false, error };
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteItem, isDeleting };
}
