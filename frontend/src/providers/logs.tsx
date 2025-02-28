"use client";

import { useFetch } from "@/hooks/fetch";
import { Log } from "@formhook/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useError } from "./error";

interface LogsContextType {
  logs: Log[] | null;
  isLoading: boolean;
  refreshLogs: () => Promise<void>;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: ReactNode }) {
  const { get } = useFetch();
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useError();
  const fetchedRef = useRef(false);

  const refreshLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await get("logs/all");

      if (response.success && response.data?.logs) {
        setLogs(response.data.logs);
      } else {
        setLogs([]);
      }
    } catch (err) {
      handleError({
        message: "Failed to fetch logs",
        description: (err as Error).message,
      });
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [get, handleError]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      refreshLogs();
    }
  }, [refreshLogs]);

  return (
    <LogsContext.Provider
      value={{
        logs,
        isLoading,
        refreshLogs,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
}

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) throw new Error("useLogs must be used within LogsProvider");
  return context;
};
