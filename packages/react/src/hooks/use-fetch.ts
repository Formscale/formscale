import { useState } from "react";

export interface Endpoints {
  "s/:id": {
    input: FormData;
    output: { message: string };
  };
}

interface FetchOptions<TEndpoint extends keyof Endpoints> extends RequestInit {
  onSuccess?: (data: ApiResponse<Endpoints[TEndpoint]["output"]>) => void;
  onError?: (error: Error) => void;
  params?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | { field: string; message: string }[];
}

export function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiUrl = "https://api.formscale.dev";

  const fetchData = async <TEndpoint extends keyof Endpoints>(
    endpoint: TEndpoint,
    options: FetchOptions<TEndpoint> = {}
  ) => {
    if (!apiUrl) {
      const error = new Error("API_URL is not set");
      setError(error);
      throw error;
    }

    try {
      setIsLoading(true);
      setError(null);

      // const token = Auth.getToken();

      const finalEndpoint = Object.entries(options.params || {}).reduce(
        (path, [param, value]) => path.replace(`:${param}`, value),
        endpoint.toString()
      );

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
        // ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${apiUrl}/${finalEndpoint}`, {
        credentials: "include",
        headers,
        ...options,
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter ? parseInt(retryAfter, 10) : 60;

        const error = new Error(`Rate limit exceeded. Please try again in ${waitTime} seconds.`);
        (error as any).status = 429;
        (error as any).retryAfter = waitTime;
        throw error;
      }

      let data;
      try {
        data = (await response.json()) as ApiResponse<Endpoints[TEndpoint]["output"]>;
      } catch (jsonError) {
        const error = new Error(`Failed to parse response: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }

      if (!response.ok) {
        const errorMessage = Array.isArray(data.error) ? data.error.map((e) => e.message).join(", ") : data.error;
        const error = new Error(errorMessage || `HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        throw error;
      }

      options.onSuccess?.(data as ApiResponse<Endpoints[TEndpoint]["output"]>);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");

      if ((error as any).status === 429) {
        console.warn(`Rate limited. Retry after ${(error as any).retryAfter} seconds`);
      }

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
    get: <TEndpoint extends keyof Endpoints>(endpoint: TEndpoint, options?: FetchOptions<TEndpoint>) =>
      fetchData(endpoint, { method: "GET", ...options }),
    post: <TEndpoint extends keyof Endpoints>(
      endpoint: TEndpoint,
      data: Endpoints[TEndpoint]["input"],
      options?: FetchOptions<TEndpoint>
    ) => fetchData(endpoint, { method: "POST", body: JSON.stringify(data), ...options }),
    put: <TEndpoint extends keyof Endpoints>(
      endpoint: TEndpoint,
      data: Endpoints[TEndpoint]["input"],
      options?: FetchOptions<TEndpoint>
    ) => fetchData(endpoint, { method: "PUT", body: JSON.stringify(data), ...options }),
    patch: <TEndpoint extends keyof Endpoints>(
      endpoint: TEndpoint,
      data: Endpoints[TEndpoint]["input"],
      options?: FetchOptions<TEndpoint>
    ) => fetchData(endpoint, { method: "PATCH", body: JSON.stringify(data), ...options }),
    remove: <TEndpoint extends keyof Endpoints>(endpoint: TEndpoint, options?: FetchOptions<TEndpoint>) =>
      fetchData(endpoint, { method: "DELETE", ...options }),
  };
}
