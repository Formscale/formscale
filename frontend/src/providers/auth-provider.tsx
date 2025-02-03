"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface AuthContext {
  email: string;
  isVerifying: boolean;
  setEmail: (email: string) => void;
  startVerification: () => void;
  resetAuth: () => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const value = {
    email,
    isVerifying,
    setEmail,
    startVerification: () => setIsVerifying(true),
    resetAuth: () => {
      setEmail("");
      setIsVerifying(false);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
