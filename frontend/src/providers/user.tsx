"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { User } from "@formhook/types";

interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((currentUser) => (currentUser ? { ...currentUser, ...updates } : null));
  };

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
