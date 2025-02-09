import { useState } from "react";

interface FetchOptions<T> extends RequestInit {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T>(baseUrl: string = "/api") {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (endpoint: string, options: FetchOptions<T> = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
