import { Auth } from "@/lib/auth";
import { AuthResponse, Login, Otp, ResendOtp, Signup } from "@formhook/types";
import { useState } from "react";

interface Endpoints {
  "auth/login": {
    input: Login;
    output: AuthResponse;
  };
  "auth/verify": {
    input: Otp & { email: string };
    output: AuthResponse;
  };
  "auth/signup": {
    input: Signup;
    output: { email: string };
  };
  "auth/resend": {
    input: ResendOtp;
    output: { email: string };
  };
}

interface FetchOptions<TEndpoint extends keyof Endpoints> extends RequestInit {
  onSuccess?: (data: ApiResponse<Endpoints[TEndpoint]["output"]>) => void;
  onError?: (error: Error) => void;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | { field: string; message: string }[];
}

export function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async <TEndpoint extends keyof Endpoints>(
    endpoint: TEndpoint,
    options: FetchOptions<TEndpoint> = {}
  ) => {
    if (!baseUrl) {
      const error = new Error("API_URL is not set");
      setError(error);
      throw error;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = Auth.getToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${baseUrl}/${endpoint}`, {
        credentials: "include",
        headers,
        ...options,
      });

      const data = (await response.json()) as ApiResponse<Endpoints[TEndpoint]["output"]>;
      console.log("data", data);

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
    delete: <TEndpoint extends keyof Endpoints>(endpoint: TEndpoint, options?: FetchOptions<TEndpoint>) =>
      fetchData(endpoint, { method: "DELETE", ...options }),
  };
}
