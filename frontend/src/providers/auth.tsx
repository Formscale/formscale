"use client";

import { User } from "@formhook/types";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Auth } from "../lib/auth";
import { useUser } from "./user";

interface AuthContext {
  email: string;
  setEmail: (email: string) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const { setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const token = Auth.getToken();
    if (token && Auth.isTokenExpired(token)) {
      Auth.removeToken();
      setUser(null);
      setEmail("");
      router.push("/login");
    }
  }, [setUser, router]);

  const login = useCallback(
    (token: string, user: User) => {
      Auth.setToken(token);
      setUser(user);
      setEmail("");
      router.push("/forms");
    },
    [setUser, router]
  );

  const logout = useCallback(() => {
    Auth.removeToken();
    setUser(null);
    setEmail("");
    router.push("/login");
  }, [setUser, router]);

  const value = {
    email,
    setEmail,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
