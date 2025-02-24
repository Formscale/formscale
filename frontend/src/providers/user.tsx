"use client";

import { useFetch } from "@/hooks/fetch";
import { Auth } from "@/lib/auth";
import { EditUser, SafeUser } from "@formhook/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useError } from "./error";

interface UserContext {
  user: SafeUser | null;
  isLoading: boolean;
  setUser: (user: SafeUser | null) => void;
  updateUser: (user: EditUser) => Promise<void>;
}

const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useError();
  const { get, put } = useFetch();

  useEffect(() => {
    const fetchUser = async () => {
      if (Auth.getToken()) {
        try {
          setIsLoading(true);
          const response = await get("user/profile");

          if (response.data?.user) {
            setUser(response.data.user);
          }
        } catch (error) {
          handleError({ message: "Error fetching user", description: (error as Error).message });
        }
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const updateUser = useCallback(
    async (user: EditUser) => {
      try {
        setIsLoading(true);
        const response = await put("user/edit", user);

        if (response.success && response.data?.user) {
          setUser(response.data.user);
          Auth.setToken(response.data.token);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to update user");
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [put, handleError]
  );

  const value = {
    user,
    setUser,
    updateUser,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
