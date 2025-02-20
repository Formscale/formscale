import { useState } from "react";

interface FetchOptions<T> extends RequestInit {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | { field: string; message: string }[];
}

export function useFetch<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async (endpoint: string, options: FetchOptions<T> = {}) => {
    if (!baseUrl) {
      const error = new Error("API_URL is not set");
      setError(error);
      throw error;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = (await response.json()) as ApiResponse<T>;
      console.log("data", data);

      if (!response.ok) {
        const errorMessage = Array.isArray(data.error) ? data.error.map((e) => e.message).join(", ") : data.error;
        const error = new Error(errorMessage || `HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        throw error;
      }

      options.onSuccess?.(data as T);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    get: (endpoint: string, options?: FetchOptions<T>) => fetchData(endpoint, { method: "GET", ...options }),
    post: (endpoint: string, data: T, options?: FetchOptions<T>) =>
      fetchData(endpoint, { method: "POST", body: JSON.stringify(data), ...options }),
    put: (endpoint: string, data: T, options?: FetchOptions<T>) =>
      fetchData(endpoint, { method: "PUT", body: JSON.stringify(data), ...options }),
    patch: (endpoint: string, data: T, options?: FetchOptions<T>) =>
      fetchData(endpoint, { method: "PATCH", body: JSON.stringify(data), ...options }),
    delete: (endpoint: string, options?: FetchOptions<T>) => fetchData(endpoint, { method: "DELETE", ...options }),
  };
}
